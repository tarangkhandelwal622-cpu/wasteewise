'use client';

import { useState, useEffect } from 'react';

export default function BusinessBlueprint({ data, onUpdate, onBack }) {
  const [loading, setLoading] = useState(!data.blueprint);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Generate blueprint if we don't have it yet
    if (!data.blueprint && !loading) {
      setLoading(true);
      generateBlueprint();
    } else if (!data.blueprint && loading) {
       generateBlueprint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateBlueprint = async () => {
    try {
      const res = await fetch('/api/pro/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: data.selectedStrategy,
          acceptedDeals: data.acceptedDeals,
          investmentLimit: data.investmentLimit
        })
      });

      const result = await res.json();
      
      if (result.success) {
        onUpdate({ blueprint: result.blueprint });
      } else {
        throw new Error(result.error || 'Failed to generate blueprint');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong generating the blueprint.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">📋</div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Architecting Your Blueprint...</h2>
        <p className="text-slate-400 text-sm text-center max-w-md">
          AI is structuring your supply chain, running financial projections, and organizing compliance requirements.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">Blueprint Generation Failed</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => { setLoading(true); setError(null); generateBlueprint(); }}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const bp = data.blueprint;
  if (!bp) return null;

  return (
    <div className="mt-8">
      {/* Action Bar (Not printed) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <span>←</span> Back to Negotiation
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2 bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Blueprint Document */}
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 print:shadow-none print:p-0 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="border-b-4 border-amber-500 pb-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-amber-500 text-xs font-bold uppercase tracking-widest rounded mb-4">
                WasteWise Pro Blueprint
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
                {bp.businessName}
              </h1>
              <p className="text-lg text-slate-600 italic">"{bp.tagline}"</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Generated</div>
              <div className="font-bold">{new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">Executive Summary</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {bp.executiveSummary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Column */}
          <div className="space-y-10">
            
            {/* Financial Projections */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-amber-500">💰</span> Financial Projections
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Startup Cost</div>
                  <div className="text-xl font-extrabold text-slate-900">{bp.financials.startupCost}</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">Break-Even</div>
                  <div className="text-xl font-extrabold text-emerald-700">{bp.financials.breakEvenMonth} Months</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Monthly Expenses</span>
                  <span className="font-bold text-red-600">{bp.financials.monthlyExpenses}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Monthly Revenue</span>
                  <span className="font-bold text-emerald-600">{bp.financials.monthlyRevenue}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 p-2 rounded">
                  <span className="text-slate-800">Est. Year 1 Profit</span>
                  <span className="text-slate-900">{bp.financials.yearOneProfit}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cost Breakdown</div>
                <ul className="space-y-2">
                  {bp.financials.breakdown?.map((item, i) => (
                    <li key={i} className="flex justify-between text-xs">
                      <span className="text-slate-600">• {item.item}</span>
                      <span className="font-semibold">{item.cost}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Supply Chain */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-amber-500">🔗</span> Supply Chain
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sourcing</div>
                  <ul className="space-y-1">
                    {bp.supplyChain.sources.map((source, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">▸</span> 
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                  {data.acceptedDeals.length > 0 && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="text-xs font-bold text-amber-800 mb-1">Secured AI Deals:</div>
                      {data.acceptedDeals.map((deal, i) => (
                        <div key={i} className="text-xs text-amber-900">✓ {deal.quantity} from {deal.location || 'seller'} at {deal.agreedPrice}</div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Processing</div>
                  <p className="text-sm text-slate-700">{bp.supplyChain.processing}</p>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Distribution</div>
                  <p className="text-sm text-slate-700">{bp.supplyChain.distribution}</p>
                </div>
              </div>
            </section>

          </div>
          
          {/* Right Column */}
          <div className="space-y-10">
            
            {/* Growth Roadmap */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-amber-500">📈</span> 12-Month Roadmap
              </h2>
              
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                {bp.growthRoadmap.map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-amber-500" />
                    <div className="text-xs font-bold text-amber-600 mb-1">{item.quarter}</div>
                    <div className="text-sm text-slate-700">{item.milestone}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Compliance */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-amber-500">⚖️</span> Legal & Compliance
              </h2>
              
              <div className="space-y-3">
                {bp.compliance.map((comp, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                    <div className="font-bold text-slate-900">{comp.license}</div>
                    <div className="text-xs text-slate-500 mt-1 flex justify-between">
                      <span>{comp.authority}</span>
                      <span className="font-semibold">{comp.cost} • {comp.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Strategy Notes */}
            <section className="bg-slate-900 text-white p-6 rounded-xl print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-amber-400">💡</span> Strategy Insights
              </h3>
              
              <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-500">Competitive Advantage</div>
                <p className="text-sm text-slate-300 print:text-slate-700">{bp.competitiveAdvantage}</p>
              </div>
              
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-500">Mentor Models</div>
                <ul className="space-y-1">
                  {bp.mentorCompanies.map((comp, i) => (
                    <li key={i} className="text-xs text-amber-200/80 flex items-start gap-2 print:text-slate-700">
                      <span className="text-amber-400 mt-0.5">•</span> 
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          Generated securely by WasteWise AI Pro • Confidential Business Plan
        </div>
      </div>
    </div>
  );
}
