import type { MetadataRoute } from "next";
import { allUrlPaths } from "./lib/content";
import { SITE_URL } from "./lib/metadata";
import { db } from "./lib/blog";

/** 静的ページ（manifest由来）+ ブログ（Payload DB由来）を統合したsitemap。
 *  DBの更新を反映するためランタイム生成（ビルド時にDBへ接続しない） */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = allUrlPaths().map((p) => {
    const isTop = p === "/";
    const isSection =
      /^\/(service|huyouhin|ihinseiri|company|contact|faq|voice|news|kansai-huyouhin)$/.test(p);
    return {
      // 日本語パス(未分類/等)はRFC3986準拠のためpercent-encodeして出力
      url: SITE_URL + encodeURI(p),
      changeFrequency: "monthly",
      priority: isTop ? 1.0 : isSection ? 0.8 : 0.6,
    };
  });

  // ブログ: 一覧 + 公開記事（DB接続に失敗しても静的分は返す）
  const blogUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];
  try {
    const payload = await db();
    const posts = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" }, category: { not_equals: "未分類" } },
      limit: 1000,
      sort: "-publishedAt",
    });
    for (const doc of posts.docs as Array<{ slug?: string | null; publishedAt?: string | null }>) {
      if (!doc.slug) continue;
      blogUrls.push({
        url: `${SITE_URL}/blog/${doc.slug}.html`,
        lastModified: doc.publishedAt ?? undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // DB未接続時（初期セットアップ前など）は静的分のみ返す
  }

  return [...staticUrls, ...blogUrls];
}
