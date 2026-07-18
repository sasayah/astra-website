import type { CollectionConfig } from "payload";
import { isAdmin, isEditorOrAdmin } from "./access";

/** ブログ記事。旧サイトの /blog/{id}.html を移行し、以後は管理画面で投稿・編集する。 */
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "ブログ記事", plural: "ブログ記事" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "status", "legacyUrl"],
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "タイトル" },
    { name: "slug", type: "text", index: true, label: "スラッグ", admin: { description: "URL用（例: 3207）" } },
    { name: "publishedAt", type: "date", label: "公開日" },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "公開", value: "published" },
        { label: "下書き", value: "draft" },
      ],
    },
    { name: "category", type: "text", label: "カテゴリ" },
    { name: "content", type: "richText", label: "本文（新規・編集用）" },
    {
      name: "bodyHtml",
      type: "textarea",
      maxLength: 200000,
      label: "旧本文HTML（移行データ）",
      admin: {
        description: "旧サイトから移行した本文。content が空の場合こちらを表示。",
        rows: 6,
      },
    },
    {
      name: "legacyUrl",
      type: "text",
      unique: true,
      index: true,
      label: "旧URL",
      admin: { description: "例: /blog/3207.html（リダイレクト・突合用）" },
    },
  ],
};
