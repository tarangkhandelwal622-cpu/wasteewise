'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import CategoryBadge from '@/components/CategoryBadge';

const CATEGORY_EMOJIS = {
  'Food & Agricultural': '🌾',
  'Textile': '🧵',
  'Plastic & Industrial': '♻️',
  'E-Waste': '💻',
  'Construction': '🏗️',
  'Other': '📦',
};

export default function IdeaDetailPage({ params }) {
  const resolvedParams = use(params);
  const ideaId = resolvedParams.id;

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchIdea() {
      try {
        const res = await fetch(`/api/ideas/${ideaId}`);
        if (res.status === 404) { setNotFound(true); return; }
        const json = await res.json();
        if (json.success) setIdea(json.data);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchIdea();
  }, [ideaId]);

  const handleShare = () => {
    const url = window.location.href;
    const text = idea ? `Check out this waste-to-business idea: "${idea.businessIdea}" from ${idea.wasteSource} — WasteWise` : 'Check out WasteWise!';
    if (navigator.share) {
      navigator.share({ title: 'WasteWise Idea', text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleWhatsApp = () => {
    if (!idea) return;
    const text = `💡 *Waste-to-Business Idea on WasteWise*\n\n*Waste Source:* ${idea.wasteSource}\n*Business:* ${idea.businessIdea}\n*Category:* ${idea.category}\n\nView full guide: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-charcoal-light text-sm">Loading idea…</p>
      </div>
    );
  }

  if (notFound || !idea) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-2xl font-bold text-charcoal">Idea Not Found</h2>
        <p className="text-charcoal-light text-sm">This idea doesn&apos;t exist or may have been removed.</p>
        <Link href="/ideas" className="inline-block px-6 py-2.5 bg-royal text-white rounded-xl text-sm font-bold">
          Back to Idea Library
        </Link>
      </div>
    );
  }

  const emoji = CATEGORY_EMOJIS[idea.category] || '💡';

  return (
    <div className="py-10 bg-surface min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back link */}
        <Link href="/ideas" className="inline-flex items-center gap-2 text-sm font-semibold text-royal hover:underline">
          ← Back to Idea Library
        </Link>

        {/* Hero card */}
        <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden">
          {/* Gradient banner */}
          <div className="bg-gradient-to-br from-royal/10 via-royal/5 to-white px-6 sm:px-8 pt-8 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-royal/10 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <CategoryBadge category={idea.category} size="lg" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal capitalize leading-tight">
                  {idea.businessIdea}
                </h1>
              </div>
            </div>

            {/* Waste source */}
            <div className="mt-5 flex items-center gap-3 p-4 rounded-2xl bg-white border border-border shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-light uppercase tracking-wider">Waste Source / Raw Material</p>
                <p className="text-base font-semibold text-charcoal">{idea.wasteSource}</p>
              </div>
            </div>
          </div>

          {/* Steps section */}
          <div className="px-6 sm:px-8 py-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-royal text-white rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-charcoal">
                Step-by-Step Startup Guide
                <span className="ml-2 text-sm font-normal text-charcoal-light">({idea.steps.length} steps)</span>
              </h2>
            </div>

            <ol className="space-y-4">
              {idea.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-royal to-royal-dark text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-1 pb-3 border-b border-border/60 last:border-0">
                    <p className="text-sm text-charcoal leading-relaxed">{step}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Action buttons */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#1da851] transition-colors shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-surface text-charcoal rounded-xl font-bold text-sm hover:bg-border transition-colors border border-border"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Link Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Find Listings CTA */}
        <div className="bg-gradient-to-r from-royal to-royal-dark text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <h2 className="text-xl font-bold">Ready to source the raw material?</h2>
          <p className="text-royal-light text-sm">
            Find businesses near you who generate <strong className="text-white">{idea.wasteSource}</strong> waste and are looking to give it away or sell it cheaply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/listings?search=${encodeURIComponent(idea.wasteSource)}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-royal font-bold rounded-xl text-sm shadow-md hover:bg-royal-light hover:text-white transition-colors"
            >
              Find Listings for This Waste →
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-colors"
            >
              Post a Seeker Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
