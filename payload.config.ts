import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Voice } from "./collections/Voice";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// DATABASE_URI が postgres:// なら本番Postgres、それ以外はローカルSQLite
const dbUri = process.env.DATABASE_URI || "file:./payload.db";
const db = dbUri.startsWith("postgres")
  ? postgresAdapter({ pool: { connectionString: dbUri } })
  : sqliteAdapter({ client: { url: dbUri } });

// 管理画面からのアップロード画像の保存先。
// S3_* が設定されていれば Railway Bucket（S3互換）へ保存（再デプロイで消えない）。
// 未設定時はローカルFS（public/uploads-cms、開発用）。
const s3Enabled = Boolean(
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
);
const plugins = s3Enabled
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET!,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || "auto",
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
          forcePathStyle: true,
        },
      }),
    ]
  : [];

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
