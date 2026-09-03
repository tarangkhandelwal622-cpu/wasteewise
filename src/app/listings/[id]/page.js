'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import CategoryBadge from '@/components/CategoryBadge';
import ListingCard from '@/components/ListingCard';

export default function ListingDetailPage({ params }) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [listing, setListing] = useState(null);
  const [matchingListings, setMatchingListings] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${listingId}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setListing(json.data);
          setMatchingListings(json.matching || []);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-charcoal-light text-sm">Loading listing…</p>
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-charcoal">Listing Not Found</h2>
        <p className="text-charcoal-light text-sm">The listing you are looking for does not exist or has been removed.</p>
        <Link href="/listings" className="inline-block px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-bold">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isGenerator = listing.type === 'generator';

  return (
    <div className="py-10 bg-surface min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-royal hover:underline"
        >
          ← Back to All Listings
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-border shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div
            className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border ${
              isGenerator
                ? 'bg-gradient-to-r from-royal/10 via-royal/5 to-white'
                : 'bg-gradient-to-r from-mint/30 via-mint/10 to-white'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isGenerator ? 'bg-royal text-white' : 'bg-emerald-700 text-white'
                  }`}
                >
                  {isGenerator ? '🏭 Waste Generator' : '🔍 Waste Seeker'}
                </span>
                <CategoryBadge category={listing.category} size="lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
                {listing.wasteName}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-charcoal-light uppercase font-semibold block mb-0.5">
                {isGenerator ? 'Price Terms' : 'Budget Terms'}
              </span>
              <span className="text-2xl font-extrabold text-royal">
                {listing.price === 'free' || listing.budget === 'free'
                  ? 'FREE'
                  : listing.price === 'negotiable' || listing.budget === 'negotiable'
                  ? 'Negotiable'
                  : `₹${listing.priceAmount || listing.budgetAmount} / unit`}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface border border-border text-center">
              <div>
                <span className="text-xs text-charcoal-light uppercase font-semibold block">Quantity</span>
                <span className="text-base font-bold text-charcoal">{listing.quantity} {listing.unit}</span>
              </div>
              <div>
                <span className="text-xs text-charcoal-light uppercase font-semibold block">Frequency</span>
                <span className="text-base font-bold text-charcoal capitalize">{listing.frequency}</span>
              </div>
              <div>
                <span className="text-xs text-charcoal-light uppercase font-semibold block">Location</span>
                <span className="text-base font-bold text-charcoal">{listing.location}</span>
              </div>
              <div>
                <span className="text-xs text-charcoal-light uppercase font-semibold block">Area</span>
                <span className="text-base font-bold text-charcoal">{listing.area || 'N/A'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-charcoal">Description &amp; Details</h3>
              <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">
                {listing.description || 'No additional description provided.'}
              </p>
            </div>

            {/* Quality or Purpose notes */}
            {isGenerator && listing.quality && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">Quality &amp; Purity Notes</h4>
                <p className="text-sm text-blue-800">{listing.quality}</p>
              </div>
            )}

            {!isGenerator && listing.purpose && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">Intended Business Purpose</h4>
                <p className="text-sm text-emerald-800">{listing.purpose}</p>
              </div>
            )}

            {/* Contact Information Section (Reveal pattern) */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <span>📞</span> Contact Information
              </h3>

              {!showContact ? (
                <div className="bg-surface rounded-2xl p-6 border border-border text-center space-y-3">
                  <p className="text-sm text-charcoal-light">
                    Click below to reveal the direct contact details for this listing.
                  </p>
                  <button
                    onClick={() => setShowContact(true)}
                    className="px-8 py-3.5 bg-royal text-white font-bold rounded-xl shadow-md hover:bg-royal-dark transition-all duration-200"
                  >
                    Reveal Contact Details
                  </button>
                </div>
              ) : (
                <div className="bg-mint/10 border border-mint rounded-2xl p-6 animate-fade-in space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-charcoal-light uppercase font-semibold block">Contact Name</span>
                      <span className="text-sm font-bold text-charcoal">{listing.contactName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-charcoal-light uppercase font-semibold block">Phone</span>
                      <a href={`tel:${listing.contactPhone}`} className="text-sm font-bold text-royal hover:underline">
                        {listing.contactPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-charcoal-light uppercase font-semibold block">Email</span>
                      <a href={`mailto:${listing.contactEmail}`} className="text-sm font-bold text-royal hover:underline">
                        {listing.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar / Matching Listings Section */}
        <div className="pt-8 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold text-charcoal flex items-center gap-2">
              <span>⚡</span> Similar / Matching Listings
            </h2>
            <p className="text-sm text-charcoal-light mt-1">
              Showing opposite-type listings in the same category or location
            </p>
          </div>

          {matchingListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingListings.map((m) => (
                <ListingCard key={m.id} listing={m} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-8 text-center text-charcoal-light text-sm">
              No matching listings found at the moment. Check back soon or post a new request!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
