import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

const protectedRoutes = ["/user", "/orgs"];
const authRoutes = ["/signin", "/signup"];

export const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  const requestHeaders = req.headers;
  requestHeaders.set("x-url", path);

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute) {
    const { data: session } = await betterFetch<{
      user: { id: string; email: string };
      session: { activeOrganizationId?: string };
    }>("/api/auth/get-session", {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!session) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(signInUrl);
    }

    if (path === "/user" && session?.session?.activeOrganizationId) {
      try {
        const { data: orgsData } = await betterFetch<{
          data: Array<{ id: string; name: string; role: string }>;
        }>("/api/organizations", {
          baseURL: req.nextUrl.origin,
          headers: {
            cookie: req.headers.get("cookie") || "",
          },
        });

        if (orgsData && Array.isArray(orgsData) && orgsData.length > 0) {
          // Find the active organization
          const activeOrg = orgsData.find(
            (org) => org.id === session.session.activeOrganizationId,
          );

          if (activeOrg) {
            const orgSlug = activeOrg.name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");

            return NextResponse.redirect(new URL(`/user/${orgSlug}`, req.url));
          }
        }
      } catch (error) {
        console.error("Middleware: Error fetching organizations:", error);
      }
    }
  }

  if (isAuthRoute) {
    const { data: session } = await betterFetch("/api/auth/get-session", {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (session) {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
