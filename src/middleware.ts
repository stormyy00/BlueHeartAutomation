import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { User } from "shared";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    try {
      await auth.protect();
    } catch {
      const url = new URL("/login", req.url);
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
        },
      });
    }
  }
  const path = req.nextUrl.pathname;

  const clerk = await clerkClient();
  const user = await clerk.users.getUser((await auth()).userId!);
  const metadata = user.publicMetadata as User;
  if (!metadata.orgId || metadata.orgId === "") {
    return NextResponse.redirect(new URL("/user", req.url));
  }
  if (path === "/orgs" || path.startsWith("/orgs/@mine")) {
    return NextResponse.redirect(
      new URL(path.replace("@mine", metadata.orgId), req.url),
    );
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
