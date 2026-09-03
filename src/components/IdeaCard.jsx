'use client';

import { useState } from 'react';
import Link from 'next/link';
import CategoryBadge from './CategoryBadge';

export default function IdeaCard({ idea }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/ideas/${idea.id}`;
    const text = `💡 *Waste-to-Business Idea*\n\n*Waste:* ${idea.wasteSource}\n*Business:* ${idea.businessIdea}\n\nSee full guide: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/ideas/${idea.id}`;
    if (navigator.share) {
      navigator.share({ title: idea.businessIdea, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-royal/30 transition-all duration-300 overflow-hidden group flex flex-col">
      <div className="p-5 flex-1">
        {/* Category badge */}
        <div className="mb-3">
          <CategoryBadge category={idea.category} />
        </div>

        {/* Waste source */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">
              Waste Source
            </p>
            <p className="text-sm font-medium text-charcoal">{idea.wasteSource}</p>
          </div>
        </div>

        {/* Business idea title */}
        <h3 className="text-base font-bold text-charcoal mt-3 mb-2 leading-snug group-hover:text-royal transition-colors capitalize">
          {idea.businessIdea}
        </h3>

        {/* Steps toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm font-medium text-royal hover:text-royal-dark transition-colors mt-2"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {expanded ? 'Hide' : 'Show'} Steps to Start ({idea.steps.length})
        </button>

        {/* Expandable steps */}
        {expanded && (
          <div className="mt-3 animate-slide-down">
            <ol className="space-y-2 pl-1">
              {idea.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-charcoal-light leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 bg-royal/10 text-royal rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-4 pt-3 border-t border-border flex items-center justify-between gap-2">
        <Link
          href={`/ideas/${idea.id}`}
          className="text-xs font-bold text-royal hover:underline flex items-center gap-1"
        >
          Full Guide →
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
  );
}
