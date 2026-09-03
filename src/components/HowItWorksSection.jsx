const STEPS = [
  {
    step: '01',
    title: 'Explore Ideas',
    description: 'Browse over 240+ step-by-step business blueprints turning peels, sawdust, scrap & sludge into high-value products.',
    icon: (
      <svg className="w-6 h-6 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'List Waste or Need',
    description: 'Generators post waste availability with volume & location. Entrepreneurs post raw material requirements.',
    icon: (
      <svg className="w-6 h-6 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Get Matched',
    description: 'Our smart algorithm automatically pairs local generators with seekers looking for that exact waste type.',
    icon: (
      <svg className="w-6 h-6 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Connect & Deal',
    description: 'Get direct contact information, negotiate terms, arrange local pickup, and build your circular enterprise.',
    icon: (
      <svg className="w-6 h-6 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-charcoal sm:text-4xl">
            How <span className="text-royal">WasteWise</span> Works
          </h2>
          <p className="text-charcoal-light text-base sm:text-lg">
            Bridging the gap between waste generation and sustainable business opportunity in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((s, idx) => (
            <div key={s.step} className="bg-surface rounded-2xl p-6 border border-border/80 relative hover:border-royal/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-royal/10 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="text-2xl font-black text-royal/20">{s.step}</span>
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">{s.title}</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
