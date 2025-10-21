import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const name = searchParams.get('name');

    // Type filters
    const types = searchParams.get('types')?.split(',').filter(Boolean);

    // Stat range filters
    const minHp = searchParams.get('minHp');
    const maxHp = searchParams.get('maxHp');
    const minAttack = searchParams.get('minAttack');
    const maxAttack = searchParams.get('maxAttack');
    const minDefense = searchParams.get('minDefense');
    const maxDefense = searchParams.get('maxDefense');
    const minSpeed = searchParams.get('minSpeed');
    const maxSpeed = searchParams.get('maxSpeed');

    let countQuery = 'SELECT COUNT(*) as count FROM pokemon';
    let dataQuery = 'SELECT * FROM pokemon';
    const queryParams: any[] = [];
    const conditions: string[] = [];

    // Add name filter if provided
    if (name) {
      conditions.push('`name` LIKE ?');
      queryParams.push(`%${name}%`);
    }

    // Add type filters
    if (types && types.length > 0) {
      const typeConditions = types.map(() => '(`type1` = ? OR `type2` = ?)').join(' OR ');
      conditions.push(`(${typeConditions})`);
      types.forEach(type => {
        queryParams.push(type, type);
      });
    }

    // Add stat range filters
    if (minHp) {
      conditions.push('`hp` >= ?');
      queryParams.push(parseInt(minHp));
    }
    if (maxHp) {
      conditions.push('`hp` <= ?');
      queryParams.push(parseInt(maxHp));
    }
    if (minAttack) {
      conditions.push('`attack` >= ?');
      queryParams.push(parseInt(minAttack));
    }
    if (maxAttack) {
      conditions.push('`attack` <= ?');
      queryParams.push(parseInt(maxAttack));
    }
    if (minDefense) {
      conditions.push('`defense` >= ?');
      queryParams.push(parseInt(minDefense));
    }
    if (maxDefense) {
      conditions.push('`defense` <= ?');
      queryParams.push(parseInt(maxDefense));
    }
    if (minSpeed) {
      conditions.push('`speed` >= ?');
      queryParams.push(parseInt(minSpeed));
    }
    if (maxSpeed) {
      conditions.push('`speed` <= ?');
      queryParams.push(parseInt(maxSpeed));
    }

    // Build WHERE clause
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      countQuery += whereClause;
      dataQuery += whereClause;
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
