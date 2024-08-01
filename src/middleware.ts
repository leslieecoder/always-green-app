import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// List of public routes
const publicRoutes = ['/auth/signin', '/auth/signup', '/about', '/contact'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Parse cookies
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.session;

  // Check if token exists
  if (!token) {
    console.log('No token found, redirecting to sign-in.');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying token:', error);
    // Redirect if token is invalid or expired
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('session');
    return response;
  }
}

// Apply middleware to all routes except public ones
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};