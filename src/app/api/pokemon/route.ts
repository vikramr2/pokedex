import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const name = searchParams.get('name');

    let countQuery = 'SELECT COUNT(*) as count FROM pokemon';
    let dataQuery = 'SELECT * FROM pokemon';
    const queryParams: any[] = [];

    // Add name filter if provided
    if (name) {
      countQuery += ' WHERE `name` LIKE ?';
      dataQuery += ' WHERE `name` LIKE ?';
      queryParams.push(`%${name}%`);
    }

    // Get total count
    const countResult = await query<{ count: string }>(countQuery, queryParams);
    const total = parseInt(countResult[0].count);

    // Get paginated results
    dataQuery += ' LIMIT ? OFFSET ?';
    const pokemon = await query(
      dataQuery,
      [...queryParams, limit, offset]
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
