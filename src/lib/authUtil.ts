import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { db } from "@/lib/db";

interface DecodedToken {
  userId: string;
}

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function authenticateAndAuthorize(request: NextRequest, resourceId?: string) {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.session;

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    
    if (resourceId && request.nextUrl.pathname.startsWith('/api/client/')) {
      const transaction = await db.client.findFirst({
        where: { id: resourceId, userId: decoded.userId },
      });

      if (!transaction) {
        return { error: "Forbidden", status: 403 };
      }
    }

    return { userId: decoded.userId };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { error: "Unauthorized", status: 401 };
  }
}

export function withAuth(handler: (req: NextRequest, userId: string, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]) => {
    const resourceId = req.nextUrl.pathname.split('/').pop();
    const authResult = await authenticateAndAuthorize(req, resourceId);

    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    return handler(req, authResult.userId, ...args);
  };
}