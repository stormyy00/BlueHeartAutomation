import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const headers = req.headers;
  const path = req.nextUrl.pathname;
  headers.set("x-url", path);
  return NextResponse.next({
    request: {
      headers: headers,
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
