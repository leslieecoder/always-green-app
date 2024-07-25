import { db } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {

    try{
        const clients = await db.client.findMany({
            where: {
                id: "1234"
            }
        })

        return NextResponse.json(clients, {status: 200})
    }
    catch(error){
        return NextResponse.json({error}, {status: 500})
    }

}