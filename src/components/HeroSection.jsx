import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-royal/10 via-surface to-surface pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-royal/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-40 h-40 bg-royal/6 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              The Circular Economy Marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-tight">
              Turn Waste Into{' '}
              <span className="relative inline-block">
                <span className="text-royal">Business Value</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-royal/60 to-emerald-400/60 rounded-full" />
              </span>
            </h1>

            <p className="text-lg text-charcoal-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with businesses generating industrial &amp; organic waste, or discover tested business ideas to turn scrap, peels, and offcuts into profitable products.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/ideas"
                className="w-full sm:w-auto px-8 py-4 bg-royal text-white font-bold rounded-xl shadow-lg hover:bg-royal-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Browse 240+ Ideas
              </Link>
              <Link
                href="/post"
                className="w-full sm:w-auto px-8 py-4 bg-white text-charcoal font-bold rounded-xl border border-border shadow-sm hover:border-royal hover:text-royal hover:-translate-y-0.5 transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Post a Listing
              </Link>
            </div>

            {/* Quick stats row */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-border/60 max-w-lg mx-auto lg:mx-0">
              <div className="group cursor-default">
                <div className="text-2xl sm:text-3xl font-extrabold text-royal group-hover:scale-110 transition-transform inline-block">240+</div>
                <div className="text-xs text-charcoal-light font-medium">Business Ideas</div>
              </div>
              <div className="group cursor-default">
                <div className="text-2xl sm:text-3xl font-extrabold text-charcoal group-hover:scale-110 transition-transform inline-block">15+</div>
                <div className="text-xs text-charcoal-light font-medium">Cities</div>
              </div>
              <div className="group cursor-default">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 group-hover:scale-110 transition-transform inline-block">100%</div>
                <div className="text-xs text-charcoal-light font-medium">Direct Connect</div>
              </div>
            </div>
          </div>

          {/* Right Column: Case Story Card */}
          <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {/* Glass sheen */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

              <div className="absolute -top-4 -right-4 bg-royal text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Featured Case Story
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  🍊
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-lg">Orange &amp; Citrus Peels</h3>
                  <span className="text-xs font-semibold text-royal bg-royal/10 px-2.5 py-0.5 rounded-full">
                    Food &amp; Agricultural Waste
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-charcoal-light">
                <div className="p-4 rounded-2xl bg-surface border border-border/80">
                  <div className="text-xs font-bold uppercase text-charcoal mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    The Problem
                  </div>
                  <p className="text-xs sm:text-sm">Juice stalls generate tons of daily peel waste that rots in landfills.</p>
                </div>

                <div className="flex justify-center text-royal">
                  <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm">
                  <div className="text-xs font-bold uppercase text-emerald-800 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    The Business Idea
                  </div>
                  <h4 className="font-bold text-charcoal text-base mb-1">Cold-Pressed Essential Oil &amp; Perfume</h4>
                  <p className="text-xs sm:text-sm text-charcoal">
                    Distill orange peel oil using steam distillation, blend into natural perfume, and sell at ₹400–₹800 a bottle.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-charcoal-light font-medium">Source: Local Juice Stalls</span>
                <Link href="/ideas/1" className="text-royal font-bold hover:underline flex items-center gap-1">
                  Read full steps →
                </Link>
              </div>
            </div>

            {/* Floating badge */}
            <div className="mt-4 ml-4 inline-flex items-center gap-2 bg-white border border-border rounded-2xl px-4 py-2.5 shadow-md text-xs font-semibold text-charcoal animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              100+ active listings right now
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
