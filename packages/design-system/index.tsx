import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./providers/theme";

type DesignSystemProviderProperties = ThemeProviderProps & {
  /** Optional metadata URLs surfaced by the app shell. */
  helpUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
};

export const DesignSystemProvider = ({
  children,
  // helpUrl, privacyUrl, termsUrl are accepted for app-shell metadata
  // but are not forwarded to the theme provider today.
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
