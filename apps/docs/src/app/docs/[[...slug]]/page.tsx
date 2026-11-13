import { notFound } from "next/navigation";
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

  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }

  return <PageContent url={page.url} data={page.data} />;
}
