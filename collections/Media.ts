import type { CollectionConfig } from "payload";

/** 画像アップロード。本番では Cloudflare R2 / S3 ストレージアダプタに切替予定。 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    staticDir: "public/uploads-cms",
    mimeTypes: ["image/*"],
  },
  fields: [{ name: "alt", type: "text", label: "代替テキスト" }],
};
