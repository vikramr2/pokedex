// EXAMPLE FILE - NOT USED IN PRODUCTION
// This file demonstrates how to add POST and PUT methods to the pokemon API route

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST - Create a new Pokemon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type1, type2, hp, attack, defense, speed } = body;

    // Validation
    if (!name || !type1) {
      return NextResponse.json(
        { error: 'Name and type1 are required' },
        { status: 400 }
      );
    }

    // Insert new pokemon
    const result = await query(
      `INSERT INTO pokemon (name, type1, type2, hp, attack, defense, speed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type1,
        type2 || null,
        hp || 0,
        attack || 0,
        defense || 0,
        speed || 0
      ]
    );

    return NextResponse.json(
      {
        message: 'Pokemon created successfully',
        id: result.insertId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create pokemon' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing Pokemon (would typically go in /api/pokemon/[id]/route.ts)
// This is just an example of what it would look like
export async function PUT_EXAMPLE(request: NextRequest, pokemonId: number) {
  try {
    const body = await request.json();
    const { name, type1, type2, hp, attack, defense, speed } = body;

    // Check if pokemon exists
    const existing = await query(
      'SELECT * FROM pokemon WHERE `id` = ?',
      [pokemonId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    // Update pokemon
    await query(
      `UPDATE pokemon
       SET name = ?, type1 = ?, type2 = ?, hp = ?, attack = ?, defense = ?, speed = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        type1 || existing[0].type1,
        type2 !== undefined ? type2 : existing[0].type2,
        hp !== undefined ? hp : existing[0].hp,
        attack !== undefined ? attack : existing[0].attack,
        defense !== undefined ? defense : existing[0].defense,
        speed !== undefined ? speed : existing[0].speed,
        pokemonId
      ]
    );

    return NextResponse.json({
      message: 'Pokemon updated successfully',
      id: pokemonId
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update pokemon' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (would typically go in /api/pokemon/[id]/route.ts)
export async function PATCH_EXAMPLE(request: NextRequest, pokemonId: number) {
  try {
    const body = await request.json();

    // Build dynamic update query based on provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    const allowedFields = ['name', 'type1', 'type2', 'hp', 'attack', 'defense', 'speed'];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`\`${field}\` = ?`);
        updateValues.push(body[field]);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add the ID to the end of the values array
    updateValues.push(pokemonId);

    await query(
      `UPDATE pokemon SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({
      message: 'Pokemon updated successfully',
      id: pokemonId
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update pokemon' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a Pokemon (would typically go in /api/pokemon/[id]/route.ts)
export async function DELETE_EXAMPLE(request: NextRequest, pokemonId: number) {
  try {
    const result = await query(
      'DELETE FROM pokemon WHERE `id` = ?',
      [pokemonId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Pokemon deleted successfully',
      id: pokemonId
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete pokemon' },
      { status: 500 }
    );
  }
}
