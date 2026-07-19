import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LpTemplate from "@/app/components/lp/LpTemplate";
import LpTemplateB from "@/app/components/lp/LpTemplateB";
import {
  LP_CITIES,
  LP_ITEMS,
  findCity,
  findItem,
  priceOf,
  withCity,
  type LpCity,
  type LpItem,
} from "@/app/lib/lp-data";
import "../lp.css";

/**
 * Yahoo検索広告用LP。/lp/{item}/ と /lp/{item}/{city}/ を全てSSG。
 * /lp/b/{item}/ は料金表特化のB案（広告ABテスト用）。
 * 広告専用のため noindex（sitemapにも含まれない: sitemapはmanifest由来のみ）。
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string[] }[] {
  const params: { slug: string[] }[] = [];
  for (const item of LP_ITEMS) {
    params.push({ slug: [item.slug] });
    params.push({ slug: ["b", item.slug] });
    for (const city of LP_CITIES) {
      params.push({ slug: [item.slug, city.slug] });
    }
  }
  return params;
}

function resolve(
  slug: string[],
): { item: LpItem; city?: LpCity; variant: "a" | "b" } | null {
  // B案: /lp/b/{item}
  if (slug[0] === "b") {
    if (slug.length !== 2) return null;
    const item = findItem(slug[1]);
    if (!item) return null;
    return { item, variant: "b" };
  }
  const item = findItem(slug[0]);
  if (!item) return null;
  if (slug.length === 1) return { item, variant: "a" };
  if (slug.length !== 2) return null;
  const city = findCity(slug[1]);
  if (!city) return null;
  return { item, city, variant: "a" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolve(slug);
  if (!resolved) return {};
  const { item, city, variant } = resolved;
  const price = variant === "b" ? priceOf(item.slug) : undefined;
  const title =
    variant === "b" && price
      ? `${withCity("{city}", city)}の${item.name}回収 ${price.price}｜追加料金0円・即日対応【アストラ】`
      : withCity(item.title, city);
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
  if (resolved.variant === "b") {
    return <LpTemplateB item={resolved.item} city={resolved.city} />;
  }
  return <LpTemplate item={resolved.item} city={resolved.city} />;
}
