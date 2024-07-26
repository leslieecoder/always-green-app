'use server'
import { generateToken } from '@/lib/jwt';
import { cookies } from 'next/headers'

export async function handleLogin(sessionData: any): Promise<boolean> {
  try {
    const token = generateToken({ userId: sessionData.id });

    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });

    return true; // Return true to indicate successful login
  } catch (error) {
    console.error('Error during login:', error);
    return false; // Return false or handle error as needed
  }
}

export async function handleLogout(): Promise<boolean> {
  try {
    // Clear the session cookie by setting its expiry to a past date
    cookies().set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, // Set maxAge to -1 to delete the cookie
      path: '/',
    });
    return true; // Return true to indicate successful logout
  } catch (error) {
    console.error('Error during logout:', error);
    return false; // Return false or handle error as needed
  }
}