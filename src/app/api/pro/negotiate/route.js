import { NextResponse } from 'next/server';

const NEGOTIATION_PROMPT = `You are WasteWise Pro Negotiator — an AI agent that negotiates waste material purchases on behalf of a buyer.

## Your Negotiation Style
- Professional, respectful, and data-driven
- Always start with a fair but lower opening offer (15-25% below asking)
- Use bulk purchase leverage, long-term supply contract benefits, and logistics sharing as negotiation tools
- Cite market rates when available
- Never be aggressive or disrespectful — build relationships
- After 3-4 exchanges, synthesize a deal summary

## Rules
- You are negotiating on behalf of the buyer (our user)
- The seller's listing data and conversation history are provided
- Generate BOTH your next message AND a simulated seller response
- Track deal progress: opening → counter → negotiation → offer_ready
- When a reasonable deal is reached, set status to "offer_ready" and include a dealSummary

Return ONLY valid JSON:
{
  "agentMessage": "Your negotiation message to the seller",
  "sellerResponse": "Simulated seller's reply (realistic, sometimes pushback)",
  "status": "negotiating|offer_ready",
  "dealSummary": null | {
    "agreedPrice": "₹X/unit",
    "quantity": "X units",
    "frequency": "weekly/monthly",
    "logistics": "Pickup by buyer / Delivery by seller",
    "paymentTerms": "Advance / On delivery / Net 15",
    "totalValue": "₹X/month",
    "savings": "X% below original asking price"
  }
}`;

export async function POST(request) {
  try {
    const { listing, targetPrice, conversationHistory, round } = await request.json();

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing data is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_PRO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Pro AI service is not configured.' },
        { status: 503 }
      );
    }

    const currentRound = round || 1;
    const priceInfo = listing.priceAmount
      ? `₹${listing.priceAmount}/${listing.unit}`
      : listing.price || listing.budget || 'negotiable';

    const userPrompt = `Negotiate for this waste listing:
- Material: ${listing.wasteName}
- Seller: ${listing.contactName}
- Location: ${listing.location}${listing.area ? ', ' + listing.area : ''}
- Quantity: ${listing.quantity} ${listing.unit} / ${listing.frequency}
- Asking Price: ${priceInfo}
- Buyer's Target Price: ${targetPrice || 'Get the best deal possible'}
- Negotiation Round: ${currentRound} of 4
${conversationHistory ? `\nPrevious conversation:\n${conversationHistory}` : ''}

${currentRound >= 3 ? 'This is a late round — try to reach a deal summary if reasonable.' : ''}
${currentRound >= 4 ? 'FINAL ROUND — you MUST produce a dealSummary with status "offer_ready".' : ''}`;

    const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: NEGOTIATION_PROMPT }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
            }),
          }
        );

        if (!geminiRes.ok) throw new Error(`Gemini returned ${geminiRes.status}`);

        const data = await geminiRes.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleaned = rawText.replace(/```json\s*|\s*```/g, '').trim();
          const result = JSON.parse(cleaned);
          return NextResponse.json({ success: true, ...result, round: currentRound });
        }

        throw new Error('Empty Gemini response');
      } catch (err) {
        lastError = err;
        console.warn(`Pro negotiate model ${modelName} failed:`, err.message);
      }
    }

    // Fallback responses
    const fallbackMessages = [
      {
        agentMessage: `Hi ${listing.contactName}! I'm interested in your ${listing.wasteName} listing (${listing.quantity} ${listing.unit}/${listing.frequency}). We're looking for a long-term supply partnership. Would you consider ₹${Math.round((listing.priceAmount || 10) * 0.8)}/${listing.unit} for a committed monthly pickup?`,
        sellerResponse: `Hello! Thanks for reaching out. I appreciate the interest in a long-term deal. However, ₹${Math.round((listing.priceAmount || 10) * 0.8)} is a bit low for us. We could consider ₹${Math.round((listing.priceAmount || 10) * 0.95)} if you commit to weekly pickups and handle logistics.`,
        status: 'negotiating',
        dealSummary: null,
      },
      {
        agentMessage: `That's fair. How about we meet at ₹${Math.round((listing.priceAmount || 10) * 0.88)}/${listing.unit}? We'll arrange our own pickup and commit to a 3-month supply contract. This gives you guaranteed offtake with zero logistics hassle.`,
        sellerResponse: `A 3-month contract does sound attractive. I can do ₹${Math.round((listing.priceAmount || 10) * 0.9)}/${listing.unit} with your pickup. Minimum order of ${Math.round(listing.quantity * 0.8)} ${listing.unit} per ${listing.frequency} though.`,
        status: 'negotiating',
        dealSummary: null,
      },
      {
        agentMessage: `Deal! ₹${Math.round((listing.priceAmount || 10) * 0.9)}/${listing.unit} works for us. Let me put together the deal summary for our buyer to review and confirm.`,
        sellerResponse: `Sounds good! Looking forward to a smooth partnership. Please have your buyer confirm and we can start next week.`,
        status: 'offer_ready',
        dealSummary: {
          agreedPrice: `₹${Math.round((listing.priceAmount || 10) * 0.9)}/${listing.unit}`,
          quantity: `${listing.quantity} ${listing.unit}`,
          frequency: listing.frequency,
          logistics: 'Pickup by buyer',
          paymentTerms: 'On delivery',
          totalValue: `₹${Math.round((listing.priceAmount || 10) * 0.9 * listing.quantity)}/month`,
          savings: '10% below asking price',
        },
      },
    ];

    const msgIndex = Math.min(currentRound - 1, fallbackMessages.length - 1);
    return NextResponse.json({
      success: true,
      ...fallbackMessages[msgIndex],
      round: currentRound,
      fallback: true,
    });
  } catch (error) {
    console.error('Pro negotiate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Negotiation failed.' },
      { status: 500 }
    );
  }
}
