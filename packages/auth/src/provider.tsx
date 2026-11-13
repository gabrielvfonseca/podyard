"use client";

import { createContext, type ReactNode, useContext } from "react";
import { signOut, useSession } from "./client";

interface SessionUser {
  email: string;
  emailVerified: boolean;
  id: string;
  image?: string | null;
  name: string;
}

interface SessionData {
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
  user: SessionUser;
}

interface AuthContextValue {
  /** Current session, or null when signed out. */
  data: SessionData | null;
  error: unknown;
  isPending: boolean;
  signOut: () => Promise<unknown>;
  user: SessionUser | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isPending, error } = useSession();

  return (
    <AuthContext.Provider
      value={{
        data,
        user: data?.user ?? null,
        isPending,
        error,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for consuming the auth context from anywhere under an AuthProvider.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
