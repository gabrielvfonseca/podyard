import { internationalizationMiddleware } from "@podyard/internationalization/proxy";
import {
  getRequestId,
  REQUEST_ID_HEADER,
  toPublicResponse,
} from "@podyard/observability";
import { secure } from "@podyard/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@podyard/security/proxy";
import { createNEMO } from "@rescale/nemo";
import type { NextFetchEvent, NextProxy, NextRequest } from "next/server";
import { env } from "@/env";

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Custom middleware for Arcjet security checks
const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) {
    return;
  }

  try {
    await secure(
      [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        "CATEGORY:SEARCH_ENGINE", // Allow search engines
        "CATEGORY:PREVIEW", // Allow preview links to show OG images
        "CATEGORY:MONITOR", // Allow uptime monitoring services
      ],
      request
    );
  } catch (error) {
    const response = toPublicResponse(error, request);
    response.headers.set(REQUEST_ID_HEADER, getRequestId(request));
    return response;
  }
};

// Compose middleware with Nemo
const composedMiddleware = createNEMO(
  {},
  {
    before: [internationalizationMiddleware, arcjetMiddleware],
  }
);

export default (async (request: NextRequest, event: NextFetchEvent) => {
  // Run security headers first
  const headersResponse = securityHeaders();

  // Then run composed middleware (i18n + arcjet)
  const middlewareResponse = await composedMiddleware(request, event);

  // Return middleware response if it exists, otherwise headers response
  return middlewareResponse || headersResponse;
}) as unknown as NextProxy;
