import { createAuthClient } from "better-auth/react";

/**
 * Browser-side auth client. Point it at the Hono API (apps/api) that
 * hosts the better-auth routes at /api/auth/*.
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3002"),
});

const client = authClient as unknown as {
  signInEmail: (body: { email: string; password: string }) => Promise<unknown>;
  signUpEmail: (body: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<unknown>;
  signOut: () => Promise<unknown>;
  useSession: () => {
    data: {
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
    } | null;
    isPending: boolean;
    error: unknown;
    refetch: () => Promise<void>;
  };
};

export const { signInEmail, signUpEmail, signOut, useSession } = client;
