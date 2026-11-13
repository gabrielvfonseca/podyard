"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { useAuth } from "../provider";
import { signOut } from "../client";

/**
 * Better-auth user menu. Replaces the Clerk `UserButton`.
 * Render inside a SidebarMenuItem or similar container.
 */
export const UserButton = ({
  showName = true,
}: {
  showName?: boolean;
}) => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-pulse rounded-full bg-muted" />
        <span className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
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
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {initial}
          </span>
          {showName && (
            <span className="truncate text-muted-foreground">{user.name}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-48">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate text-sm font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
