"use client";

import { createContext, useContext, type ReactNode } from "react";
import { signOut, useSession } from "./client";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
};

type SessionData = {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
};

interface AuthContextValue {
  /** Current session, or null when signed out. */
  data: SessionData | null;
  user: SessionUser | null;
  isPending: boolean;
  error: unknown;
  signOut: () => Promise<unknown>;
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
