import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const offset = (page - 1) * limit;
        const types = searchParams.get('types')?.split(',').filter(Boolean)

        // Base queries
        let countQuery = 'SELECT COUNT(*) as count FROM pokemon';
        let dataQuery = 'SELECT * FROM pokemon';
        const queryParams: any[] = [];
        const conditions: string[] = [];

        // Add type filters
        if (types && types.length > 0) {
            const typeConditions = types.map(() => '(`type1` = ? OR `type2` = ?)').join(' OR ');
            conditions.push(`(${typeConditions})`);
            types.forEach(type => {
                queryParams.push(type, type);
            });
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
