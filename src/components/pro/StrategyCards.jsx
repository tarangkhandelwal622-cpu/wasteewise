'use client';

import { useState } from 'react';

function CompetitionBadge({ level }) {
  const colors = {
    Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colors[level] || colors.Medium}`}>
      {level} Competition
    </span>
  );
}

function SustainabilityMeter({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs font-bold text-emerald-400">{score}/10</span>
    </div>
  );
}

export default function StrategyCards({ data, onUpdate, onNext, onBack }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (strategy) => {
    setSelectedId(strategy.id);
    onUpdate({ selectedStrategy: strategy });
  };

  const handleProceed = () => {
    if (data.selectedStrategy) {
      onNext();
    }
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-white">
          AI-Generated Strategies for{' '}
          <span className="gold-shimmer-text">{data.wasteType}</span>
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          Investment limit: <span className="text-amber-400 font-bold">₹{data.investmentLimit?.toLocaleString('en-IN')}</span>
          {data.matchedListings?.length > 0 && (
            <span className="ml-2">
              • <span className="text-emerald-400 font-bold">{data.matchedListings.length} suppliers</span> found on marketplace
            </span>
          )}
        </p>
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.strategies.map((strategy, idx) => {
          const isSelected = selectedId === strategy.id;

          return (
            <div
              key={strategy.id || idx}
              onClick={() => handleSelect(strategy)}
              className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 shadow-xl shadow-amber-500/15 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-700/50 hover:border-slate-600 hover:shadow-lg'
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-black text-sm font-bold shadow-lg">
                  ✓
                </div>
              )}

              {/* Strategy number */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-400 text-black'
                    : 'bg-slate-800 text-slate-400 border border-slate-600'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <CompetitionBadge level={strategy.competitionLevel} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-extrabold text-white mb-2 leading-snug">
                {strategy.title}
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                {strategy.description}
              </p>

              {/* Inspired by */}
              {strategy.inspiredBy && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inspired by</div>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.inspiredBy.map((company) => (
                      <span
                        key={company}
                        className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial projections */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Startup Cost</span>
                  <span className="text-white font-bold">{strategy.startupCost}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Monthly Revenue</span>
                  <span className="text-emerald-400 font-bold">{strategy.monthlyRevenue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Break-Even</span>
                  <span className="text-amber-400 font-bold">{strategy.breakEvenMonths} months</span>
                </div>
              </div>

              {/* Sustainability */}
              <div className="mb-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sustainability</div>
                <SustainabilityMeter score={strategy.sustainabilityScore || 7} />
              </div>

              {/* Steps preview */}
              <div className="mb-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Key Steps</div>
                <div className="space-y-1.5">
                  {(strategy.steps || []).slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>
                      <span className="line-clamp-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              {strategy.keyRisks && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Key Risks</div>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.keyRisks.map((risk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400/80 text-[10px] border border-red-500/20">
                        {risk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Select button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleSelect(strategy); }}
                className={`w-full mt-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 border border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-400'
                }`}
              >
                {isSelected ? '✦ Selected' : 'Go with this idea'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-800 border border-slate-600 text-slate-400 rounded-xl font-bold text-sm hover:border-slate-500 hover:text-slate-300 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleProceed}
          disabled={!data.selectedStrategy}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Find Suppliers & Negotiate →
        </button>
      </div>
    </div>
  );
}
