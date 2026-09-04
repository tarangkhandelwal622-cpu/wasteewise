import { NextResponse } from 'next/server';

const BLUEPRINT_PROMPT = `You are WasteWise Pro Business Architect — you generate comprehensive, investor-ready business blueprints for waste-to-wealth startups in India.

## Your Knowledge Base
You have deep knowledge of successful waste businesses: Gravita India (metals), Phool.co (flowers), Cashify (e-waste), Banyan Nation (plastic), Attero (batteries), Kabadiwala Connect (scrap collection), GEM Enviro (PET recycling), Nepra (dry waste), Saahas Zero Waste (consulting), ExtraCarbon (marketplace), Sampurn(e)arth (community waste), Re Sustainability (integrated), Lucro Plastecycle (plastic roads), Namo E-Waste (certified recycling), Karma Recycling (e-waste collection).

## Output Format
Return ONLY valid JSON:
{
  "businessName": "Catchy business name",
  "tagline": "One-line pitch",
  "executiveSummary": "3-4 sentence overview",
  "supplyChain": {
    "sources": ["Source 1 with details", "Source 2"],
    "processing": "How raw waste is transformed",
    "distribution": "How products reach customers"
  },
  "financials": {
    "startupCost": "₹X total",
    "breakdown": [
      {"item": "Equipment", "cost": "₹X"},
      {"item": "Rent & Setup", "cost": "₹X"},
      {"item": "Working Capital", "cost": "₹X"},
      {"item": "Licenses & Compliance", "cost": "₹X"}
    ],
    "monthlyExpenses": "₹X",
    "monthlyRevenue": "₹X — ₹Y (Month 1-6) → ₹Y — ₹Z (Month 7-12)",
    "breakEvenMonth": 8,
    "yearOneProfit": "₹X"
  },
  "marketingStrategy": {
    "online": ["Channel 1", "Channel 2"],
    "offline": ["Channel 1", "Channel 2"],
    "partnerships": ["Partner type 1", "Partner type 2"]
  },
  "compliance": [
    {"license": "License Name", "authority": "Issuing Body", "timeline": "X weeks", "cost": "₹X"}
  ],
  "growthRoadmap": [
    {"quarter": "Q1", "milestone": "Description"},
    {"quarter": "Q2", "milestone": "Description"},
    {"quarter": "Q3", "milestone": "Description"},
    {"quarter": "Q4", "milestone": "Description"}
  ],
  "competitiveAdvantage": "What makes this business defensible",
  "mentorCompanies": ["Company 1 — what to learn", "Company 2 — what to learn"]
}`;

