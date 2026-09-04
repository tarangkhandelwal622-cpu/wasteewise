import { NextResponse } from 'next/server';
import { getListings } from '@/lib/data-service';

const COMPANY_STRATEGIES = `
## Real Waste-to-Wealth Companies — Learn From Their Strategies

### 1. Gravita India (Lead & Metal Recycling)
- Recycles lead-acid batteries, aluminum, and plastic waste
- Revenue: ₹3,000+ Cr | Listed on BSE/NSE
- Strategy: Backward integration, multi-metal recovery, export to 70+ countries
- Key lesson: Compliance-first approach (CPCB authorized), economies of scale

### 2. Phool.co (Temple Flower Waste → Luxury Products)
- Converts discarded temple flowers into luxury incense (Phool), bio-leather (Fleather™), and vermicompost
- Strategy: Premium branding, social impact storytelling, B-Corp certification
- Key lesson: Take the lowest-value waste stream and create the highest-value product category

### 3. Cashify (E-Waste Refurbishment & Buyback)
- India's largest re-commerce platform for used electronics
- Strategy: AI-powered pricing engine, doorstep pickup, refurbishment centers, resale marketplace
- Key lesson: Build trust through transparent grading systems and warranties on refurbished goods

### 4. Namo E-Waste (Certified E-Waste Recycling)
- Government-authorized e-waste recycler and dismantler
- Strategy: B2B partnerships with IT companies, certified data destruction, precious metal recovery
- Key lesson: Regulatory compliance as a competitive moat — certification = trust = corporate contracts

### 5. Kabadiwala Connect (Tech-Enabled Scrap Collection)
- Digital platform connecting households with verified scrap dealers
- Strategy: App-based scheduling, transparent pricing, doorstep pickup
- Key lesson: Technology layer on informal economy = massive efficiency gains

### 6. Banyan Nation (Plastic Recycling)
- "Better Plastic" brand — produces recycled plastic granules meeting virgin-plastic quality
- Strategy: Direct sourcing from waste generators, proprietary cleaning tech, B2B supply to FMCG brands
- Key lesson: Quality parity with virgin materials unlocks premium corporate buyers

### 7. Attero (Lithium Battery & E-Waste Recycling)
- Largest lithium-ion battery recycler in Asia
- Strategy: Patented hydrometallurgical process, extract cobalt/lithium/nickel, supply to battery manufacturers
- Key lesson: Deep-tech IP creates defensible competitive advantage in recycling

### 8. Saahas Zero Waste (Integrated Waste Management)
- End-to-end waste management for corporates, tech parks, and institutions
- Strategy: Source segregation training, composting, material recovery, zero-waste audits
- Key lesson: Consulting + operations model = recurring revenue from waste management contracts

### 9. Nepra Resource Management (Dry Waste Processing)
- Large-scale MRF (Material Recovery Facility) operator
- Strategy: Automated sorting lines, baling, selling sorted commodities to recyclers
- Key lesson: Volume is king — centralized processing of mixed dry waste at scale

### 10. GEM Enviro Management (PET Bottle Recycling — Dalmia Group)
- Converts PET bottles into recycled polyester fiber for textiles
- Strategy: EPR compliance services for FMCG brands, closed-loop recycling partnerships
- Key lesson: Extended Producer Responsibility (EPR) regulation creates guaranteed demand

### 11. ExtraCarbon (Online Scrap Marketplace)
- Digital marketplace for buying/selling industrial scrap and recyclables
- Strategy: Price discovery engine, bulk aggregation, logistics network
- Key lesson: Marketplace liquidity — more sellers attract more buyers and vice versa

### 12. Sampurn(e)arth (Dry Waste Management)
- Community-based dry waste collection and processing
- Strategy: Hyper-local collection networks, employment of waste workers, MRF operations
- Key lesson: Community-embedded model builds trust and ensures consistent supply

### 13. Re Sustainability (formerly Ramky Enviro)
- Integrated environmental services — waste, water, recycling
- Strategy: Municipal contracts, C&D waste processing, waste-to-energy plants
- Key lesson: Government partnerships and long-term contracts provide revenue stability

### 14. Karma Recycling (E-Waste Collection Network)
- Network of collection points for consumer e-waste
- Strategy: Incentivized drop-off (discounts/vouchers), certified recycling chain
- Key lesson: Consumer incentives dramatically increase e-waste collection rates

### 15. Lucro Plastecycle (Plastic Road Technology)
- Uses waste plastic in road construction as bitumen replacement
- Strategy: B2G (business-to-government) model, NHAI partnerships, patent on plastic-modified bitumen
- Key lesson: Infrastructure-grade applications for waste plastic = massive scale potential
`;

