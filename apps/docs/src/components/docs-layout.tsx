import type { Root } from "fumadocs-core/page-tree";
import { DocsLayout as FumadocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/shared";

export function DocsLayout({
  tree,
  children,
}: {
  tree: Root;
  children: React.ReactNode;
}) {
  return (
    <FumadocsLayout {...baseOptions()} tree={tree}>
      {children}
    </FumadocsLayout>
  );
}
