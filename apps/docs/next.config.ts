import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

// Turbopack (Next 16) rejects the `query` condition that fumadocs-mdx/next
// emits for its meta-loader rules (`*.json`, `*.yaml`, `*.{js,ts}`). Those
// rules only fire when a meta file is imported *directly* as a module, which
// `defineDocs()` / `toFumadocsSource()` never does — they read the files
// themselves at build time. Drop any rule whose condition relies on `query`.
function dropQueryRules(rules: Record<string, unknown>): void {
  for (const key of Object.keys(rules)) {
    const rule = rules[key] as {
      condition?: { query?: unknown; all?: unknown[] };
    };
    const cond = rule?.condition;
    const hasQuery =
      cond &&
      (cond.query !== undefined ||
        (Array.isArray(cond.all) &&
          cond.all.some(
            (c) => c !== null && typeof c === "object" && "query" in c
          )));
    if (hasQuery) {
      delete rules[key];
    }
  }
}

async function buildConfig(): Promise<NextConfig> {
  const cfg = await createMDX()(nextConfig);
  const rules = cfg.turbopack?.rules as Record<string, unknown> | undefined;
  if (rules) {
    dropQueryRules(rules);
  }
  return cfg;
}

export default buildConfig();
