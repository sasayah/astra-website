import { readFileSync } from "fs";
import path from "path";

/**
 * content/pages 配下の抽出済み本文HTMLを読み込む。
 * @param slug 例: "index.html", "company/index.html"
 */
export function readPageBody(slug: string): string {
  const file = path.join(process.cwd(), "content", "pages", slug);
  return readFileSync(file, "utf-8");
}
