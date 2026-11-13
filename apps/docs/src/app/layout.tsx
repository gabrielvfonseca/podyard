import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Podyard Documentation",
    template: "%s | Podyard",
  },
  description: "Documentation for the Podyard platform.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html suppressHydrationWarning>
    <body className="min-h-dvh bg-white text-neutral-950 dark:bg-black dark:text-neutral-50">
      <RootProvider>{children}</RootProvider>
    </body>
  </html>
);

export default RootLayout;
