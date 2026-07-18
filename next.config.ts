import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // 旧サイトの画像は最適化なしでそのまま配信（<img>参照の互換維持）
  images: { unoptimized: true },
};

export default withPayload(nextConfig);
