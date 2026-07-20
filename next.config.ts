import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // 旧サイトの画像は最適化なしでそのまま配信（<img>参照の互換維持）
  images: { unoptimized: true },
  // 旧WordPress時代のURLの受け皿。
  // 実在ページとの突合結果: WPサイトマップ406 URL中、新サイトに無いのは
  // 「不用品都市ごとテスト」(移行対象外のテストページ)と /contact/confirm のみ
  // (/blog/3209.html は本文ごと移行済み)。残りはWP特有のアーカイブ/フィード対策。
  async redirects() {
    return [
      // 「/不用品都市ごとテスト」（移行対象外のWPテストページ）。日本語sourceは
      // percent-encoded形式でないとマッチしない
      {
        source: "/%E4%B8%8D%E7%94%A8%E5%93%81%E9%83%BD%E5%B8%82%E3%81%94%E3%81%A8%E3%83%86%E3%82%B9%E3%83%88",
        destination: "/kansai-huyouhin",
        permanent: true,
      },
      { source: "/contact/confirm", destination: "/contact", permanent: true },
      // NEWS（2021年の開設告知1件のみで更新停止）はナビから外し、トップへ集約
      { source: "/news", destination: "/", permanent: true },
      { source: "/news/:path*", destination: "/", permanent: true },
      // WPのアーカイブ・ページネーション・フィード類
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/author/:path*", destination: "/blog", permanent: true },
      { source: "/blog/page/:page", destination: "/blog", permanent: true },
      { source: "/page/:page(\\d+)", destination: "/", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true },
      { source: "/comments/feed", destination: "/blog", permanent: true },
      // 旧サイトマップ形式（google-sitemap-generator）
      { source: "/sitemap-misc.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
};

export default withPayload(nextConfig);
