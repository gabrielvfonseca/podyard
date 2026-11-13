import { auth } from "@podyard/auth/server";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@podyard/security/proxy";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "./env";

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Paths that require a valid better-auth session. Route groups like
// (authenticated) don't appear in URLs, so list the concrete paths the
// authenticated layout serves. Sign-in/up are intentionally excluded.
const PROTECTED_PATHS = ["/", "/search"];

const isProtected = (path: string) =>
  PROTECTED_PATHS.includes(path) ||
  PROTECTED_PATHS.some((p) => p !== "/" && path.startsWith(`${p}/`));

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtected(pathname)) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const signInUrl = new URL("/sign-in", request.nextUrl.origin);
      signInUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Run nosecone security headers for every request that reaches here.
  const response = await securityHeaders();
  return new NextResponse(response.body, response);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
