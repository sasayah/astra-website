import type { Metadata } from "next";
import type { Meta } from "./content";

export const SITE_URL = "https://pe-astra.com";

/** manifestのメタ情報を Next の Metadata に変換（旧サイトのSEOを1:1で再現） */
export function toMetadata(meta: Meta): Metadata {
  const canonical = meta.canonical || meta.ogUrl || undefined;
  const ogImage = meta.ogImage || "/wp-content/uploads/2021/08/logo-1.jpeg";
  // 旧サイト(AIOSEO)は og:type に "activity"/"object" 等を出すが Next は限定値のみ許可
  const ogType = meta.ogType === "website" ? "website" : "article";
  return {
    title: meta.title || undefined,
    description: meta.description || undefined,
    keywords: meta.keywords || undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: meta.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: ogType,
      title: meta.ogTitle || meta.title || undefined,
      description: meta.ogDescription || meta.description || undefined,
      url: meta.ogUrl || canonical || undefined,
      siteName: meta.ogSiteName,
      images: [{ url: ogImage }],
      locale: "ja_JP",
    },
    twitter: {
      card: (meta.twitterCard as "summary" | "summary_large_image") || "summary",
      title: meta.ogTitle || meta.title || undefined,
      description: meta.ogDescription || meta.description || undefined,
      images: [ogImage],
    },
  };
}
