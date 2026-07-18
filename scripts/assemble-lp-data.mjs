#!/usr/bin/env node
/**
 * LPコピー生成ワークフローの出力JSONを検証して content/lp-items.json に書き込む。
 * 使い方: node scripts/assemble-lp-data.mjs <workflow-output.json>
 * 入力形式: [{ slug, issues, copy: LpItem }]（copy直下でも可）
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const ORDER = [
  "reizouko", "sentakuki", "tv", "aircon", "mattress", "bed", "tansu", "sofa",
  "desk", "piano", "jitensha", "futon", "monitor", "kagu", "kaden", "sodaigomi",
];

const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/assemble-lp-data.mjs <workflow-output.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(input, "utf-8"));
const items = raw.map((r) => r.copy ?? r);

const REQUIRED = ["slug", "name", "kw", "title", "h1", "lead", "pains", "points", "faq"];
// 「0円」以外の金額表現は禁止（間取り表などの実在価格はテンプレート側で持つ）
const YEN_RE = /(?<!0)[1-9][\d,，]*\s*円|[¥￥]\s*[1-9]/;

const errors = [];
for (const it of items) {
  const ctx = it.slug ?? "(no slug)";
  for (const k of REQUIRED) {
    const v = it[k];
    if (v == null || (Array.isArray(v) && v.length === 0) || v === "") {
      errors.push(`${ctx}: ${k} が空`);
    }
  }
  for (const field of ["title", "h1"]) {
    if (it[field] && !it[field].includes("{city}")) {
      errors.push(`${ctx}: ${field} に {city} トークンがない`);
    }
  }
  const textBlob = JSON.stringify(it, null, 0);
  const m = textBlob.match(YEN_RE);
  if (m) errors.push(`${ctx}: 金額表現が含まれている: "${m[0]}"`);
  it.recycleLawNote = it.recycleLawNote || "";
  it.voices = (it.voices ?? []).map(({ text, meta }) => ({ text, meta }));
}

if (errors.length) {
  console.error("検証エラー:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

items.sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

const out = path.join(process.cwd(), "content", "lp-items.json");
writeFileSync(out, JSON.stringify(items, null, 2) + "\n");
console.log(`OK: ${items.length}品目 → ${out}`);
