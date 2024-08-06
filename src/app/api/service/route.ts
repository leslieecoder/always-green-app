import { db } from '../../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authUtil';

export const GET = withAuth(async (request: NextRequest) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId is required" }, { status: 400 });
  }
  try{
      const services = await db.service.findMany({
          where: {
              clientId: clientId
          }
      })

      return NextResponse.json({
        services,
        totalServices: services.reduce((acc, service) => acc + service.total, 0),
        totalDue: services.reduce((acc, service) => acc + service.total - service.deposit, 0),
        totalDeposit: services.reduce((acc, service) => acc + service.deposit, 0)
      }, {status: 200})
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