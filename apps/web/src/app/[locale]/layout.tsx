import "./styles.css";
import { AnalyticsProvider } from "@podyard/analytics/provider";
import { AuthProvider } from "@podyard/auth/provider";
import { DesignSystemProvider } from "@podyard/design-system";
import { fonts } from "@podyard/design-system/lib/fonts";
import { cn } from "@podyard/design-system/lib/utils";
import { Toolbar } from "@podyard/feature-flags/components/toolbar";
import { getDictionary } from "@podyard/internationalization";
import type { ReactNode } from "react";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <AuthProvider>
              <Header dictionary={dictionary} />
              {children}
              <Footer />
            </AuthProvider>
          </DesignSystemProvider>
          <Toolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
