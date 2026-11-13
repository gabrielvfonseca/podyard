import { loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";

const docs = defineDocs({
  dir: "src/content/docs",
  meta: {
    files: ["src/content/docs/meta.json"],
  },
});

const api = defineDocs({
  dir: "src/content/api",
  meta: {
    files: ["src/content/api/meta.json"],
  },
});

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});

export const apiSource = loader({
  baseUrl: "/api",
  source: api.toFumadocsSource(),
});
