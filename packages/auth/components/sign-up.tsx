"use client";

import { Button } from "@podyard/design-system/components/ui/button";
import { Input } from "@podyard/design-system/components/ui/input";
import { Label } from "@podyard/design-system/components/ui/label";
import { signUpEmail } from "@podyard/auth/client";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

/**
 * Minimal email/password sign-up form backed by better-auth.
 */
export const SignUp = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      await signUpEmail({ name, email, password });
    } catch (err) {
      setPending(false);
      setError(
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "Sign up failed",
      );
      return;
    }
    setPending(false);

    router.push(pathname === "/sign-up" ? "/" : pathname);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <a className="underline" href="/sign-in">
          Sign in
        </a>
      </p>
    </div>
  );
};
