import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { migrations } from "./migrations";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Voice } from "./collections/Voice";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// DATABASE_URI が postgres:// なら本番Postgres、それ以外はローカルSQLite。
// 本番(Postgres)は起動時に prodMigrations が未適用分を自動適用する。
// migrations/ はPostgres方言で生成済み（ローカルsqlite開発はdevの自動pushで不要）。
// 環境変数コピペ時の前後空白・改行混入に耐える（実際に末尾スペースで接続失敗した実績あり）
const dbUri = (process.env.DATABASE_URI || "file:./payload.db").trim();
const migrationDir = path.resolve(dirname, "migrations");
const db = dbUri.startsWith("postgres")
  ? postgresAdapter({
      pool: { connectionString: dbUri },
      migrationDir,
      prodMigrations: migrations,
    })
  : sqliteAdapter({ client: { url: dbUri }, migrationDir });

// 管理画面からのアップロード画像の保存先。
// S3_* が設定されていれば Railway Bucket（S3互換）へ保存（再デプロイで消えない）。
// 未設定時はローカルFS（public/uploads-cms、開発用）。
// プラグインは常に登録し enabled で切替える（importMapへのクライアント
// コンポーネント登録を環境変数の有無に依存させないため）
const s3Enabled = Boolean(
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
);
const plugins = [
  s3Storage({
    enabled: s3Enabled,
    collections: { media: true },
    bucket: process.env.S3_BUCKET || "unused",
    config: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || "auto",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "unused",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "unused",
      },
      forcePathStyle: true,
    },
  }),
];

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "- アストラ CMS" },
  },
  collections: [Users, Posts, Voice, Media],
  plugins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db,
  sharp,
});
