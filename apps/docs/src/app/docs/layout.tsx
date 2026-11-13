import { DocsLayout } from "@/components/docs-layout";
import { source } from "@/source";

export default function Layout(props: { children: React.ReactNode }) {
  const tree = source.getPageTree();
  return <DocsLayout tree={tree} {...props} />;
}
