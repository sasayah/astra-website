/**
 * ブログ/未分類の重複<title>を一意化するスクリプト（manifest.jsonのみ変更、本文h1は不変）。
 * 例: 「大阪市にて🏠 | ...」×124件 → 「大阪市の不用品回収事例（2026年7月3日）｜不用品回収アストラ」
 * 生成規則: {本文/旧titleから抽出した市区町村}の{不用品回収|遺品整理}事例（{本文の投稿日}）
 * 実行: node scripts/uniquify-post-titles.mjs        （dry-run）
 *       node scripts/uniquify-post-titles.mjs --write （書き込み）
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const ROOT = path.join(import.meta.dirname, "..");
const MANIFEST = path.join(ROOT, "content", "manifest.json");
const write = process.argv.includes("--write");

let text = readFileSync(MANIFEST, "utf-8");
const manifest = JSON.parse(text);

const postKeys = Object.keys(manifest).filter(
  (k) =>
    /^(blog|未分類)\/[^/]+\.html$/.test(k) &&
    !k.endsWith("/index.html") &&
    k !== "blog/index.html",
);

// 重複しているtitleグループのみ対象（既に一意なtitleは触らない）
const counts = {};
for (const k of postKeys) counts[manifest[k].title] = (counts[manifest[k].title] || 0) + 1;
const targets = postKeys.filter((k) => counts[manifest[k].title] > 1);

const stripPage = (t) => t.replace(/\s*\|\s*不用品回収なら大阪のアストラ\s*$/, "");
const bodyTextOf = (key) => {
  const html = readFileSync(path.join(ROOT, "content", "pages", key), "utf-8");
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
};

const used = new Set(postKeys.filter((k) => counts[manifest[k].title] === 1).map((k) => manifest[k].title));
const renames = [];
for (const key of targets) {
  const body = bodyTextOf(key);
  // 市区町村: 旧titleの「◯◯にて」優先 → 本文の「◯◯にて」
  const old = stripPage(manifest[key].title);
  const fromTitle = old.match(/^([一-龠ぁ-んァ-ヶa-zA-Z]+?[市区町村府県])にて/);
  const fromBody = body.match(/([一-龠]{1,6}[市区町村])にて/);
  const city = (fromTitle?.[1] ?? fromBody?.[1])?.replace(/^大阪府$/, "大阪") ?? null;
  // 投稿日: 本文の最初の YYYY年MM月DD日
  const d = body.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/);
  const dateStr = d ? `${d[1]}年${Number(d[2])}月${Number(d[3])}日` : null;
  // サービス種別: 記事本文のみで判定。記事末尾の定型文（「◯◯をご希望の方は」誘導、
  // 「一覧に戻る」ナビ、追従バーの「部屋の片付け・引越し・遺品整理・不用品回収」）以降は
  // 全記事共通のため切り落としてから「遺品整理」の有無を見る
  let intro = d ? body.slice(body.indexOf(d[0]) + d[0].length) : body;
  for (const marker of ["をご希望の方は", "一覧に戻る", "部屋の片付け・引越し"]) {
    const i = intro.indexOf(marker);
    if (i >= 0) intro = intro.slice(0, i);
  }
  const service = intro.includes("遺品整理") ? "遺品整理" : "不用品回収";
  const id = path.basename(key, ".html");

  // 市区が特定できた作業報告は「{市区}の{サービス}事例」型、
  // 特定できない記事（挨拶等）は旧タイトル+日付で一意化のみ行う
  let base;
  if (city) {
    base = dateStr
      ? `${city}の${service}事例（${dateStr}）｜不用品回収アストラ`
      : `${city}の${service}事例 No.${id}｜不用品回収アストラ`;
  } else {
    const oldBase = old.replace(/[🏠✨😊🚚]/gu, "").trim();
    base = dateStr
      ? `${oldBase}（${dateStr}）｜不用品回収アストラ`
      : `${oldBase} No.${id}｜不用品回収アストラ`;
  }
  let title = base;
  let n = 2;
  while (used.has(title)) title = base.replace("｜", `・その${n++}｜`);
  used.add(title);
  renames.push([key, manifest[key].title, title]);

  if (write) {
    const esc = key.replace(/[.*+?^${}()|[\]\\/]/g, (m) => "\\" + m);
    text = text.replace(
      new RegExp(`("${esc}":\\s*\\{[^}]*?"title":\\s*")[^"]*(")`),
      `$1${title}$2`,
    );
    text = text.replace(
      new RegExp(`("${esc}":\\s*\\{[^}]*?"ogTitle":\\s*")[^"]*(")`),
      `$1${title}$2`,
    );
  }
}

for (const [key, oldT, newT] of renames.slice(0, 10)) {
  console.log(`${key}\n  - ${oldT}\n  + ${newT}`);
}
console.log(`\n対象: ${renames.length}件 / 全記事: ${postKeys.length}件 ${write ? "（書き込み済み）" : "（dry-run。--writeで書き込み）"}`);

if (write) {
  JSON.parse(text); // 壊れていないか検証してから保存
  writeFileSync(MANIFEST, text);
}
