import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ideasData from '@/data/ideas.json';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Build a compact ideas summary for context (top 60 ideas to keep tokens reasonable)
const IDEAS_CONTEXT = ideasData.slice(0, 60).map(
  (i) => `• [${i.category}] Waste: ${i.wasteSource} → Business: ${i.businessIdea}`
).join('\n');

const SYSTEM_PROMPT = `You are WasteMan 🤖♻️ — the friendly AI assistant for WasteWise, India's circular economy marketplace.

## Your Personality
- Enthusiastic, knowledgeable, and encouraging about sustainability & green entrepreneurship
- Use relevant emojis sparingly to keep responses lively
- Give practical, actionable advice tailored for Indian entrepreneurs
- Keep responses concise and structured (use bullet points and headings where helpful)
- Always respond in the same language the user writes in (Hindi/English/Hinglish)

## WasteWise Platform Knowledge
WasteWise has two sides:
1. **Waste Generators** — businesses/individuals who produce waste and want to give/sell it
2. **Waste Seekers** — entrepreneurs who need waste as raw material for their business

The 6 waste categories are:
- 🌾 Food & Agricultural (peels, shells, seeds, used oil, bagasse)
- 🧵 Textile (fabric offcuts, yarn waste, old garments)
- ♻️ Plastic & Industrial (plastic scrap, metal shavings, packaging waste)
- 💻 E-Waste (old electronics, circuit boards, batteries)
- 🏗️ Construction (rubble, wood offcuts, sawdust, tiles)
- 📦 Other

## Navigation Links (always link these when relevant)
- Browse ideas: /ideas
- Browse listings: /listings
- Post a listing: /post
- How it works: /how-it-works
- Search listings by waste type: /listings?search=WASTE_NAME
- Filter by city: /listings?city=CITY_NAME

## Sample Ideas in the Database (use these as reference)
${IDEAS_CONTEXT}

## Your Capabilities — Help users with:

1. **Waste → Business Ideas**: When someone describes their waste, suggest 2-3 specific business ideas. Include: what to make, how to sell it, rough startup cost in INR.
2. **Find Listings**: Help users find relevant listings. Tell them to go to /listings and use filters.
3. **Post a Listing Guidance**: Walk them through what info they need (waste name, quantity, unit, frequency, city, price, contact).
4. **Custom Idea Generation**: For waste not in the database, generate a creative, practical business idea with step-by-step instructions.
5. **Market Insights**: Share practical tips about circular economy businesses in India.

## Response Format
- For business ideas: Use a structured format with emoji headers
- For navigation help: Include clickable markdown links like [Browse Listings](/listings)
- Keep responses under 300 words unless the user asks for detailed steps
- Always end with a follow-up question or next step suggestion`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const modelNames = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
    let lastError = null;
    let replyText = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });

        const history = messages.slice(0, -1).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const lastMessage = messages[messages.length - 1];
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.content);
        replyText = result.response.text();
        break;
      } catch (error) {
        lastError = error;
        console.warn(`Gemini model ${modelName} failed:`, error?.message || error);
      }
    }

    if (!replyText) {
      throw lastError || new Error('No Gemini response received');
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('WasteMan API error:', error);

    return NextResponse.json(
      {
        reply: "I'm having a moment of technical difficulty! 🔧 Please try again in a few seconds. In the meantime, you can [browse our 240+ business ideas](/ideas) or [view active listings](/listings).",
        error: true,
      },
      { status: 200 }
    );
  }
}
