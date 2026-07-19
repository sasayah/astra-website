import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StaticHtml from "@/app/components/StaticHtml";
import RunInlineScripts from "@/app/components/RunInlineScripts";
import AreaSeoSections from "@/app/components/AreaSeoSections";
import { getPage, allSlugs } from "@/app/lib/content";
import { toMetadata } from "@/app/lib/metadata";

// 事前生成した静的パスのみ許可（未知パスは404）
export const dynamicParams = false;

export function generateStaticParams(): { slug: string[] }[] {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return toMetadata(page.meta);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();
  // 地域ページ（kansai-huyouhin/{市区町村}）にはSEO強化セクションを追記する
  const areaCity =
    slug[0] === "kansai-huyouhin" && slug.length === 2
      ? page.meta.title.match(/^(.+?)の不用品回収/)?.[1]
      : undefined;
  return (
    <>
      <StaticHtml html={page.body} />
      {areaCity ? (
        <AreaSeoSections
          city={areaCity}
          slug={slug[1]}
          pathname={`/kansai-huyouhin/${slug[1]}`}
        />
      ) : null}
      <RunInlineScripts />
    </>
  );
}
