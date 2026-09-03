import { NextResponse } from 'next/server';
import { getListings } from '@/lib/data-service';

// Smart heuristics AI business model generator fallback
const HEURISTIC_PATTERNS = [
  {
    keywords: ['coffee', 'tea', 'grounds'],
    title: 'Upcycled Exfoliating Skincare & Biomass Briquettes',
    category: 'Food & Agricultural',
    targetMarket: 'Spas, eco-skincare consumers, industrial boiler operators',
    steps: [
      'Collect used grounds from 5 local cafes daily in food-grade buckets.',
      'Sun-dry or dehydrate the grounds to below 10% moisture content.',
      'Formulate into a vitamin E body scrub or compress with natural binders into biomass logs.',
      'Sell scrubs online/Instagram and briquettes to local brick kilns.'
    ],
    safety: 'Ensure grounds are completely dry before packaging to prevent mold growth.',
    co2Saved: '1.8 kg CO₂ per kg coffee waste repurposed'
  },
  {
    keywords: ['citrus', 'orange', 'lemon', 'peel', 'fruit'],
    title: 'Cold-Pressed Essential Oil & Natural Bio-Enzyme Cleaner',
    category: 'Food & Agricultural',
    targetMarket: 'Boutique perfumeries, eco-friendly households, cleaning service companies',
    steps: [
      'Collect fresh peels daily from juice centers and fruit markets.',
      'Extract citrus essential oil using a tabletop steam distiller.',
      'Ferment remaining peel pulp with jaggery and water for 60 days to produce multi-surface bio-enzymes.',
      'Package in recycled amber glass bottles and pitch to eco-cleaning distributors.'
    ],
    safety: 'Use proper ventilation during distillation and test oil stability.',
    co2Saved: '2.4 kg CO₂ per kg fruit peel diverted from landfill'
  },
  {
    keywords: ['sawdust', 'wood', 'carpentry', 'timber'],
    title: 'High-Density Fuel Pellets & Mycelium Building Blocks',
    category: 'Construction',
    targetMarket: 'Nurseries, biomass power units, eco-friendly architects',
    steps: [
      'Sieve raw sawdust from local furniture workshops to remove nails and debris.',
      'Compress fine dust into high-density heating pellets using a compact pelletizer.',
      'Inoculate remaining coarse shavings with mushroom mycelium to mold bio-composite bricks.',
      'Supply pellets to local boilers and bricks to green builders.'
    ],
    safety: 'Always wear N95 dust masks and eye protection when handling fine sawdust.',
    co2Saved: '3.1 kg CO₂ per kg wood waste repurposed'
  },
  {
    keywords: ['denim', 'fabric', 'garment', 'cloth', 'textile', 'cotton'],
    title: 'Upcycled Denim Accessories & Thermal Building Insulation',
    category: 'Textile',
    targetMarket: 'Fashion consumers, green building contractors, gift shops',
    steps: [
      'Source clean fabric scraps and rejected garments from local tailors and factories.',
      'Sort scraps by color and texture; hand-stitch into tote bags, aprons, and laptop sleeves.',
      'Shred smaller offcuts into fiber battings for building acoustic and thermal insulation.',
      'Sell fashion accessories on Etsy/Instagram and insulation batts to interior designers.'
    ],
    safety: 'Sanitize all secondhand textiles before shredding or sewing.',
    co2Saved: '4.5 kg CO₂ per kg fabric diverted'
  },
  {
    keywords: ['plastic', 'hdpe', 'bottle', 'pet', 'polyethylene'],
    title: 'Modular Recycled Paver Tiles & 3D Printing Filament',
    category: 'Plastic & Industrial',
    targetMarket: 'Landscapers, municipal parks, 3D printing hobbyists',
    steps: [
      'Collect segregated HDPE bottle caps and containers from community drop-offs.',
      'Shred plastic into 3mm flakes and extrude into 3D printer filament or melt into interlocking garden pavers.',
      'Test pavers for compression strength and UV resistance.',
      'Sell filament to maker spaces and pavers to landscaping contractors.'
    ],
    safety: 'Ensure proper exhaust hood ventilation when melting plastics to avoid inhaling fumes.',
    co2Saved: '5.2 kg CO₂ per kg plastic recycled'
  },
  {
    keywords: ['phone', 'laptop', 'e-waste', 'battery', 'cable', 'circuit'],
    title: 'Refurbished Tech Hardware & Precious Metal Scrap Aggregation',
    category: 'E-Waste',
    targetMarket: 'Secondhand electronics buyers, authorized metal refiners',
    steps: [
      'Partner with IT parks and households for drop-off collection of outdated devices.',
      'Test, clean, and upgrade functional laptops/phones for affordable resale.',
      'Dismantle unrepairable circuit boards and sort components into copper wire, RAM sticks, and batteries.',
      'Sell sorted components to certified R2/e-Stewards recyclers.'
    ],
    safety: 'Never puncture lithium-ion batteries. Store in fire-safe sand buckets.',
    co2Saved: '14.0 kg CO₂ per kg electronics diverted'
  }
];

