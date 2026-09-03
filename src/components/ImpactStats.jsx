'use client';

import { useEffect, useRef, useState } from 'react';

function CountUp({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const STATS = [
  {
    icon: '💡',
    value: 240,
    suffix: '+',
    label: 'Business Ideas',
    sub: 'Across 6 waste categories',
    color: 'from-blue-500/20 to-royal/10',
    textColor: 'text-royal',
  },
  {
    icon: '🏙️',
    value: 15,
    suffix: '+',
    label: 'Cities Covered',
    sub: 'Waste markets across India',
    color: 'from-emerald-500/20 to-mint/10',
    textColor: 'text-emerald-600',
  },
  {
    icon: '📋',
    value: 100,
    suffix: '+',
    label: 'Active Listings',
    sub: 'Generators & seekers',
    color: 'from-orange-400/20 to-amber-400/10',
    textColor: 'text-orange-600',
  },
  {
    icon: '🔄',
    value: 6,
    suffix: '',
    label: 'Waste Streams',
    sub: 'Fully mapped & categorized',
    color: 'from-purple-500/20 to-purple-400/10',
    textColor: 'text-purple-600',
  },
];

export default function ImpactStats() {
  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            🌱 Platform Impact
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
            Numbers That Tell the Story
          </h2>
          <p className="text-charcoal-light text-sm mt-2 max-w-xl mx-auto">
            WasteWise is turning discarded materials into thriving circular ventures across India.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={`relative bg-gradient-to-br ${stat.color} border border-border rounded-2xl p-6 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Background blob */}
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 select-none pointer-events-none">
                {stat.icon}
              </div>

              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl sm:text-4xl font-extrabold ${stat.textColor} tabular-nums`}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-bold text-charcoal mt-1">{stat.label}</div>
              <div className="text-xs text-charcoal-light mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
