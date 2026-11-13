import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground">
        This page could not be found.
      </p>
      <Link href="/docs" className="text-sm underline underline-offset-4">
        Back to docs
      </Link>
    </main>
  );
}
