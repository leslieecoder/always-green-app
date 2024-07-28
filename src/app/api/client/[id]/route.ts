import { db } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authUtil';

export const GET = withAuth(async (request: NextRequest, userId: string) => {
    try{
        const clients = await db.client.findMany({
            where: {
                userId: userId
            }
        })

        return NextResponse.json(clients, {status: 200})
    }
    catch(error){
        return NextResponse.json({error}, {status: 500})
    }
})
