import { notFound } from "next/navigation";
import { PageContent } from "@/components/docs-page";
import { apiSource } from "@/source";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return apiSource.getPages().map((page) => ({
    slug: page.url.slice(1).split("/"),
  }));
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;

  const page = apiSource.getPage(slug);
  if (!page) {
    notFound();
  }

  return <PageContent data={page.data} url={page.url} />;
}
