import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        MIN(hp) as minHp,
        MAX(hp) as maxHp,
        MIN(attack) as minAttack,
        MAX(attack) as maxAttack,
        MIN(defense) as minDefense,
        MAX(defense) as maxDefense,
        MIN(speed) as minSpeed,
        MAX(speed) as maxSpeed
      FROM pokemon
    `);

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stat ranges' },
      { status: 500 }
    );
  }
}
