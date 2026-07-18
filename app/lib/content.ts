import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import path from "path";

const PAGES = path.join(process.cwd(), "content", "pages");
const MANIFEST = path.join(process.cwd(), "content", "manifest.json");

export type Meta = {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogSiteName: string;
  ogImage: string;
  twitterCard: string;
  noindex: boolean;
};

const EMPTY: Meta = {
  title: "",
  description: "",
  keywords: "",
  canonical: "",
  ogType: "website",
  ogTitle: "",
  ogDescription: "",
  ogUrl: "",
  ogSiteName: "不用品回収なら大阪のアストラ",
  ogImage: "",
  twitterCard: "summary",
  noindex: false,
};

const manifest: Record<string, Partial<Meta>> = JSON.parse(
  readFileSync(MANIFEST, "utf-8"),
);

export function metaOf(rel: string): Meta {
  return { ...EMPTY, ...(manifest[rel] ?? {}) };
}

/** slug配列 → content/pages 配下の相対キー。無ければ null
 *  URLのパスセグメントはpercent-encodedのまま渡ってくる（例: 未分類 → %E6%9C%AA...）ためデコードする */
function relFromSlug(slug: string[]): string | null {
  const joined = slug.map((s) => decodeURIComponent(s)).join("/");
  if (joined.endsWith(".html") && existsSync(path.join(PAGES, joined))) {
    return joined;
  }
  const asIndex = path.join(joined, "index.html");
  if (existsSync(path.join(PAGES, asIndex))) return asIndex;
  return null;
}

export function getPage(slug: string[]): { body: string; meta: Meta } | null {
  const rel = relFromSlug(slug);
  if (!rel) return null;
  const body = readFileSync(path.join(PAGES, rel), "utf-8");
  return { body, meta: metaOf(rel) };
}

/** ルート直下の index.html(=トップ) を除く全ページの slug 配列 */
export function allSlugs(): string[][] {
  const out: string[][] = [];
  const walk = (dir: string, parts: string[]) => {
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) {
        walk(p, [...parts, name]);
      } else if (name.endsWith(".html")) {
        if (name === "index.html") {
          if (parts.length) out.push(parts);
        } else {
          out.push([...parts, name]);
        }
      }
    }
  };
  walk(PAGES, []);
  return out;
}

/** manifestの全キー（sitemap用）。noindexページを除き、相対キー → URLパスに変換して返す */
export function allUrlPaths(): string[] {
  return Object.keys(manifest)
    .filter((rel) => !manifest[rel]?.noindex)
    .map((rel) => {
      if (rel === "index.html") return "/";
      if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"/index.html".length);
      return "/" + rel; // 例 blog/3207.html
    });
}
