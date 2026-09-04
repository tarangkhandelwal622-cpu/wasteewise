import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import IdeaCard from '@/components/IdeaCard';
import ListingCard from '@/components/ListingCard';
import ImpactStats from '@/components/ImpactStats';
import { getIdeas, getListings } from '@/lib/data-service';

export default function Home() {
  const featuredIdeas = getIdeas().slice(0, 6);
  const recentListings = getListings().slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Animated Impact Stats */}
      <ImpactStats />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Featured Ideas Preview */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider mb-2">
                💡 Innovation Blueprints
              </div>
              <h2 className="text-3xl font-extrabold text-charcoal sm:text-4xl">
                Featured Business Ideas
              </h2>
              <p className="text-charcoal-light text-sm sm:text-base mt-1">
                Explore proven ways to turn waste streams into commercial ventures
              </p>
            </div>
            <Link
              href="/ideas"
              className="text-royal font-bold text-sm hover:text-royal-dark flex items-center gap-1 group"
            >
              Browse all 240+ ideas
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      </section>

      {/* Active Marketplace Preview */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/30 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                ⚡ Active Listings
              </div>
              <h2 className="text-3xl font-extrabold text-charcoal sm:text-4xl">
                Recent Marketplace Posts
              </h2>
              <p className="text-charcoal-light text-sm sm:text-base mt-1">
                Real waste generators and entrepreneurs looking to trade materials
              </p>
            </div>
            <Link
              href="/listings"
              className="text-royal font-bold text-sm hover:text-royal-dark flex items-center gap-1 group"
            >
              View all listings
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Go Pro Premium CTA */}
      <section className="py-20 pro-dark-bg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
        <div className="absolute -left-40 -top-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                WasteWise Premium
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Automate Your Waste Business with <span className="gold-shimmer-text">Go Pro</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                Don&apos;t just browse ideas. Let our advanced AI build your strategy, auto-negotiate with suppliers, and generate a complete business blueprint in minutes.
              </p>
              
              <div className="space-y-4 mb-8 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">1</div>
                  <span><strong className="text-white">AI Strategy Engine:</strong> Tailored ideas inspired by real companies.</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">2</div>
                  <span><strong className="text-white">Auto-Negotiation:</strong> AI chats with sellers to get you the best price.</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">3</div>
                  <span><strong className="text-white">Business Blueprint:</strong> Full financial projections &amp; compliance plan.</span>
                </div>
              </div>

              <Link
                href="/go-pro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Try Go Pro Features
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Link>
            </div>
            
            <div className="relative">
              {/* Mockup visual */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 gold-glow">
                <div className="bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="mx-auto bg-slate-900 rounded text-[10px] text-slate-500 px-10 py-1">wastewise.in/go-pro</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold">AI</div>
                    <div>
                      <div className="text-white font-bold text-sm">WasteWise Negotiator</div>
                      <div className="text-slate-400 text-xs">Deal Status: Offer Ready</div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="bg-slate-800 p-3 rounded-xl rounded-bl-sm text-sm text-slate-300 w-[85%] border border-slate-700">
                      Would you consider ₹18/kg for a committed monthly pickup? We'll arrange our own transport.
                    </div>
                    <div className="bg-amber-500/10 p-3 rounded-xl rounded-br-sm text-sm text-amber-100 w-[85%] ml-auto border border-amber-500/30">
                      Deal! ₹18/kg works for us. Please have your buyer confirm.
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-3 rounded-xl text-center font-bold text-black text-sm shadow-inner">
                    ✓ Accept Deal &amp; Generate Blueprint
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-royal to-royal-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Have Waste or Need Raw Material?
          </h2>
          <p className="text-royal-light text-base sm:text-lg max-w-2xl mx-auto">
            Join WasteWise today and connect directly with businesses near you. Free to list, free to explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/post"
              className="px-8 py-4 bg-white text-royal font-bold rounded-xl shadow-lg hover:bg-royal-light hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Post Your Listing Now
            </Link>
            <Link
              href="/listings"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
