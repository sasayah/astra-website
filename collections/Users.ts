import type { CollectionConfig } from "payload";
import { isAdmin } from "./access";

/** 管理者・編集者アカウント（ブログを書くスタッフ）。認証はPayload標準機能。 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  access: {
    // 管理者のみユーザー作成・削除可。編集者は自分の情報のみ。
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "name", type: "text", label: "氏名" },
    {
      name: "role",
      type: "select",
      label: "権限",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "管理者", value: "admin" },
        { label: "編集者", value: "editor" },
      ],
    },
  ],
};
