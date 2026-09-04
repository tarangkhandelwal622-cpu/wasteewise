'use client';

import { useState } from 'react';
import DemoChatWindow from './DemoChatWindow';

export default function NegotiationPanel({ data, onUpdate, onNext, onBack }) {
  const [activeChatSeller, setActiveChatSeller] = useState(null);

  const handleStartChat = (listing) => {
    setActiveChatSeller(listing);
  };

  const handleDealAccepted = (sellerId, dealSummary) => {
    const updatedDeals = [
      ...data.acceptedDeals.filter(d => d.sellerId !== sellerId),
      { sellerId, ...dealSummary }
    ];
    onUpdate({ acceptedDeals: updatedDeals });
    setActiveChatSeller(null);
  };

  const handleDealRejected = () => {
    // Optionally record rejection, but for now just close the chat
    setActiveChatSeller(null);
  };

  const isDealAccepted = (sellerId) => {
    return data.acceptedDeals.some(d => d.sellerId === sellerId);
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-extrabold text-white">
          Source Material &amp; Negotiate
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-2xl mx-auto">
          We found {data.matchedListings?.length || 0} potential suppliers for <strong>{data.wasteType}</strong>. 
          Let our AI agent negotiate bulk discounts and favorable terms on your behalf.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.matchedListings?.map((listing) => {
          const accepted = isDealAccepted(listing.id);

          return (
            <div 
              key={listing.id} 
              className={`rounded-2xl p-6 border transition-all duration-300 ${
                accepted 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-slate-900/80 border-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${accepted ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                    {accepted ? '✅' : '🏢'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{listing.contactName}</h3>
                    <p className="text-slate-400 text-xs">{listing.location}{listing.area ? `, ${listing.area}` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{listing.priceAmount ? `₹${listing.priceAmount}/${listing.unit}` : listing.price}</div>
                  <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Asking Price</div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-700/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Volume</div>
                    <div className="text-slate-200 font-medium">{listing.quantity} {listing.unit}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Frequency</div>
                    <div className="text-slate-200 font-medium capitalize">{listing.frequency}</div>
                  </div>
                </div>
              </div>

              {accepted ? (
                <div className="w-full py-3 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Deal Secured
                </div>
              ) : (
                <button
                  onClick={() => handleStartChat(listing)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-600 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start AI Negotiation
                </button>
              )}
            </div>
          );
        })}

        {(!data.matchedListings || data.matchedListings.length === 0) && (
          <div className="col-span-1 lg:col-span-2 bg-slate-900/80 border border-slate-700/50 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-white font-bold text-lg mb-2">No direct suppliers found yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              There are currently no active listings for <strong>{data.wasteType}</strong> matching your criteria. 
              We can still generate a complete business blueprint based on market averages.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 border-t border-slate-700/50 pt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-800 border border-slate-600 text-slate-400 rounded-xl font-bold text-sm hover:border-slate-500 hover:text-slate-300 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
        >
          {data.acceptedDeals.length > 0 ? 'Generate Blueprint →' : 'Skip & Generate Blueprint →'}
        </button>
      </div>

      {/* Chat Modal */}
      {activeChatSeller && (
        <DemoChatWindow 
          listing={{...activeChatSeller, sellerId: activeChatSeller.id}}
          onClose={() => setActiveChatSeller(null)}
          onDealAccepted={(deal) => handleDealAccepted(activeChatSeller.id, deal)}
          onDealRejected={handleDealRejected}
        />
      )}
    </div>
  );
}
