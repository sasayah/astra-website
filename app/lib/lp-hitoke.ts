/**
 * 「人っけ」リデザイン（アストくん）の配信設定。
 *
 * 2026-08-09: 品目分割A/Bは取りやめ、**全16品目に展開**（オーナー判断）。
 * 理由: 単品キャンペーンのCVは2週間で片群10数件しか貯まらず統計的有意差が出ないため、
 * 群を分けても効果を切り分けられない。それなら全トラフィックに当てて月次の前後比較で見る。
 *
 * ロールバックはこの集合を空にするだけ（`new Set<string>([])`）。
 * 部分配信に戻す場合も、ここに残したいslugだけを列挙すればよい。
 */

/** 全品目（content/lp-items.json の slug と一致させること） */
export const ALL_SLUGS = [
  "reizouko", // 冷蔵庫
  "sentakuki", // 洗濯機
  "tv", // テレビ
  "aircon", // エアコン
  "mattress", // マットレス
  "bed", // ベッド
  "tansu", // タンス
  "sofa", // ソファ
  "desk", // 学習机
  "piano", // ピアノ
  "jitensha", // 自転車
  "futon", // 布団
  "monitor", // 液晶モニター
  "kagu", // 大型家具（広域LP）
  "kaden", // 家電製品（広域LP）
  "sodaigomi", // 粗大ごみ
] as const;

export const HITOKE_SLUGS = new Set<string>(ALL_SLUGS);

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
