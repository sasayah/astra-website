import type { CollectionConfig } from "payload";
import { isAdmin, isEditorOrAdmin } from "./access";

/** お客様の声。旧サイトからの移行データ（現在フロントエンドでは未使用）。
 *  運用者が触る必要がないため管理画面のメニューから非表示にしている。 */
export const Voice: CollectionConfig = {
  slug: "voice",
  labels: { singular: "お客様の声", plural: "お客様の声" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "prefecture", "city", "legacyUrl"],
    hidden: true,
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "タイトル" },
    { name: "prefecture", type: "text", index: true, label: "都道府県（スラッグ）" },
    { name: "city", type: "text", index: true, label: "市町村（スラッグ）" },
    { name: "content", type: "richText", label: "本文（新規・編集用）" },
    { name: "bodyHtml", type: "textarea", maxLength: 200000, label: "旧本文HTML（移行データ）", admin: { rows: 6 } },
    { name: "legacyUrl", type: "text", unique: true, index: true, label: "旧URL" },
  ],
};
