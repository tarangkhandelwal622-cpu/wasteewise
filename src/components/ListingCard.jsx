'use client';

import Link from 'next/link';
import { useState } from 'react';
import CategoryBadge from './CategoryBadge';

export default function ListingCard({ listing, cityFilter = '' }) {
  const isGenerator = listing.type === 'generator';
  const [copied, setCopied] = useState(false);

  const priceLabel =
    listing.price === 'free' || listing.budget === 'free'
      ? 'Free'
      : listing.price === 'negotiable' || listing.budget === 'negotiable'
      ? 'Negotiable'
      : `₹${listing.priceAmount || listing.budgetAmount}/kg`;

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/listings/${listing.id}`;
    const text = `♻️ *${isGenerator ? 'Waste Available' : 'Waste Needed'} on WasteWise*\n\n*Material:* ${listing.wasteName}\n*Category:* ${listing.category}\n*Quantity:* ${listing.quantity} ${listing.unit} / ${listing.frequency}\n*Location:* ${listing.location}${listing.area ? ', ' + listing.area : ''}\n*Price:* ${priceLabel}\n\nView listing: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/listings/${listing.id}`;
    if (navigator.share) {
      navigator.share({ title: listing.wasteName, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="block group h-full">
      <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-royal/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Type ribbon */}
        <div
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-border ${
            isGenerator
              ? 'bg-gradient-to-r from-royal/10 to-white text-royal'
              : 'bg-gradient-to-r from-emerald-50 to-white text-emerald-800'
          }`}
        >
          {isGenerator ? (
            <>
              <span className="w-2 h-2 bg-royal rounded-full"></span>
              Has Waste
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Wants Waste
            </>
          )}
        </div>

        <Link href={`/listings/${listing.id}`} className="flex-1 p-5 block">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-base font-bold text-charcoal group-hover:text-royal transition-colors leading-snug">
              {listing.wasteName}
            </h3>
            <span
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                listing.price === 'free' || listing.budget === 'free'
                  ? 'bg-white text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-white text-royal border-royal/30 shadow-xs'
              }`}
            >
              {priceLabel}
            </span>
          </div>

          {/* Category */}
          <div className="mb-3">
            <CategoryBadge category={listing.category} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-light mb-3">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>{listing.quantity} {listing.unit}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="capitalize">{listing.frequency}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-charcoal-light">
            <svg className="w-4 h-4 text-royal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {listing.location}
              {listing.area && `, ${listing.area}`}
            </span>
            {cityFilter &&
              listing.location.toLowerCase() === cityFilter.toLowerCase() && (
                <span className="ml-1 px-2 py-0.5 bg-white text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded-full shadow-xs flex-shrink-0">
                  Near you
                </span>
              )}
          </div>
        </Link>

        {/* Footer: View + share actions */}
        <div className="px-5 pb-4 pt-3 border-t border-border flex items-center justify-between gap-2">
          <Link
            href={`/listings/${listing.id}`}
            className="text-xs font-bold text-royal hover:underline flex items-center gap-1"
          >
            View Details →
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleWhatsApp}
              title="Share on WhatsApp"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button
              onClick={handleShare}
              title={copied ? 'Copied!' : 'Copy link'}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface text-charcoal-light hover:bg-royal/10 hover:text-royal transition-all duration-200 border border-border"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
