import ListingForm from '@/components/ListingForm';

export default function PostListingPage() {
  return (
    <div className="py-10 bg-surface min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold uppercase tracking-wider">
            ✍️ Quick Submission
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Post a Listing
          </h1>
          <p className="text-charcoal-light text-base">
            Whether you generate waste or need raw material for your venture, list it here to match with local partners.
          </p>
        </div>

        {/* Tabbed Form */}
        <ListingForm />
      </div>
    </div>
  );
}
