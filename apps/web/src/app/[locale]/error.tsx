"use client";

import { Button } from "@podyard/design-system/components/ui/button";
import { fonts } from "@podyard/design-system/lib/fonts";
import { captureException } from "@sentry/nextjs";
import type NextError from "next/error";
import { useEffect } from "react";

interface RouteErrorProperties {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
}

/**
 * Route-level error boundary. Catches rendering and server-action errors for
 * the current route segment. The digest is a Sentry event ID when available.
 */
const RouteError = ({ error, reset }: RouteErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <main
      className={`flex min-h-svh flex-col items-center justify-center gap-6 ${fonts}`}
    >
      <h1 className="font-semibold text-2xl tracking-tight">
        Something went wrong
      </h1>
      <p className="max-w-sm text-center text-muted-foreground text-sm">
        An unexpected error occurred while loading this page. Your data is safe
        — please try again.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground text-xs">
          Reference: {error.digest}
        </p>
      ) : null}
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
};

export default RouteError;
