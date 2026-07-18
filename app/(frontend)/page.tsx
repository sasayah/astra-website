import type { Metadata } from "next";
import HomeInit from "@/app/components/HomeInit";
import StaticHtml from "@/app/components/StaticHtml";
import RunInlineScripts from "@/app/components/RunInlineScripts";
import { readPageBody } from "@/app/lib/pageContent";
import { metaOf } from "@/app/lib/content";
import { toMetadata } from "@/app/lib/metadata";

const TPL = "/wp-content/themes/ASTRA";

export function generateMetadata(): Metadata {
  return toMetadata(metaOf("index.html"));
}

export default function Home() {
  const body = readPageBody("index.html");
  return (
    <>
      {/* トップページ専用スタイル（旧テーマは is_front_page 時のみ index.css を読む） */}
      <link rel="stylesheet" href={`${TPL}/index.css`} />
      <StaticHtml html={body} />
      <RunInlineScripts />
      <HomeInit />
    </>
  );
}
