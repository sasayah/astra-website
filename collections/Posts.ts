import type { CollectionConfig } from "payload";
import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { isAdmin, isEditorOrAdmin } from "./access";

/** ブログ記事。旧サイトの /blog/{id}.html を移行し、以後は管理画面で投稿・編集する。
 *  ITに慣れていない運用者向けに、画面にはタイトル/本文/公開日/公開状態だけを表示し、
 *  スラッグ（URL）は自動生成、移行用の内部フィールドは非表示にしている。 */
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "ブログ記事", plural: "ブログ記事" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "status"],
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // スラッグ（URLの一部）は未入力なら日時から自動生成（例: 20260720153045）
        if (data && !data.slug) {
          const d = new Date();
          const p = (n: number) => String(n).padStart(2, "0");
          data.slug = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(
            d.getHours(),
          )}${p(d.getMinutes())}${p(d.getSeconds())}`;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true, label: "タイトル" },
    {
      name: "content",
      type: "richText",
      label: "本文",
      // 誤操作を減らすため機能を最小限に絞る（段落・見出し・太字/斜体・リンク・画像のみ。
      // 表・引用・チェックリスト等は無効）。スマホでは文章入力だけの想定
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature(),
          UploadFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description:
          "文章を入力するだけでOKです。パソコンで開いた場合は、行頭で「/」を入力すると見出しや画像を挿入できます。",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "公開日",
      defaultValue: () => new Date().toISOString(),
      admin: { description: "自動で今日の日付が入ります。予約日付にしたい場合だけ変更してください" },
    },
    {
      name: "status",
      type: "select",
      label: "公開状態",
      defaultValue: "published",
      options: [
        { label: "公開", value: "published" },
        { label: "下書き", value: "draft" },
      ],
    },
    // ---- 以下は内部用（運用者には見せない） ----
    {
      name: "slug",
      type: "text",
      index: true,
      label: "スラッグ",
      admin: { hidden: true },
    },
    {
      name: "category",
      type: "text",
      label: "カテゴリ",
      defaultValue: "ブログ",
      admin: { hidden: true },
    },
    {
      name: "bodyHtml",
      type: "textarea",
      maxLength: 200000,
      label: "旧本文HTML（移行データ）",
      admin: { hidden: true },
    },
    {
      name: "legacyUrl",
      type: "text",
      unique: true,
      index: true,
      label: "旧URL",
      admin: { hidden: true },
    },
  ],
};
