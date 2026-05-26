import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);
const isPublicWebhook = createRouteMatcher([
  "/api/webhooks/(.*)",
  "/api/stripe/webhook",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicWebhook(req)) return;
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
