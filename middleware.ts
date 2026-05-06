import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require authentication. Checked BEFORE public matchers so that
// e.g. /recipes/new isn't accidentally treated as public via /recipes.
const isProtectedRoute = createRouteMatcher([
  '/recipes/new',
  '/recipes/:id/edit',
  '/meal-plans(.*)',
  '/shopping-list(.*)',
  '/seed',
]);

// Routes that are completely public (no auth required)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/recipes',
  '/recipes/:id', // recipe detail (single segment)
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
    return;
  }

  if (isPublicRoute(request)) {
    return;
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (request.method !== 'GET') {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
