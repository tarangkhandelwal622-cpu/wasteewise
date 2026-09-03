/**
 * Data Service Layer
 * 
 * All data access goes through this module so a real database
 * can be swapped in later with minimal refactoring.
 * 
 * Currently uses static JSON files + in-memory arrays.
 * To connect a real DB: replace the function bodies below
 * with actual DB queries — the rest of the app stays unchanged.
 */

import ideasData from '@/data/ideas.json';
import listingsData from '@/data/listings.json';

// In-memory store (new listings added at runtime persist until server restart)
let listings = [...listingsData];

// ─── Categories ──────────────────────────────────────────────
export const CATEGORIES = [
  'Food & Agricultural',
  'Textile',
  'Plastic & Industrial',
  'E-Waste',
  'Construction',
  'Other',
];

// ─── Idea Functions ──────────────────────────────────────────

export function getIdeas({ search = '', category = '' } = {}) {
  let results = [...ideasData];

  if (category) {
    results = results.filter((idea) => idea.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (idea) =>
        idea.wasteSource.toLowerCase().includes(q) ||
        idea.businessIdea.toLowerCase().includes(q) ||
        idea.category.toLowerCase().includes(q)
    );
  }

  return results;
}

export function getIdeaById(id) {
  return ideasData.find((idea) => idea.id === Number(id)) || null;
}

// ─── Listing Functions ───────────────────────────────────────

export function getListings({
  search = '',
  category = '',
  type = '',
  city = '',
} = {}) {
  let results = [...listings];

  if (type) {
    results = results.filter((l) => l.type === type);
  }

  if (category) {
    results = results.filter((l) => l.category === category);
  }

  if (city) {
    const c = city.toLowerCase();
    results = results.filter((l) => l.location.toLowerCase().includes(c));
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (l) =>
        l.wasteName.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q))
    );
  }

  return results;
}

export function getListingById(id) {
  return listings.find((l) => l.id === id) || null;
}

export function addListing(data) {
  const prefix = data.type === 'generator' ? 'gen' : 'seek';
  const count = listings.filter((l) => l.type === data.type).length + 1;
  const newListing = {
    ...data,
    id: `${prefix}-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  listings.unshift(newListing);
  return newListing;
}

// ─── Matching Logic ──────────────────────────────────────────

export function getMatchingListings(listing) {
  const oppositeType = listing.type === 'generator' ? 'seeker' : 'generator';

  // Score-based matching: same waste name > same category > same city
  const matches = listings
    .filter((l) => l.type === oppositeType && l.id !== listing.id)
    .map((l) => {
      let score = 0;
      if (
        l.wasteName.toLowerCase().includes(listing.wasteName.toLowerCase()) ||
        listing.wasteName.toLowerCase().includes(l.wasteName.toLowerCase())
      ) {
        score += 10;
      }
      if (l.category === listing.category) {
        score += 5;
      }
      if (
        l.location.toLowerCase() === listing.location.toLowerCase()
      ) {
        score += 3;
      }
      return { ...l, _matchScore: score };
    })
    .filter((l) => l._matchScore > 0)
    .sort((a, b) => b._matchScore - a._matchScore)
    .slice(0, 6);

  return matches;
}

// ─── Helper: Get Unique Cities ───────────────────────────────

export function getCities() {
  const cities = [...new Set(listings.map((l) => l.location))];
  return cities.sort();
}