const SYSTEM_PROMPT = `You are WasteWise Pro AI — an elite circular-economy business strategist.

${COMPANY_STRATEGIES}

## Your Task
Given a waste type, investment limit, and category, generate exactly 3 tailored business strategies.
Each strategy MUST:
- Be inspired by at least one real company above (cite which one)
- Include realistic Indian market financial projections
- Account for the investment limit provided
- Be actionable for a first-time entrepreneur

Return ONLY valid JSON array (no markdown, no preamble):
[
  {
    "id": 1,
    "title": "Short catchy business name",
    "description": "2-3 sentence description",
    "inspiredBy": ["Company Name 1", "Company Name 2"],
    "wasteInput": "What waste you'll buy/collect",
    "outputProduct": "What you'll sell",
    "startupCost": "₹X — ₹Y",
    "monthlyRevenue": "₹X — ₹Y (after 6 months)",
    "breakEvenMonths": 6,
    "competitionLevel": "Low|Medium|High",
    "sustainabilityScore": 8,
    "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "keyRisks": ["Risk 1", "Risk 2"],
    "regulations": "Key licenses or compliance needed"
  }
]`;

export async function POST(request) {
  try {
    const { wasteType, investmentLimit, category } = await request.json();

    if (!wasteType || typeof wasteType !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a waste type.' },
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

    // Find matching listings for this waste type
    let matchedListings = getListings({ search: wasteType });
    
    // Always provide at least 2 demo listings for negotiating if real ones are scarce
    if (matchedListings.length < 2) {
      const demoListings = [
        {
          id: `demo-gen-1-${Date.now()}`,
          type: 'generator',
          wasteName: wasteType,
          category: category || 'Other',
          quantity: 500,
          unit: 'kg',
          frequency: 'monthly',
          location: 'Demo City 1',
          price: 'negotiable',
          priceAmount: 15,
          contactName: 'Demo Supplier A',
          isDemo: true
        },
        {
          id: `demo-gen-2-${Date.now()}`,
          type: 'generator',
          wasteName: wasteType,
          category: category || 'Other',
          quantity: 2,
          unit: 'tons',
          frequency: 'weekly',
          location: 'Demo City 2',
          price: 'fixed',
          priceAmount: 22,
          contactName: 'Demo Supplier B',
          isDemo: true
        }
      ];
      // Add demo listings to whatever real matches we found
      matchedListings = [...matchedListings, ...demoListings].slice(0, Math.max(2, matchedListings.length + 2));
    }

    const userPrompt = `Generate 3 business strategies for:
- Waste Type: ${wasteType}
- Investment Limit: ₹${investmentLimit?.toLocaleString('en-IN') || '5,00,000'}
- Category: ${category || 'Any'}
- Available suppliers on platform: ${matchedListings.length} listings found
${matchedListings.length > 0 ? `- Example suppliers: ${matchedListings.slice(0, 3).map(l => `${l.wasteName} in ${l.location} (${l.quantity} ${l.unit}/${l.frequency})`).join('; ')}` : ''}`;

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
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
            }),
          }
        );

        if (!geminiRes.ok) {
          throw new Error(`Gemini returned ${geminiRes.status}`);
        }

        const data = await geminiRes.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleaned = rawText.replace(/```json\s*|\s*```/g, '').trim();
          const strategies = JSON.parse(cleaned);
          return NextResponse.json({
            success: true,
            strategies: Array.isArray(strategies) ? strategies : [strategies],
            matchedListings: matchedListings.slice(0, 10),
          });
        }

        throw new Error('Empty response from Gemini');
      } catch (err) {
        lastError = err;
        console.warn(`Pro strategy model ${modelName} failed:`, err.message);
      }
    }

    // Fallback strategies if API fails
    return NextResponse.json({
      success: true,
      strategies: [
        {
          id: 1,
          title: `${wasteType} Upcycled Product Line`,
          description: `Create premium upcycled products from ${wasteType}, inspired by Phool.co's approach of transforming the lowest-value waste into luxury goods.`,
          inspiredBy: ['Phool.co', 'Banyan Nation'],
          wasteInput: wasteType,
          outputProduct: 'Upcycled consumer products',
          startupCost: '₹50,000 — ₹2,00,000',
          monthlyRevenue: '₹30,000 — ₹1,00,000',
          breakEvenMonths: 8,
          competitionLevel: 'Medium',
          sustainabilityScore: 9,
          steps: [
            'Source and collect waste material from local generators',
            'Set up a small processing unit with basic equipment',
            'Develop product prototypes and test market response',
            'Scale through online marketplaces and local retail partnerships'
          ],
          keyRisks: ['Supply consistency', 'Market education needed'],
          regulations: 'MSME registration, GST, local pollution board NOC if processing'
        },
        {
          id: 2,
          title: `${wasteType} Aggregation & Trading Hub`,
          description: `Build a tech-enabled aggregation platform for ${wasteType}, inspired by Kabadiwala Connect and ExtraCarbon's marketplace models.`,
          inspiredBy: ['Kabadiwala Connect', 'ExtraCarbon'],
          wasteInput: wasteType,
          outputProduct: 'Sorted and graded waste commodities',
          startupCost: '₹1,00,000 — ₹5,00,000',
          monthlyRevenue: '₹50,000 — ₹3,00,000',
          breakEvenMonths: 6,
          competitionLevel: 'Low',
          sustainabilityScore: 7,
          steps: [
            'Map local waste generators and negotiate bulk collection deals',
            'Set up a sorting and grading facility',
            'Build buyer relationships with recyclers and manufacturers',
            'Add technology layer for scheduling, pricing, and tracking'
          ],
          keyRisks: ['Price volatility of commodities', 'Logistics costs'],
          regulations: 'Trade license, GST registration, transport permits'
        },
        {
          id: 3,
          title: `${wasteType} Recycling & Material Recovery`,
          description: `Process ${wasteType} into recycled raw materials at virgin-grade quality, following Banyan Nation and Gravita's approach.`,
          inspiredBy: ['Gravita India', 'GEM Enviro'],
          wasteInput: wasteType,
          outputProduct: 'Recycled raw material',
          startupCost: '₹2,00,000 — ₹10,00,000',
          monthlyRevenue: '₹1,00,000 — ₹5,00,000',
          breakEvenMonths: 10,
          competitionLevel: 'Medium',
          sustainabilityScore: 10,
          steps: [
            'Obtain required environmental clearances and CPCB authorization',
            'Set up processing equipment (shredder, washer, extruder as needed)',
            'Establish quality testing protocols to match virgin material specs',
            'Sell to manufacturers under EPR compliance partnerships'
          ],
          keyRisks: ['High initial capital', 'Regulatory compliance costs'],
          regulations: 'CPCB/SPCB authorization, consent to operate, hazardous waste handling license if applicable'
        }
      ],
      matchedListings: matchedListings.slice(0, 10),
      fallback: true,
    });
  } catch (error) {
    console.error('Pro strategy API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate business strategies.' },
      { status: 500 }
    );
  }
}
