import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import citySlugs from "./content/area-city-slugs.json";

/**
 * 地域ページのスラッグ表記ゆれを正規URLへ301する。
 * 旧サイト由来のリンクに「Daitoshi」「Yamazoe Mura」等の大文字・スペース混じりが
 * 大量に存在し、本番(Linux)ではファイルシステムが大文字小文字を区別して404になる。
 * ソースHTML側は一括修正済みだが、外部リンク・ブックマーク・検索結果の受け皿として残す。
 */
const canonical = new Map<string, string>();
for (const slug of citySlugs as string[]) {
  canonical.set(normalize(slug), slug);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_-]/g, "");
}

export function proxy(request: NextRequest) {
  const seg = request.nextUrl.pathname.split("/")[2] ?? "";
  let decoded: string;
  try {
    decoded = decodeURIComponent(seg);
  } catch {
    return NextResponse.next();
  }
  const target = canonical.get(normalize(decoded));
  if (target && target !== decoded) {
    const url = request.nextUrl.clone();
    url.pathname = `/kansai-huyouhin/${target}`;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/kansai-huyouhin/:slug",
};
