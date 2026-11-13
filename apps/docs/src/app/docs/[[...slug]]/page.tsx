import { notFound, redirect } from "next/navigation";
import { PageContent } from "@/components/docs-page";
import { source } from "@/source";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.url.slice(1).split("/"),
  }));
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;

  // The optional catch-all also matches the bare "/docs" index (slug === undefined),
  // which previously had its own static page.tsx redirecting to the introduction.
  if (!slug) {
    redirect("/docs/introduction");
  }

  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }

  return <PageContent data={page.data} url={page.url} />;
}
