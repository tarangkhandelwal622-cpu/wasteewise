'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Food & Agricultural',
  'Textile',
  'Plastic & Industrial',
  'E-Waste',
  'Construction',
  'Other',
];

const UNITS = ['kg', 'liters', 'tons', 'pieces', 'bags'];
const FREQUENCIES = ['daily', 'weekly', 'monthly', 'one-time'];

export default function ListingForm() {
  const [listingType, setListingType] = useState('generator');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    wasteName: '',
    category: '',
    quantity: '',
    unit: 'kg',
    frequency: 'weekly',
    quality: '',
    purpose: '',
    location: '',
    area: '',
    radius: '',
    price: 'negotiable',
    budget: 'negotiable',
    priceAmount: '',
    budgetAmount: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        type: listingType,
        wasteName: formData.wasteName,
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        frequency: formData.frequency,
        location: formData.location,
        area: formData.area,
        description: formData.description,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      };

      if (listingType === 'generator') {
        payload.quality = formData.quality;
        payload.price = formData.price;
        payload.priceAmount =
          formData.price === 'fixed' ? Number(formData.priceAmount) : null;
      } else {
        payload.purpose = formData.purpose;
        payload.radius = formData.radius;
        payload.budget = formData.budget;
        payload.budgetAmount =
          formData.budget === 'fixed' ? Number(formData.budgetAmount) : null;
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          wasteName: '',
          category: '',
          quantity: '',
          unit: 'kg',
          frequency: 'weekly',
          quality: '',
          purpose: '',
          location: '',
          area: '',
          radius: '',
          price: 'negotiable',
          budget: 'negotiable',
          priceAmount: '',
          budgetAmount: '',
          description: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
        });
      }
    } catch (err) {
      console.error('Failed to submit listing:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-mint p-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-charcoal mb-2">Listing Posted Successfully!</h3>
        <p className="text-charcoal-light mb-6">
          Your listing is now live and visible to potential{' '}
          {listingType === 'generator' ? 'buyers' : 'suppliers'}.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2.5 bg-royal text-white rounded-xl font-medium hover:bg-royal-dark transition-colors shadow-md"
          >
            Post Another
          </button>
          <a
            href="/listings"
            className="px-6 py-2.5 bg-surface text-charcoal rounded-xl font-medium hover:bg-border transition-colors border border-border"
          >
            Browse Listings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Type toggle */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setListingType('generator')}
          className={`flex-1 px-6 py-4 text-sm font-bold transition-all duration-200 ${
            listingType === 'generator'
              ? 'bg-royal text-white shadow-inner'
              : 'bg-surface text-charcoal-light hover:bg-royal/5 hover:text-royal'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            I Generate Waste
          </span>
        </button>
        <button
          onClick={() => setListingType('seeker')}
          className={`flex-1 px-6 py-4 text-sm font-bold transition-all duration-200 ${
            listingType === 'seeker'
              ? 'bg-royal text-white shadow-inner'
              : 'bg-surface text-charcoal-light hover:bg-royal/5 hover:text-royal'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            I Want Waste
          </span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Waste name */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-1.5">
            {listingType === 'generator' ? 'Waste Type / Name' : 'Waste / Material Needed'} *
          </label>
          <input
            required
            type="text"
            value={formData.wasteName}
            onChange={(e) => handleChange('wasteName', e.target.value)}
            placeholder="e.g., Citrus peels, Sawdust, Plastic scrap"
            className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-1.5">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal cursor-pointer hover:border-royal/30 transition-colors"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity + unit + frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Quantity *
            </label>
            <input
              required
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="e.g., 50"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal hover:border-royal/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Unit
            </label>
            <select
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal cursor-pointer hover:border-royal/30 transition-colors"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal cursor-pointer hover:border-royal/30 transition-colors"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generator: Quality notes / Seeker: Purpose */}
        {listingType === 'generator' ? (
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Quality / Purity Notes
            </label>
            <input
              type="text"
              value={formData.quality}
              onChange={(e) => handleChange('quality', e.target.value)}
              placeholder='e.g., "Clean, segregated" or "Mixed with other waste"'
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Purpose / Business Use *
            </label>
            <textarea
              required
              rows={2}
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="Briefly describe what you plan to make with this waste"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors resize-none"
            />
          </div>
        )}

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              City *
            </label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Mumbai"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Area / Pincode
            </label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="e.g., Andheri West / 400053"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
            />
          </div>
        </div>

        {/* Seeker: Radius */}
        {listingType === 'seeker' && (
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Radius Willing to Source From
            </label>
            <input
              type="text"
              value={formData.radius}
              onChange={(e) => handleChange('radius', e.target.value)}
              placeholder='e.g., "within 20km" or "Pan-India"'
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
            />
          </div>
        )}

        {/* Price/Budget */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-1.5">
            {listingType === 'generator' ? 'Price' : 'Budget'}
          </label>
          <div className="flex gap-2 mb-2">
            {['free', 'negotiable', 'fixed'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() =>
                  handleChange(
                    listingType === 'generator' ? 'price' : 'budget',
                    opt
                  )
                }
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 capitalize ${
                  (listingType === 'generator'
                    ? formData.price
                    : formData.budget) === opt
                    ? 'bg-royal text-white border-royal shadow-md'
                    : 'bg-surface text-charcoal-light border-border hover:border-royal/30'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {((listingType === 'generator' && formData.price === 'fixed') ||
            (listingType === 'seeker' && formData.budget === 'fixed')) && (
            <input
              type="number"
              min="0"
              value={
                listingType === 'generator'
                  ? formData.priceAmount
                  : formData.budgetAmount
              }
              onChange={(e) =>
                handleChange(
                  listingType === 'generator' ? 'priceAmount' : 'budgetAmount',
                  e.target.value
                )
              }
              placeholder="Amount per unit (₹)"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add any details that would help potential matches..."
            className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors resize-none"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-5">
          <h4 className="text-sm font-bold text-charcoal mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Contact Information
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">
                Name *
              </label>
              <input
                required
                type="text"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-charcoal placeholder-charcoal-light/50 hover:border-royal/30 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-royal text-white rounded-xl font-bold text-sm hover:bg-royal-dark transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Posting...
            </span>
          ) : (
            `Post as ${listingType === 'generator' ? 'Waste Generator' : 'Waste Seeker'}`
          )}
        </button>
      </form>
    </div>
  );
}
