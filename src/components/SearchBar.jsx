'use client';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-charcoal-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl text-charcoal placeholder-charcoal-light/50 text-sm transition-all duration-200 hover:border-royal/30 focus:border-royal focus:ring-2 focus:ring-royal/10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-charcoal-light hover:text-royal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
