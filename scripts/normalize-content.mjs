// content/pages 配下の抽出HTMLを parse5 でブラウザ同等にパース正規化する。
// これにより SSR で埋め込む文字列 = ブラウザのパース結果 となり、
// dangerouslySetInnerHTML でのハイドレーション不一致を解消する。
import { parseFragment, serialize } from "parse5";
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "fs";
import { join } from "path";
import { readdirSync, statSync } from "fs";

const ROOT = join(process.cwd(), "content", "pages");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let n = 0;
for (const f of files) {
  const raw = readFileSync(f, "utf-8");
  const normalized = serialize(parseFragment(raw));
  writeFileSync(f, normalized);
  n++;
}
console.log(`normalized ${n} files`);
