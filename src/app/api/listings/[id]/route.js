import { NextResponse } from 'next/server';
import { getListingById, getMatchingListings } from '@/lib/data-service';

export async function GET(request, { params }) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return NextResponse.json(
      { success: false, error: 'Listing not found' },
      { status: 404 }
    );
  }

  const matching = getMatchingListings(listing);
  return NextResponse.json({ success: true, data: listing, matching });
}
