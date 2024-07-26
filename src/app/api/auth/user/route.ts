import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { db } from '@/lib/db'; 

function decodeToken(token: string): { userId: string } | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export async function GET(req: NextRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.get('cookie') || '');
  const token = cookies.session;
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const decodedToken = decodeToken(token);
  
  console.log(decodedToken)
  if (!decodedToken || !decodedToken.userId) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
  
  try {
    // Fetch user data based on decoded token (userId)
    const user = await db.user.findFirstOrThrow({
      where: { id: decodedToken.userId },
      select: { id: true, email: true, firstName: true } 
    });
    console.log(user)
    return Response.json({success:"User found", user}, { status: 200 })

  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error instanceof Error && error.name === 'NotFoundError') {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}