'use client';

import SearchBar from './SearchBar';

const CATEGORIES = [
  'Food & Agricultural',
  'Textile',
  'Plastic & Industrial',
  'E-Waste',
  'Construction',
  'Other',
];

export default function FilterPanel({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  city,
  onCityChange,
  cities = [],
  showTypeFilter = true,
  showCityFilter = true,
  searchPlaceholder = 'Search...',
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-5 shadow-sm">
      <h3 className="font-semibold text-charcoal flex items-center gap-2">
        <svg className="w-5 h-5 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </h3>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-charcoal cursor-pointer hover:border-royal/30 transition-colors"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Listing Type */}
      {showTypeFilter && (
        <div>
          <label className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2">
            Listing Type
          </label>
          <div className="flex gap-2">
            {[
              { value: '', label: 'All' },
              { value: 'generator', label: '🏭 Generators' },
              { value: 'seeker', label: '🔍 Seekers' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onTypeChange(opt.value)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                  type === opt.value
                    ? 'bg-royal text-white border-royal shadow-md'
                    : 'bg-surface text-charcoal-light border-border hover:border-royal/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City */}
      {showCityFilter && (
        <div>
          <label className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2">
            City / Location
          </label>
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-charcoal cursor-pointer hover:border-royal/30 transition-colors"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear All */}
      {(search || category || type || city) && (
        <button
          onClick={() => {
            onSearchChange('');
            onCategoryChange('');
            if (onTypeChange) onTypeChange('');
            if (onCityChange) onCityChange('');
          }}
          className="w-full py-2 text-xs font-medium text-royal hover:text-royal-dark transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
