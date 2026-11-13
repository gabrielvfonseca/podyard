"use client";

import { Button } from "@podyard/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@podyard/design-system/components/ui/dropdown-menu";
import { signOut } from "../client";
import { useAuth } from "../provider";

/**
 * Better-auth user menu. Better Auth user menu.
 * Render inside a SidebarMenuItem or similar container.
 */
export const UserButton = ({ showName = true }: { showName?: boolean }) => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <span className="h-4 w-4 animate-pulse rounded-full bg-muted" />
        <span className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button asChild size="sm" variant="outline">
        <a href="/sign-in">Sign in</a>
      </Button>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-2 rounded-md p-1.5 text-sm transition-colors hover:bg-muted"
          type="button"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
            {initial}
          </span>
          {showName && (
            <span className="truncate text-muted-foreground">{user.name}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" side="top">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-medium text-sm">{user.name}</span>
          <span className="truncate text-muted-foreground text-xs">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
