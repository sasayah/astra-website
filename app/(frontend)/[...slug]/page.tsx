import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StaticHtml from "@/app/components/StaticHtml";
import RunInlineScripts from "@/app/components/RunInlineScripts";
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
  return (
    <>
      <StaticHtml html={page.body} />
      <RunInlineScripts />
    </>
  );
}
