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
      options={{ api: "/api/search" }}
      SearchDialog={DefaultSearchDialog}
    >
      {children}
    </SearchProvider>
  );
}
