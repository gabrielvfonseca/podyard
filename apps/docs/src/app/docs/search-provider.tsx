"use client";

import DefaultSearchDialog from "fumadocs-ui/components/dialog/search-default";
import { SearchProvider } from "fumadocs-ui/contexts/search";

export function DocsSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider
      SearchDialog={DefaultSearchDialog}
      options={{ api: "/api/search" }}
    >
      {children}
    </SearchProvider>
  );
}
