import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const offset = (page - 1) * limit;

        // Base queries
        let countQuery = 'SELECT COUNT(*) as count FROM pokemon';
        let dataQuery = 'SELECT * FROM pokemon';
        const queryParams: any[] = [];
        const conditions: string[] = [];

        // Get total count
        const countResult = await query<{ count: string }>(countQuery, queryParams);
        const total = parseInt(countResult[0].count);

        // Get paginated results
        dataQuery += ' LIMIT ? OFFSET ?';
        const pokemon = await query(
            dataQuery,
            [...queryParams, limit, offset]
        );

        // Return the response
        return NextResponse.json({
            data: pokemon,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit), // This will be useful for frontend
            },
        });
    } catch (error) {
        console.error('Error handling GET request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
