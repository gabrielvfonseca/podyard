import { env } from "@/env";
import "./styles.css";
import { AnalyticsProvider } from "@podyard/analytics/provider";
import { DesignSystemProvider } from "@podyard/design-system";
import { fonts } from "@podyard/design-system/lib/fonts";
import { Toolbar } from "@podyard/feature-flags/components/toolbar";
import type { ReactNode } from "react";

interface RootLayoutProperties {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <AnalyticsProvider>
        <DesignSystemProvider
          helpUrl={env.NEXT_PUBLIC_DOCS_URL}
          privacyUrl={new URL(
            "/legal/privacy",
            env.NEXT_PUBLIC_WEB_URL
          ).toString()}
          termsUrl={new URL("/legal/terms", env.NEXT_PUBLIC_WEB_URL).toString()}
        >
          {children}
        </DesignSystemProvider>
      </AnalyticsProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
