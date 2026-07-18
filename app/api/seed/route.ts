import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import path from "path";

export const maxDuration = 300;

const PAGES = path.join(process.cwd(), "content", "pages");
const MANIFEST = path.join(process.cwd(), "content", "manifest.json");

function manifest(): Record<string, { title?: string }> {
  return JSON.parse(readFileSync(MANIFEST, "utf-8"));
}

/** 記事本文から全ページ共通ブロック（追従CTA/見積フォーム/LINEモーダル）以降を除去 */
function stripCommon(html: string): string {
  let cut = html.length;
  for (const m of ["footer-cta", "id=\"form-start\"", "class=\"lm_modal\"", "custom_form_submitted"]) {
    const i = html.indexOf(m);
    if (i >= 0) {
      const divStart = html.lastIndexOf("<div", i);
      cut = Math.min(cut, divStart >= 0 ? divStart : i);
    }
  }
  return html.slice(0, cut).trim();
}

/** 本文HTMLから公開日らしき日付を抽出（YYYY.M.D / YYYY/M/D / YYYY年M月D日） */
function extractDate(html: string): string | null {
  const m = html.match(/(20\d{2})[./年](\d{1,2})[./月](\d{1,2})/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00.000Z`;
  return isNaN(Date.parse(iso)) ? null : iso;
}

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (token !== (process.env.SEED_TOKEN || "astra-seed-2026")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const man = manifest();
  const result = {
    adminCreated: false,
    posts: 0,
    voice: 0,
    skipped: 0,
    errors: [] as Array<{ legacyUrl: string; message?: string; detail?: unknown }>,
  };

  // 1) 管理者ユーザー（未作成時のみ）
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@pe-astra.com",
        password: "astra-admin-2026",
        name: "管理者",
        role: "admin",
      },
    });
    result.adminCreated = true;
  }

  const upsert = async (
    collection: "posts" | "voice",
    legacyUrl: string,
    data: Record<string, unknown>,
  ) => {
    const found = await payload.find({
      collection,
      where: { legacyUrl: { equals: legacyUrl } },
      limit: 1,
    });
    if (found.totalDocs > 0) {
      result.skipped++;
      return;
    }
    try {
      await payload.create({ collection, data: { ...data, legacyUrl } });
      if (collection === "posts") result.posts++;
      else result.voice++;
    } catch (e: unknown) {
      const err = e as { data?: { errors?: unknown }; message?: string };
      if (result.errors.length < 3) {
        result.errors.push({
          legacyUrl,
          message: err.message,
          detail: err.data?.errors,
        });
      }
    }
  };

  // 2) ブログ記事（blog/ と 未分類/）
  for (const dir of ["blog", "未分類"]) {
    const abs = path.join(PAGES, dir);
    if (!existsSync(abs)) continue;
    for (const fn of readdirSync(abs)) {
      if (!fn.endsWith(".html") || fn === "index.html") continue;
      const rel = `${dir}/${fn}`;
      const body = readFileSync(path.join(abs, fn), "utf-8");
      await upsert("posts", `/${rel}`, {
        title: man[rel]?.title?.split(" | ")[0] || fn.replace(".html", ""),
        slug: fn.replace(".html", ""),
        category: dir === "blog" ? "ブログ" : "未分類",
        publishedAt: extractDate(body),
        status: "published",
        bodyHtml: stripCommon(body),
      });
    }
  }

  // 3) お客様の声（voice/{pref}/{city}/index.html）
  const voiceRoot = path.join(PAGES, "voice");
  if (existsSync(voiceRoot)) {
    for (const pref of readdirSync(voiceRoot)) {
      const prefAbs = path.join(voiceRoot, pref);
      if (!existsSync(path.join(prefAbs, "index.html")) && !isDir(prefAbs)) continue;
      if (!isDir(prefAbs)) continue;
      for (const city of readdirSync(prefAbs)) {
        const cityIdx = path.join(prefAbs, city, "index.html");
        if (!existsSync(cityIdx)) continue;
        const rel = `voice/${pref}/${city}/index.html`;
        const body = readFileSync(cityIdx, "utf-8");
        await upsert("voice", `/voice/${pref}/${city}`, {
          title: man[rel]?.title?.split(" | ")[0] || city,
          prefecture: pref,
          city,
          bodyHtml: stripCommon(body),
        });
      }
    }
  }

  return NextResponse.json({ ok: true, ...result });
}

function isDir(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}
