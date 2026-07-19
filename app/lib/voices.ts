import bankJson from "@/content/voice-bank.json";

/**
 * お客様の声バンク。Googleレビュー調の文体で品目×地域タグ付き。
 * ※★全て仮の文面（オーナー未確認）★ 実在のGoogleクチコミ・お客様アンケートへの
 *   差し替えを前提とした placeholder。公開前にオーナーの確認を取ること。
 * 選定は「同じ市 → 同じ県 → その他」の優先順で、ページごとに決定的に回転させる
 * （同じページは常に同じ声、隣の市は違う組み合わせになる）。
 */
export type BankVoice = {
  city: string;
  pref: string;
  items: string[];
  meta: string;
  text: string;
  /** 法人・店舗案件の声（個人向けページでは後ろに回す） */
  b2b?: boolean;
};

const BANK = bankJson as BankVoice[];

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function pick(
  pool: BankVoice[],
  cityName: string | undefined,
  pref: string | undefined,
  seed: string,
  count: number,
): BankVoice[] {
  const score = (v: BankVoice) =>
    cityName && v.city === cityName ? 0 : pref && v.pref === pref ? 1 : 2;
  const sorted = [...pool].sort((a, b) => {
    const d = score(a) - score(b);
    if (d !== 0) return d;
    // 個人向けページなので、同スコア内では法人事例（b2b）を後ろへ
    const bb = (a.b2b ? 1 : 0) - (b.b2b ? 1 : 0);
    if (bb !== 0) return bb;
    return hash(a.meta + seed) - hash(b.meta + seed);
  });
  // 同じ市の声ばかりに偏らないよう、市単位で重複を避けつつ選ぶ（足りなければ許容）
  const out: BankVoice[] = [];
  const usedCity = new Set<string>();
  for (const v of sorted) {
    if (out.length >= count) break;
    if (usedCity.has(v.city) && score(v) > 0) continue;
    usedCity.add(v.city);
    out.push(v);
  }
  for (const v of sorted) {
    if (out.length >= count) break;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

/** 品目LP用: 品目タグの一致する声を、市→県の優先で選ぶ */
export function voicesForItem(
  itemSlug: string,
  cityName?: string,
  pref?: string,
  count = 2,
): BankVoice[] {
  const byItem = BANK.filter((v) => v.items.includes(itemSlug));
  const pool = byItem.length >= count ? byItem : BANK;
  return pick(pool, cityName, pref, itemSlug + (cityName ?? ""), count);
}

/** 地域ページ用: その市→同県の優先で選ぶ */
export function voicesForArea(cityName: string, pref: string, count = 3): BankVoice[] {
  return pick(BANK, cityName, pref, cityName, count);
}
