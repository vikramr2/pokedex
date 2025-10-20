import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await query<{ count: string }>('SELECT COUNT(*) as count FROM pokemon');
    const total = parseInt(countResult[0].count);

    // Get paginated results
    const pokemon = await query(
      'SELECT * FROM pokemon LIMIT 10;',
      [limit, offset]
    );

    return NextResponse.json({
      data: pokemon,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pokemon' },
      { status: 500 }
    );
  }
}