export async function POST(request) {
  try {
    const { strategy, acceptedDeals, investmentLimit } = await request.json();

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy data is required.' },
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

    const dealsContext = acceptedDeals?.length
      ? `\nAccepted Supply Deals:\n${acceptedDeals.map((d, i) => `${i + 1}. ${d.wasteName} from ${d.contactName} in ${d.location} — ${d.agreedPrice || 'negotiated price'}, ${d.quantity} ${d.unit}/${d.frequency}`).join('\n')}`
      : '\nNo specific supply deals finalized yet — generate estimates.';

    const userPrompt = `Generate a complete business blueprint for:
- Strategy: ${strategy.title}
- Description: ${strategy.description}
- Investment Limit: ₹${investmentLimit?.toLocaleString('en-IN') || '5,00,000'}
- Inspired By: ${strategy.inspiredBy?.join(', ') || 'Multiple waste companies'}
- Waste Input: ${strategy.wasteInput}
- Output Product: ${strategy.outputProduct}
${dealsContext}`;

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
              systemInstruction: { parts: [{ text: BLUEPRINT_PROMPT }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.25 },
            }),
          }
        );

        if (!geminiRes.ok) throw new Error(`Gemini returned ${geminiRes.status}`);

        const data = await geminiRes.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleaned = rawText.replace(/```json\s*|\s*```/g, '').trim();
          const blueprint = JSON.parse(cleaned);
          return NextResponse.json({ success: true, blueprint });
        }

        throw new Error('Empty Gemini response');
      } catch (err) {
        lastError = err;
        console.warn(`Pro blueprint model ${modelName} failed:`, err.message);
      }
    }

    // Fallback blueprint
    return NextResponse.json({
      success: true,
      blueprint: {
        businessName: strategy.title,
        tagline: `Turning ${strategy.wasteInput} into profitable ${strategy.outputProduct}`,
        executiveSummary: `${strategy.title} is a waste-to-wealth venture that sources ${strategy.wasteInput} from local generators and transforms it into ${strategy.outputProduct}. Inspired by the success of ${strategy.inspiredBy?.join(' and ') || 'leading waste companies'}, this business targets a growing market of eco-conscious consumers and B2B buyers. With an estimated investment of ${strategy.startupCost}, the venture aims to break even within ${strategy.breakEvenMonths || 8} months.`,
        supplyChain: {
          sources: ['Local waste generators via WasteWise marketplace', 'Direct partnerships with factories and businesses'],
          processing: 'Collection → Sorting → Cleaning → Processing → Quality Testing → Packaging',
          distribution: 'B2B direct sales, Online marketplaces (Amazon/Flipkart), Local retail partnerships'
        },
        financials: {
          startupCost: strategy.startupCost || '₹2,00,000 — ₹5,00,000',
          breakdown: [
            { item: 'Processing Equipment', cost: '₹1,00,000' },
            { item: 'Rent & Facility Setup', cost: '₹50,000' },
            { item: 'Working Capital (3 months)', cost: '₹75,000' },
            { item: 'Licenses & Legal', cost: '₹25,000' }
          ],
          monthlyExpenses: '₹40,000 — ₹60,000',
          monthlyRevenue: strategy.monthlyRevenue || '₹50,000 — ₹1,50,000',
          breakEvenMonth: strategy.breakEvenMonths || 8,
          yearOneProfit: '₹2,00,000 — ₹6,00,000'
        },
        marketingStrategy: {
          online: ['Instagram/YouTube content marketing', 'WasteWise marketplace listing', 'Google My Business'],
          offline: ['Local trade shows', 'Direct B2B outreach', 'Partnership with waste collection networks'],
          partnerships: ['Municipal waste management bodies', 'FMCG companies (EPR compliance)', 'E-commerce platforms']
        },
        compliance: [
          { license: 'MSME/Udyam Registration', authority: 'Ministry of MSME', timeline: '1 week', cost: 'Free' },
          { license: 'GST Registration', authority: 'GST Portal', timeline: '1 week', cost: 'Free' },
          { license: 'Consent to Operate', authority: 'State Pollution Control Board', timeline: '4-8 weeks', cost: '₹5,000 — ₹15,000' },
          { license: 'Trade License', authority: 'Local Municipal Corporation', timeline: '2-3 weeks', cost: '₹2,000 — ₹5,000' }
        ],
        growthRoadmap: [
          { quarter: 'Q1', milestone: 'Setup facility, obtain licenses, secure 3-5 waste suppliers' },
          { quarter: 'Q2', milestone: 'Start production, acquire first 10 B2B customers, refine processes' },
          { quarter: 'Q3', milestone: 'Scale to full capacity, launch online sales, break even' },
          { quarter: 'Q4', milestone: 'Expand supplier network, explore second product line, plan second facility' }
        ],
        competitiveAdvantage: 'First-mover advantage in local market, established supply chain through WasteWise, quality parity with virgin materials, strong sustainability narrative',
        mentorCompanies: [
          ...(strategy.inspiredBy || ['Phool.co', 'Gravita India']).map(c => `${c} — study their scaling playbook and supply chain strategy`)
        ]
      },
      fallback: true,
    });
  } catch (error) {
    console.error('Pro blueprint API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate business blueprint.' },
      { status: 500 }
    );
  }
}
