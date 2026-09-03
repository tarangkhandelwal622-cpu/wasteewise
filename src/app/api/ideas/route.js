import { NextResponse } from 'next/server';
import { getIdeas } from '@/lib/data-service';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const ideas = getIdeas({ search, category });
  return NextResponse.json({ success: true, count: ideas.length, data: ideas });
}
