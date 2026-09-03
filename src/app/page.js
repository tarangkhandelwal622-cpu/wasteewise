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
