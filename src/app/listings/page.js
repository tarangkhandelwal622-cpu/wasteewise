'use client';

import { useState, useEffect, useMemo } from 'react';
import ListingCard from '@/components/ListingCard';
import FilterPanel from '@/components/FilterPanel';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 12;

// City map coordinates (approximate lat/lng for display circles)
const CITY_POSITIONS = {
  'Mumbai':    { x: 18, y: 62 },
  'Delhi':     { x: 42, y: 28 },
  'Bengaluru': { x: 40, y: 74 },
  'Chennai':   { x: 44, y: 78 },
  'Hyderabad': { x: 42, y: 66 },
  'Pune':      { x: 22, y: 64 },
  'Kolkata':   { x: 68, y: 42 },
  'Ahmedabad': { x: 22, y: 46 },
  'Jaipur':    { x: 36, y: 36 },
  'Surat':     { x: 20, y: 54 },
  'Lucknow':   { x: 50, y: 32 },
  'Nagpur':    { x: 38, y: 56 },
};

function CityMapView({ listings, onCitySelect, selectedCity }) {
  // Group by city
  const cityGroups = useMemo(() => {
    const map = {};
    listings.forEach((l) => {
      if (!map[l.location]) map[l.location] = { generators: 0, seekers: 0 };
      if (l.type === 'generator') map[l.location].generators++;
      else map[l.location].seekers++;
    });
    return map;
  }, [listings]);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
      <h3 className="font-semibold text-charcoal flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        City Distribution
      </h3>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {Object.entries(cityGroups)
          .sort((a, b) => (b[1].generators + b[1].seekers) - (a[1].generators + a[1].seekers))
          .map(([city, counts]) => {
            const total = counts.generators + counts.seekers;
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => onCitySelect(isSelected ? '' : city)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-royal bg-royal/5 shadow-sm'
                    : 'border-border hover:border-royal/30 hover:bg-surface'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-royal/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal truncate">{city}</span>
                    <span className="text-xs font-bold text-royal ml-2">{total}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {counts.generators > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-royal/10 text-royal rounded-full font-semibold">
                        {counts.generators} gen
                      </span>
                    )}
                    {counts.seekers > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                        {counts.seekers} seek
                      </span>
                    )}
                  </div>
                  {/* Mini bar */}
                  <div className="mt-1.5 h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-royal to-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (total / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
      </div>
      {selectedCity && (
        <button
          onClick={() => onCitySelect('')}
          className="w-full py-2 text-xs font-medium text-royal hover:text-royal-dark transition-colors underline underline-offset-2"
        >
          Show all cities
        </button>
      )}
    </div>
  );
}

export default function ListingsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [page, setPage] = useState(1);

  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch('/api/listings');
        const json = await res.json();
        if (json.success) setAllListings(json.data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const cities = useMemo(() => {
    const set = new Set(allListings.map((l) => l.location));
    return Array.from(set).sort();
  }, [allListings]);

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      if (type && listing.type !== type) return false;
      if (category && listing.category !== category) return false;
      if (city && listing.location.toLowerCase() !== city.toLowerCase()) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchWaste = listing.wasteName.toLowerCase().includes(q);
        const matchCategory = listing.category.toLowerCase().includes(q);
        const matchDesc = listing.description && listing.description.toLowerCase().includes(q);
        if (!matchWaste && !matchCategory && !matchDesc) return false;
      }
      return true;
    });
  }, [allListings, search, category, type, city]);

  // Reset page when filters change
  useMemo(() => { setPage(1); }, [search, category, type, city]);

  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const paginatedListings = filteredListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setType(''); setCity('');
  };

  return (
    <div className="py-10 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-mint/30 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            🤝 Circular Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Browse Active Listings
          </h1>
          <p className="text-charcoal-light text-base sm:text-lg">
            Discover waste materials available near you or find businesses looking for your specific waste stream.
          </p>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4 sticky top-20">
            <FilterPanel
              search={search}
              onSearchChange={(v) => { setSearch(v); setPage(1); }}
              category={category}
              onCategoryChange={(v) => { setCategory(v); setPage(1); }}
              type={type}
              onTypeChange={(v) => { setType(v); setPage(1); }}
              city={city}
              onCityChange={(v) => { setCity(v); setPage(1); }}
              cities={cities}
              searchPlaceholder="Search waste name or keyword..."
            />
            {/* City map view (sidebar) */}
            {!loading && (
              <CityMapView
                listings={allListings}
                onCitySelect={(c) => { setCity(c); setPage(1); }}
                selectedCity={city}
              />
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-8 space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-border p-4 shadow-sm">
              <span className="text-sm text-charcoal-light">
                {loading ? 'Loading…' : (
                  <>Showing <strong className="text-charcoal font-bold">{filteredListings.length}</strong> listings
                    {city && <span className="ml-1 text-royal font-semibold">in {city}</span>}
                  </>
                )}
              </span>
              {/* View toggle */}
              <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'grid' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Grid
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'map' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    By City
                  </span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-charcoal-light">Loading listings…</p>
              </div>
            ) : viewMode === 'map' ? (
              /* ── By-City grouped view ── */
              <div className="space-y-6">
                {Object.entries(
                  filteredListings.reduce((acc, l) => {
                    if (!acc[l.location]) acc[l.location] = [];
                    acc[l.location].push(l);
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([cityName, cityListings]) => (
                    <div key={cityName} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h2 className="font-bold text-charcoal">{cityName}</h2>
                        <span className="text-xs text-charcoal-light bg-surface border border-border px-2 py-0.5 rounded-full">
                          {cityListings.length} listing{cityListings.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cityListings.slice(0, 4).map((listing) => (
                          <ListingCard key={listing.id} listing={listing} cityFilter={city} />
                        ))}
                      </div>
                      {cityListings.length > 4 && (
                        <button
                          onClick={() => { setCity(cityName); setViewMode('grid'); setPage(1); }}
                          className="text-xs text-royal font-semibold hover:underline"
                        >
                          View all {cityListings.length} listings in {cityName} →
                        </button>
                      )}
                    </div>
                  ))}
                {filteredListings.length === 0 && (
                  <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-4">
                    <div className="text-4xl">📦</div>
                    <h3 className="text-lg font-bold text-charcoal">No listings found</h3>
                    <button onClick={clearFilters} className="px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-bold shadow-md">Clear All Filters</button>
                  </div>
                )}
              </div>
            ) : paginatedListings.length > 0 ? (
              /* ── Grid view ── */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paginatedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} cityFilter={city} />
                  ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-4">
                <div className="text-4xl">📦</div>
                <h3 className="text-lg font-bold text-charcoal">No listings found</h3>
                <p className="text-sm text-charcoal-light max-w-md mx-auto">
                  Try adjusting your filter settings or search terms.
                </p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-bold shadow-md">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
