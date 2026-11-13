"use client";

import { useAuth } from "../provider";
import Link from "next/link";

/**
 * Placeholder organization switcher for better-auth.
 * The real multi-org feature ships with the teams/organization
 * work (see dashboard brief). Until then this shows the signed-in
 * user's email as the "organization" label and links to the app
 * root after selection.
 */
export const OrganizationSwitcher = ({
  afterSelectOrganizationUrl = "/",
}: {
  afterSelectOrganizationUrl?: string;
}) => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-pulse rounded-full bg-muted" />
        <span className="h-3 flex-1 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  const label = user?.email ?? "Sign in";
  const href = user ? afterSelectOrganizationUrl : "/sign-in";

  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-medium">
        {label[0]?.toUpperCase() ?? "?"}
      </span>
      <span className="truncate font-medium">{label}</span>
    </Link>
  );
};
