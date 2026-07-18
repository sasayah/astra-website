import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LpTemplate from "@/app/components/lp/LpTemplate";
import {
  LP_CITIES,
  LP_ITEMS,
  findCity,
  findItem,
  withCity,
  type LpCity,
  type LpItem,
} from "@/app/lib/lp-data";
import "../lp.css";

/**
 * Yahoo検索広告用LP。/lp/{item}/ と /lp/{item}/{city}/ を全てSSG。
 * 広告専用のため noindex（sitemapにも含まれない: sitemapはmanifest由来のみ）。
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string[] }[] {
  const params: { slug: string[] }[] = [];
  for (const item of LP_ITEMS) {
    params.push({ slug: [item.slug] });
    for (const city of LP_CITIES) {
      params.push({ slug: [item.slug, city.slug] });
    }
  }
  return params;
}

function resolve(slug: string[]): { item: LpItem; city?: LpCity } | null {
  const item = findItem(slug[0]);
  if (!item) return null;
  if (slug.length === 1) return { item };
  if (slug.length !== 2) return null;
  const city = findCity(slug[1]);
  if (!city) return null;
  return { item, city };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolve(slug);
  if (!resolved) return {};
  const { item, city } = resolved;
  const title = withCity(item.title, city);
  const description = withCity(item.lead, city).slice(0, 120);
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "不用品回収なら大阪のアストラ",
      locale: "ja_JP",
    },
  };
}

export default async function LpPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const resolved = resolve(slug);
  if (!resolved) notFound();
  return <LpTemplate item={resolved.item} city={resolved.city} />;
}
