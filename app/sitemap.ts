import type { MetadataRoute } from "next";
import { allUrlPaths } from "./lib/content";
import { SITE_URL } from "./lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allUrlPaths().map((p) => {
    const isTop = p === "/";
    const isSection =
      /^\/(service|huyouhin|ihinseiri|company|contact|faq|blog|voice|news|kansai-huyouhin)$/.test(p);
    return {
      url: SITE_URL + p,
      changeFrequency: p.startsWith("/blog") ? "weekly" : "monthly",
      priority: isTop ? 1.0 : isSection ? 0.8 : 0.6,
    };
  });
}
