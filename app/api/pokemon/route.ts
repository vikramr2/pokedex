import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({ message: 'Hello, World!' });
    } catch (error) {
        console.error('Error handling GET request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
