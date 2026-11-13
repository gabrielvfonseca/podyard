import { createAuthClient } from "better-auth/react";

/**
 * Browser-side auth client. Point it at the Hono API (apps/api) that
 * hosts the better-auth routes at /api/auth/*.
 *
 * baseURL resolution:
 *  - Next.js: NEXT_PUBLIC_API_URL (e.g. http://localhost:3002)
 *  - Fallback: same origin (works when the API is co-hosted)
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3002"),
});

// The untyped client resolves plugin routes lazily, so expose the
// commonly-used actions with loose types rather than relying on
// InferClientAPI to enumerate them.
const client = authClient as unknown as {
  signInEmail: (body: {
    email: string;
    password: string;
  }) => Promise<unknown>;
  signUpEmail: (body: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<unknown>;
  signOut: () => Promise<unknown>;
  useSession: () => {
    data:
      | {
          user: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
            image?: string | null;
          };
          session: {
            id: string;
            userId: string;
            token: string;
            expiresAt: Date;
          };
        }
      | null;
    isPending: boolean;
    error: unknown;
    refetch: () => Promise<void>;
  };
};

export const { signInEmail, signUpEmail, signOut, useSession } = client;

// Client-side UI components (render under an AuthProvider).
export { UserButton } from "./components/user-button";
export { OrganizationSwitcher } from "./components/organization-switcher";
