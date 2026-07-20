import type { CollectionConfig } from "payload";

/** 画像アップロード（保存先: S3_*設定時はRailway Bucket）。
 *  普段の運用では記事エディタから画像を挿入すれば自動で登録されるため、
 *  紛らわしさ回避のため管理画面のメニューからは非表示（機能はそのまま使える）。 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "メディア", plural: "メディア" },
  admin: { hidden: true },
  access: { read: () => true },
  upload: {
    staticDir: "public/uploads-cms",
    mimeTypes: ["image/*"],
  },
  fields: [{ name: "alt", type: "text", label: "代替テキスト" }],
};
