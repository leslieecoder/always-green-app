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

// create new client
export const POST = withAuth(async (request: NextRequest, userId: string) => {
    try{
        const data = await request.json()
        const newClient = await db.client.create({
            data: {
                ...data,
                userId
            }
        })

        return NextResponse.json(newClient, {status: 201})
    }
    catch(error){
        return NextResponse.json({error}, {status: 500})
    }
})