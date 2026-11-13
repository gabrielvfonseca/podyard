import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-bold text-4xl tracking-tight">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Link className="text-sm underline underline-offset-4" href="/docs">
        Back to docs
      </Link>
    </main>
  );
}
