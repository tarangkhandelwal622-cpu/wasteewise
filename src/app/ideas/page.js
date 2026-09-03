'use client';

import { useState, useMemo, useEffect } from 'react';
import IdeaCard from '@/components/IdeaCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import ideasData from '@/data/ideas.json';

const CATEGORIES = [
  'All',
  'Food & Agricultural',
  'Textile',
  'Plastic & Industrial',
  'E-Waste',
  'Construction',
  'Other',
];

const PAGE_SIZE = 12;

export default function IdeaLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);

  // Reset page whenever filters change
  useEffect(() => { setPage(1); }, [search, selectedCategory]);

  const filteredIdeas = useMemo(() => {
    return ideasData.filter((idea) => {
      const matchCategory =
        selectedCategory === 'All' || idea.category === selectedCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        idea.wasteSource.toLowerCase().includes(q) ||
        idea.businessIdea.toLowerCase().includes(q) ||
        idea.category.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filteredIdeas.length / PAGE_SIZE);
  const paginatedIdeas = filteredIdeas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            💡 {ideasData.length}+ Circular Blueprints
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Waste-to-Business Idea Library
          </h1>
          <p className="text-charcoal-light text-base sm:text-lg leading-relaxed">
            Search hundreds of actionable business ideas categorized by waste stream. Every card includes practical, step-by-step instructions to get started.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-sm space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by waste type or business idea (e.g. orange peel, sawdust, textile)..."
          />

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-royal text-white shadow-md'
                      : 'bg-surface text-charcoal-light border border-border hover:border-royal/30 hover:text-royal'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-sm text-charcoal-light px-1">
          <span>
            Showing <strong className="text-charcoal font-bold">{filteredIdeas.length}</strong> business ideas
            {totalPages > 1 && (
              <span className="ml-1 text-charcoal-light">— page {page} of {totalPages}</span>
            )}
          </span>
          {(search || selectedCategory !== 'All') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="text-royal font-medium hover:underline text-xs"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Ideas Grid */}
        {paginatedIdeas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-charcoal">No business ideas match your search</h3>
            <p className="text-sm text-charcoal-light max-w-md mx-auto">
              Try searching with different keywords or select a different category.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-bold shadow-md"
            >
              Show All Ideas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
