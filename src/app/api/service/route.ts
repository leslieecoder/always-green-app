import { db } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authUtil';

export const GET = withAuth(async (request: NextRequest, clientId: string) => {
    try{
        const clients = await db.service.findMany({
            where: {
                clientId: clientId
            }
        })

        return NextResponse.json(clients, {status: 200})
    }
    catch(error){
        return NextResponse.json({error}, {status: 500})
    }
})

// create new client
export const POST = withAuth(async (request: NextRequest) => {
    try{
        const data = await request.json()
        const newClient = await db.service.create({
            data: {
                ...data
            }
        })

        return NextResponse.json(newClient, {status: 201})
    }
    catch(error){
        return NextResponse.json({error}, {status: 500})
    }
})