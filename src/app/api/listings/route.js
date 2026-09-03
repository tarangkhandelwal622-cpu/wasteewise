import { NextResponse } from 'next/server';
import { getListings, addListing } from '@/lib/data-service';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const city = searchParams.get('city') || '';

  const listings = getListings({ search, category, type, city });
  return NextResponse.json({ success: true, count: listings.length, data: listings });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newListing = addListing(body);
    return NextResponse.json({ success: true, data: newListing }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 400 }
    );
  }
}
