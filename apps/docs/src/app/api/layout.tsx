import { ApiLayout } from "@/components/api-layout";
import { apiSource } from "@/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ApiLayout tree={apiSource.getPageTree()}>{children}</ApiLayout>;
}
