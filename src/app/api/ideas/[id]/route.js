// Ideas API route — GET /api/ideas/[id]
import { NextResponse } from 'next/server';
import { getIdeaById } from '@/lib/data-service';

export async function GET(request, { params }) {
  const { id } = await params;
  const idea = getIdeaById(Number(id));

  if (!idea) {
    return NextResponse.json(
      { success: false, error: 'Idea not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: idea });
}
