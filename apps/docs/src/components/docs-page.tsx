import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { MDXContent } from "mdx/types";
import { getMDXComponents } from "@/components/mdx";

interface PageContentProps {
  data: {
    body: MDXContent;
    title?: string;
    description?: string;
    icon?: string;
  };
  url: string;
}

export function PageContent({ url, data }: PageContentProps) {
  return (
    <DocsPage full={!data.icon}>
      <DocsTitle>{data.title ?? url}</DocsTitle>
      {data.description && (
        <DocsDescription>{data.description}</DocsDescription>
      )}
      <DocsBody>
        <data.body components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
