import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Public routes — everything else is protected by default.
 *
 * Defined from Clerk's canonical sign-in / sign-up URL env vars so the public
 * surface always tracks wherever the auth pages actually live. The trailing
 * `(.*)` keeps Clerk's own sub-paths public too (factor steps, SSO callbacks).
 */
const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

const isPublicRoute = createRouteMatcher([`${signInUrl}(.*)`, `${signUpUrl}(.*)`]);

/**
 * Next.js 16 Proxy (formerly Middleware). Runs Clerk on every matched request
 * and protects anything that is not an explicitly public auth route.
 */
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
