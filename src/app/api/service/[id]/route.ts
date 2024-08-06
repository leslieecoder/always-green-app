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
    return NextResponse.json({ error: "clientId is required" }, { status: 400 });
  }
  try{
    const services = await db.service.findMany({
        where: {
            id: id
        }
    })

    return NextResponse.json({
      services,
      totalServices: services.reduce((acc, service) => acc + service.total, 0)
    }, {status: 200})
  }
  catch(error){
      return NextResponse.json({error}, {status: 500})
  }
})

//Delete service
export const DELETE = withAuth(async (
  request: NextRequest,
  userId: string,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Id is required" }, { status: 400 });
  }
  try{
    const service = await db.service.delete({
        where: {
            id: id
        }
    })

    return NextResponse.json({
      service
    }, {status: 200})
  }
  catch(error){
      return NextResponse.json({error}, {status: 500})
  }
})