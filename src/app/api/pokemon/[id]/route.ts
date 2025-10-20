import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pokemonId = parseInt(id);

    if (isNaN(pokemonId)) {
      return NextResponse.json(
        { error: 'Invalid pokemon ID' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM pokemon WHERE "#" = $1',
      [pokemonId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pokemon' },
      { status: 500 }
    );
  }
}
