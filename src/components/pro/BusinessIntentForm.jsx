'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Food & Agricultural',
  'Textile',
  'Plastic & Industrial',
  'E-Waste',
  'Construction',
  'Other',
];

const WASTE_SUGGESTIONS = [
  'Citrus Peels', 'Sawdust', 'Used Cooking Oil', 'Fabric Scraps',
  'Plastic Scrap (HDPE/PP)', 'Coffee Grounds', 'Old Laptops & Phones',
  'Construction Debris', 'Coconut Shells', 'Banana Stems',
  'Temple Flowers', 'Glass Bottles', 'Rubber Tyres', 'Paper & Cardboard',
  'Battery Waste', 'Metal Shavings', 'Rice Husks', 'Sugarcane Bagasse',
];

const INVESTMENT_MARKS = [
  { value: 10000, label: '₹10K' },
  { value: 50000, label: '₹50K' },
  { value: 100000, label: '₹1L' },
  { value: 200000, label: '₹2L' },
  { value: 500000, label: '₹5L' },
  { value: 1000000, label: '₹10L' },
  { value: 2500000, label: '₹25L' },
  { value: 5000000, label: '₹50L' },
];

function formatINR(num) {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

export default function BusinessIntentForm({ data, onUpdate, onNext }) {
  const [wasteType, setWasteType] = useState(data.wasteType || '');
  const [investment, setInvestment] = useState(data.investmentLimit || 200000);
  const [category, setCategory] = useState(data.category || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredSuggestions = wasteType.length > 0
    ? WASTE_SUGGESTIONS.filter((s) => s.toLowerCase().includes(wasteType.toLowerCase()))
    : WASTE_SUGGESTIONS;

  const handleSubmit = async () => {
    if (!wasteType.trim()) {
      setError('Please enter the waste type you want to build a business around.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/pro/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteType: wasteType.trim(),
          investmentLimit: investment,
          category,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate strategies');
      }

      onUpdate({
        wasteType: wasteType.trim(),
        investmentLimit: investment,
        category,
        strategies: result.strategies,
        matchedListings: result.matchedListings || [],
      });

      onNext();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map slider value (0-100) to investment amount using exponential scale
  const sliderToValue = (slider) => {
    const min = Math.log(10000);
    const max = Math.log(5000000);
    return Math.round(Math.exp(min + (slider / 100) * (max - min)));
  };

  const valueToSlider = (value) => {
    const min = Math.log(10000);
    const max = Math.log(5000000);
    return Math.round(((Math.log(value) - min) / (max - min)) * 100);
  };

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto">
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-4">
              🎯
            </div>
            <h2 className="text-2xl font-extrabold text-white">Tell Us About Your Waste Business</h2>
            <p className="text-slate-400 mt-2 text-sm">Our AI will generate personalized strategies based on your inputs</p>
          </div>

          {/* Waste Type Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-amber-400 mb-2">
                What waste do you want to build a business around?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={wasteType}
                  onChange={(e) => { setWasteType(e.target.value); setShowSuggestions(true); setError(''); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g. Plastic Scrap, Temple Flowers, Used Cooking Oil..."
                  className="w-full px-5 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={() => { setWasteType(s); setShowSuggestions(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Investment Slider */}
            <div>
              <label className="block text-sm font-bold text-amber-400 mb-2">
                Investment Limit
              </label>
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-600">
                <div className="text-center mb-4">
                  <span className="text-3xl font-extrabold gold-shimmer-text">
                    {formatINR(investment)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={valueToSlider(investment)}
                  onChange={(e) => setInvestment(sliderToValue(Number(e.target.value)))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  style={{
                    background: `linear-gradient(to right, #f59e0b ${valueToSlider(investment)}%, #334155 ${valueToSlider(investment)}%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>₹10K</span>
                  <span>₹1L</span>
                  <span>₹10L</span>
                  <span>₹50L</span>
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-sm font-bold text-amber-400 mb-2">
                Waste Category (optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(category === cat ? '' : cat)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                      category === cat
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI is analyzing waste markets...
                </>
              ) : (
                <>
                  ✦ Generate AI Strategies
                  <span className="text-sm opacity-70">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
