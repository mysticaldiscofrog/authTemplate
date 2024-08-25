import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if the request is for the dashboard or any of its sub-routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // If there's no token, redirect to the login page
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If there's a token, check if the user is trying to access their own dashboard
    const userId = token.sub; // Assuming the user ID is stored in the 'sub' claim
    const requestedUserId = request.nextUrl.pathname.split('/')[2]; // Get the user ID from the URL

    if (userId !== requestedUserId) {
      // If the user is trying to access someone else's dashboard, redirect to their own
      return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
    }
  }

  // For all other routes, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
