/**
 * Shared layout options for the Podyard docs site.
 */
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Podyard",
    },
    links: [
      {
        type: "main",
        text: "Docs",
        url: "/docs",
      },
      {
        type: "main",
        text: "API",
        url: "/api",
      },
    ],
  };
}
