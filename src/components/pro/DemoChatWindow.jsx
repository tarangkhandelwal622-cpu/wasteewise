'use client';

import { useState, useRef, useEffect } from 'react';

export default function DemoChatWindow({ listing, onClose, onDealReady, onDealAccepted, onDealRejected }) {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Starting AI negotiation on your behalf...',
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [round, setRound] = useState(1);
  const [dealSummary, setDealSummary] = useState(null);
  const [dealStatus, setDealStatus] = useState('negotiating'); // negotiating, offer_ready, accepted, rejected
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initial negotiation trigger
  useEffect(() => {
    const startNegotiation = async () => {
      await nextRound();
    };
    startNegotiation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextRound = async () => {
    setLoading(true);
    
    // Build conversation history for API
    const history = messages
      .filter(m => m.role === 'agent' || m.role === 'seller')
      .map(m => `${m.role === 'agent' ? 'Buyer (AI Agent)' : 'Seller'}: ${m.content}`)
      .join('\n');

    try {
      const res = await fetch('/api/pro/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing,
          targetPrice: `20% below asking price (${listing.priceAmount ? '₹' + listing.priceAmount : listing.price})`,
          conversationHistory: history,
          round
        })
      });

      const data = await res.json();
      
      if (data.success) {
        // Add agent message
        setMessages(prev => [...prev, { role: 'agent', content: data.agentMessage }]);
        
        // Simulate thinking delay for seller
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'seller', content: data.sellerResponse }]);
          
          if (data.status === 'offer_ready' && data.dealSummary) {
            setDealSummary(data.dealSummary);
            setDealStatus('offer_ready');
            if (onDealReady) onDealReady(data.dealSummary);
          } else {
            setRound(r => r + 1);
          }
          setLoading(false);
        }, 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'system', content: 'Negotiation paused due to network error.' }]);
      setLoading(false);
    }
  };

  const handleAccept = () => {
    setDealStatus('accepted');
    if (onDealAccepted) onDealAccepted(dealSummary);
  };

  const handleReject = () => {
    setDealStatus('rejected');
    if (onDealRejected) onDealRejected();
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] max-h-[800px]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
              {listing.wasteName.includes('Plastic') ? '♻️' : '📦'}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Negotiating with {listing.contactName}</h3>
              <p className="text-slate-400 text-xs">{listing.wasteName} • {listing.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Demo Banner */}
        <div className="bg-amber-500/20 text-amber-400 text-xs py-2 px-4 text-center font-medium border-b border-amber-500/20 flex-shrink-0">
          🔶 <strong>Demo Mode:</strong> The seller&apos;s responses are AI-generated to simulate a realistic negotiation based on market data.
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'agent' ? 'items-end' : msg.role === 'seller' ? 'items-start' : 'items-center'}`}>
              
              {msg.role === 'system' ? (
                <div className="text-xs text-slate-500 my-2 italic">{msg.content}</div>
              ) : (
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.role === 'seller' && (
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs">👤</div>
                  )}
                  
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'agent' 
                      ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-br-sm' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-bl-sm'
                  }`}>
                    {msg.role === 'agent' && <div className="text-[10px] font-bold text-amber-500 uppercase mb-1">WasteWise AI Agent</div>}
                    {msg.role === 'seller' && <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{listing.contactName}</div>}
                    {msg.content}
                  </div>

                  {msg.role === 'agent' && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-xs shadow-lg shadow-amber-500/20">🤖</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 my-2">
              <svg className="w-4 h-4 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI is analyzing and strategizing next move...
            </div>
          )}

          {dealStatus === 'offer_ready' && dealSummary && (
            <div className="mt-6 p-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/50 rounded-2xl shadow-xl animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                AI Recommends This Deal
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Agreed Price</div>
                  <div className="text-white font-bold">{dealSummary.agreedPrice}</div>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Volume & Frequency</div>
                  <div className="text-white font-bold">{dealSummary.quantity} • {dealSummary.frequency}</div>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Logistics & Payment</div>
                  <div className="text-white font-bold">{dealSummary.logistics} • {dealSummary.paymentTerms}</div>
                </div>
                <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  <div className="text-emerald-500/80 text-xs mb-1">Estimated Savings</div>
                  <div className="text-emerald-400 font-bold">{dealSummary.savings}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleAccept}
                  className="flex-1 py-3 bg-amber-500 text-black font-extrabold rounded-xl hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all flex justify-center items-center gap-2"
                >
                  ✓ Accept This Deal
                </button>
                <button 
                  onClick={handleReject}
                  className="px-6 py-3 bg-slate-800 text-white font-bold border border-slate-600 rounded-xl hover:bg-slate-700 transition-all"
                >
                  ✗ Reject
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-500 mt-3">Nothing is finalized until you click Accept.</p>
            </div>
          )}

          {dealStatus === 'accepted' && (
            <div className="my-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center text-sm font-bold">
              ✅ Deal Accepted! Added to your Business Blueprint.
            </div>
          )}
          {dealStatus === 'rejected' && (
            <div className="my-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center text-sm font-bold">
              ❌ Deal Rejected. Closing negotiation...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Action Bar */}
        {dealStatus === 'negotiating' && !loading && (
          <div className="bg-slate-800 p-4 border-t border-slate-700 flex-shrink-0">
            <button 
              onClick={nextRound}
              className="w-full py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 border border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Push for a better deal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
