import { db } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authUtil';

export const GET = withAuth(async (
  request: NextRequest,
  userId: string,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const client = await db.client.findUnique({
      where: { id: id }
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
});