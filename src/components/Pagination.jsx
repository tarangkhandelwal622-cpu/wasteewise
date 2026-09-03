'use client';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 1; // pages around current
  const left = currentPage - delta;
  const right = currentPage + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    }
  }

  // Insert ellipsis
  const withEllipsis = [];
  let prev = null;
  for (const page of pages) {
    if (prev && page - prev > 1) {
      withEllipsis.push('...');
    }
    withEllipsis.push(page);
    prev = page;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-white text-charcoal-light hover:border-royal/40 hover:text-royal disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {withEllipsis.map((item, idx) =>
        item === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-charcoal-light text-sm">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === item
                ? 'bg-royal text-white shadow-md border border-royal'
                : 'bg-white border border-border text-charcoal-light hover:border-royal/40 hover:text-royal shadow-sm'
            }`}
          >
            {item}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-white text-charcoal-light hover:border-royal/40 hover:text-royal disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
