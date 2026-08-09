/**
 * 「人っけ」リデザイン（アストくん）のA/B配布設定。
 *
 * 第1弾は16品目を消化額がほぼ均衡する2群に分け、片群のみ新デザインを配信する
 * （検証設計は docs/lp-hitoke-redesign 参照。判定KPI=電話タップ率、2週間）。
 *   新デザイン群 ≈ 30日消化 12.0万円 / 現行維持群 ≈ 13.5万円
 * 全面展開するときは ALL_SLUGS をそのまま入れる。
 */

export const HITOKE_SLUGS = new Set<string>([
  "reizouko", // 冷蔵庫（最大消化）
  "tansu", // タンス
  "sofa", // ソファ
  "jitensha", // 自転車
  "desk", // 学習机
  "monitor", // モニター
  "sentakuki", // 洗濯機（配信再開したて）
  "sodaigomi", // 粗大ごみ
]);
// 現行維持（対照群）: aircon / tv / mattress / piano / futon / bed / kagu / kaden
// ※ kagu は大型キャンペーン（tCPA学習中）の主要リンク先のため対照群に固定

export function hitokeEnabled(slug: string): boolean {
  return HITOKE_SLUGS.has(slug);
}

/** 抱えて運ぶ品目（それ以外は台車） */
const HUG_SLUGS = new Set(["mattress", "futon", "monitor", "kaden"]);

export function carryPose(slug: string): "dolly" | "hug" {
  return HUG_SLUGS.has(slug) ? "hug" : "dolly";
}

/**
 * お悩みセクションのイラストで使う人物。
 * 品目の典型的な依頼者像に寄せる（bfh.jp等が採る悩みペルソナの型）。
 * ここでの人物はイラストであり、実在の顧客を表すものではない。
 */
const SENIOR_SLUGS = new Set(["tansu", "bed", "piano", "futon", "kagu"]);
const TANSHIN_SLUGS = new Set(["tv", "aircon", "mattress", "jitensha", "monitor"]);

export function painPersonFor(slug: string): "shufu" | "senior" | "tanshin" {
  if (SENIOR_SLUGS.has(slug)) return "senior";
  if (TANSHIN_SLUGS.has(slug)) return "tanshin";
  return "shufu";
}
