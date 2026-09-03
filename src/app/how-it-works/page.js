import Link from 'next/link';

const STEPS_DETAIL = [
  {
    step: '01',
    title: 'Explore Waste-to-Business Ideas',
    subtitle: 'Discovery & Inspiration',
    description:
      'Search our directory of over 240 structured business blueprints. Each blueprint details the raw waste input, processing steps, equipment needed, and initial sales channels.',
    highlights: ['240+ ideas across 6 categories', 'Step-by-step startup guides', 'Completely free & open access'],
    icon: '💡',
  },
  {
    step: '02',
    title: 'List Your Waste or Raw Material Need',
    subtitle: 'Post a Listing',
    description:
      'Generators list waste quantity, frequency, and location. Entrepreneurs post exact material requirements and sourcing radius. No complex setup required.',
    highlights: ['Two listing modes: Generator & Seeker', 'Filterable by city & location', 'Instant publishing'],
    icon: '📝',
  },
  {
    step: '03',
    title: 'Get Matched Automatically',
    subtitle: 'Smart Matching Engine',
    description:
      'When viewing any listing, WasteWise surfaces opposite-type listings in the same city or category to quickly bridge supply and demand.',
    highlights: ['Category & location pairing', 'Reduces transportation costs', 'Accelerates trade deals'],
    icon: '⚡',
  },
  {
    step: '04',
    title: 'Connect & Build Circular Ventures',
    subtitle: 'Direct Dealmaking',
    description:
      'Reveal direct contact info, arrange sample pickups, negotiate pricing, and turn discarded materials into high-margin products.',
    highlights: ['Direct phone & email reveal', 'No platform transaction fees', 'Measurable eco-impact'],
    icon: '🤝',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-12 bg-surface min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            🌱 The WasteWise Framework
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight">
            How WasteWise Connects Supply & Demand
          </h1>
          <p className="text-charcoal-light text-base sm:text-lg leading-relaxed">
            WasteWise is a two-sided platform designed to eliminate waste and spark green entrepreneurship.
          </p>
        </div>

        {/* Detailed Step Cards */}
        <div className="space-y-8">
          {STEPS_DETAIL.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-2 flex items-center justify-center">
                <div className="w-20 h-20 bg-royal/10 text-royal rounded-3xl flex items-center justify-center text-3xl font-extrabold">
                  {item.icon}
                </div>
              </div>

              <div className="md:col-span-10 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-royal bg-royal/10 px-2.5 py-0.5 rounded-full">
                    Step {item.step}
                  </span>
                  <span className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">
                    {item.subtitle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-charcoal">
                  {item.title}
                </h3>

                <p className="text-sm text-charcoal-light leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-surface text-charcoal font-medium text-xs border border-border flex items-center gap-1.5"
                    >
                      <span className="text-emerald-500">✓</span> {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-royal to-royal-dark text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to Start?</h2>
          <p className="text-royal-light text-sm sm:text-base max-w-xl mx-auto">
            Explore 240+ business ideas or post your first listing on WasteWise today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/ideas"
              className="px-6 py-3 bg-mint text-charcoal font-bold rounded-xl hover:bg-mint-dark transition-colors text-sm"
            >
              Explore Idea Library
            </Link>
            <Link
              href="/post"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              Post a Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
