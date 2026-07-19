import { getPayload } from "payload";
import config from "@payload-config";

/**
 * ブログのDBアクセス（Payload Local API）。
 * ブログ配信ルートは force-dynamic（ビルド時にDBへ接続しない）前提。
 * 記事URLは旧サイト互換の /blog/{slug}.html を維持する。
 */

export type PostDoc = {
  id: string | number;
  title: string;
  slug?: string | null;
  publishedAt?: string | null;
  category?: string | null;
  content?: unknown;
  bodyHtml?: string | null;
  legacyUrl?: string | null;
};

export async function db() {
  return getPayload({ config });
}

export async function listPosts(page = 1, limit = 20) {
  const payload = await db();
  return payload.find({
    collection: "posts",
    where: {
      status: { equals: "published" },
      category: { not_equals: "未分類" },
    },
    sort: "-publishedAt",
    page,
    limit,
  });
}

export async function postBySlug(slug: string): Promise<PostDoc | null> {
  const payload = await db();
  const res = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
  });
  return (res.docs[0] as PostDoc | undefined) ?? null;
}

/** 前後の記事（publishedAt順）。無ければnull */
export async function adjacentPosts(post: PostDoc): Promise<{
  prev: PostDoc | null;
  next: PostDoc | null;
}> {
  if (!post.publishedAt) return { prev: null, next: null };
  const payload = await db();
  const base = {
    status: { equals: "published" as const },
    category: { not_equals: "未分類" },
  };
  const [prev, next] = await Promise.all([
    payload.find({
      collection: "posts",
      where: { ...base, publishedAt: { less_than: post.publishedAt } },
      sort: "-publishedAt",
      limit: 1,
    }),
    payload.find({
      collection: "posts",
      where: { ...base, publishedAt: { greater_than: post.publishedAt } },
      sort: "publishedAt",
      limit: 1,
    }),
  ]);
  return {
    prev: (prev.docs[0] as PostDoc | undefined) ?? null,
    next: (next.docs[0] as PostDoc | undefined) ?? null,
  };
}

/** richtext(Lexical JSON)からプレーンテキストを抽出（抜粋用） */
function lexicalText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; children?: unknown[]; root?: unknown };
  if (n.root) return lexicalText(n.root);
  let out = typeof n.text === "string" ? n.text : "";
  for (const c of n.children ?? []) out += lexicalText(c);
  return out;
}

/** 一覧の抜粋テキスト */
export function excerptOf(post: PostDoc, length = 40): string {
  let text = "";
  if (post.content) text = lexicalText(post.content);
  if (!text && post.bodyHtml) {
    text = post.bodyHtml
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // 見出し（タイトル・日付）部分を飛ばして本文から抜く
    const i = text.search(/20\d{2}年\s*\d{1,2}月\s*\d{1,2}日/);
    if (i >= 0) {
      text = text
        .slice(i)
        .replace(/^20\d{2}年\s*\d{1,2}月\s*\d{1,2}日\s*(20\d{2}年\s*\d{1,2}月\s*\d{1,2}日)?\s*/, "");
    }
  }
  text = text.replace(/^ブログ\s*/, "").trim();
  return text.length > length ? text.slice(0, length) + "…" : text;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}年${p(d.getMonth() + 1)}月${p(d.getDate())}日`;
}

/** 30日以内の記事にNEWバッジ */
export function isNew(iso?: string | null): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  return !isNaN(t) && Date.now() - t < 30 * 24 * 60 * 60 * 1000;
}