export async function POST(request) {
  try {
    const { wasteName, category = '' } = await request.json();

    if (!wasteName || typeof wasteName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid waste material name.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const queryLower = wasteName.toLowerCase();

    // Search marketplace listings for matching buyers or sellers
    const matchedListings = getListings({ search: wasteName });

    // If Gemini API Key is available, try calling Google Gemini API
    if (apiKey) {
      try {
        const prompt = `You are WasteWise AI, an expert circular economy advisor. 
Generate a practical, highly actionable waste-to-business model for: "${wasteName}" (Category: ${category || 'General'}).

Return ONLY valid JSON in this exact schema (no markdown, no preamble):
{
  "title": "Short Catchy Business Model Title",
  "category": "Food & Agricultural | Textile | Plastic & Industrial | E-Waste | Construction | Other",
  "targetMarket": "Comma-separated list of target buyers",
  "steps": [
    "Step 1: Raw material sourcing & setup",
    "Step 2: Processing / transformation technique",
    "Step 3: Quality testing & packaging",
    "Step 4: Sales, marketing & scaling strategy"
  ],
  "safety": "Important safety or legal compliance note",
  "co2Saved": "Estimated CO2 or landfill waste impact (e.g. 2.5 kg CO2 per kg material)"
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json\s*|\s*```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            return NextResponse.json({
              success: true,
              source: 'gemini-ai',
              data: parsed,
              matchedListings,
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart heuristic engine:', err.message);
      }
    }

    // Smart Fallback Engine
    const matchedPattern = HEURISTIC_PATTERNS.find((p) =>
      p.keywords.some((k) => queryLower.includes(k))
    );

    if (matchedPattern) {
      return NextResponse.json({
        success: true,
        source: 'smart-heuristic-ai',
        data: {
          title: `${wasteName} → ${matchedPattern.title}`,
          category: matchedPattern.category,
          targetMarket: matchedPattern.targetMarket,
          steps: matchedPattern.steps,
          safety: matchedPattern.safety,
          co2Saved: matchedPattern.co2Saved,
        },
        matchedListings,
      });
    }

    // Dynamic Generic Fallback for unlisted waste streams
    const genericResponse = {
      title: `${wasteName} Upcycled Product Line`,
      category: category || 'Other',
      targetMarket: 'Eco-conscious consumers, local recycling aggregators, crafting networks',
      steps: [
        `Establish free daily collection points for ${wasteName} from local generators.`,
        `Inspect, clean, and segregate ${wasteName} by quality and material composition.`,
        `Process into standardized raw material pellets, fibers, or craft components.`,
        `Package in eco-friendly containers and sell directly to green manufacturers or via WasteWise listings.`
      ],
      safety: `Wear personal protective equipment (PPE) during collection and processing of ${wasteName}.`,
      co2Saved: `Estimated 2.0 kg CO₂ saved per kg of ${wasteName} diverted from landfills`
    };

    return NextResponse.json({
      success: true,
      source: 'smart-heuristic-ai',
      data: genericResponse,
      matchedListings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI business model' },
      { status: 500 }
    );
  }
}
