import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that are completely public (no auth required)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/dashboard',
  '/recipes/(.*)', // All recipe pages
]);

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/recipes/new',
  '/recipes/(.*)/edit',
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes without any auth check
  if (isPublicRoute(request)) {
    return;
  }
  
  // Protect specific routes that require authentication
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
  
  // For API routes, only protect non-GET requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (request.method !== 'GET') {
      await auth.protect();
    }
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};