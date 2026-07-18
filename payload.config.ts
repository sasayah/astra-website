import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
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

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "- アストラ CMS" },
  },
  collections: [Users, Posts, Voice, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db,
  sharp,
});
