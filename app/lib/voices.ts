import bankJson from "@/content/voice-bank.json";

/**
 * お客様の声バンク = Googleマップの実クチコミ（不用品回収 アストラ、★4.9・81件時点）。
 * オーナー提供のクチコミ一覧から本文を転記（原文まま、機種依存記号のみ調整）。
 * 品目に言及があるものは items にタグ付けし、ページごとに決定的に出し分ける。
 * 評価値・件数を更新する場合は GOOGLE_RATING を更新すること。
 */
export type BankVoice = {
  name: string;
  text: string;
  items?: string[];
  /** 法人・定期契約の声（個人向けページでは後ろに回す） */
  b2b?: boolean;
};

export const GOOGLE_RATING = { score: "4.9", count: 81 } as const;

/** Googleマップのクチコミ一覧への導線（場所検索リンク） */
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=%E4%B8%8D%E7%94%A8%E5%93%81%E5%9B%9E%E5%8F%8E%20%E3%82%A2%E3%82%B9%E3%83%88%E3%83%A9%20%E5%A4%A7%E9%98%AA%E5%B8%82%E8%A5%BF%E6%B7%80%E5%B7%9D%E5%8C%BA%E5%BE%A1%E5%B9%A3%E5%B3%B6";

const BANK = bankJson as BankVoice[];

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function pick(pool: BankVoice[], seed: string, count: number): BankVoice[] {
  const sorted = [...pool].sort((a, b) => {
    // 個人向けページ前提: 法人の声は後ろへ
    const bb = (a.b2b ? 1 : 0) - (b.b2b ? 1 : 0);
    if (bb !== 0) return bb;
    return hash(a.name + seed) - hash(b.name + seed);
  });
  return sorted.slice(0, count);
}

/** 品目LP用: 品目に言及のあるクチコミを優先し、残りは全体からページごとに回転 */
export function voicesForItem(
  itemSlug: string,
  cityName?: string,
  _pref?: string,
  count = 2,
): BankVoice[] {
  const seed = itemSlug + (cityName ?? "");
  const byItem = BANK.filter((v) => v.items?.includes(itemSlug));
  const rest = BANK.filter((v) => !v.items?.includes(itemSlug));
  return [...pick(byItem, seed, count), ...pick(rest, seed, count)].slice(0, count);
}

/** 地域ページ用: 全体からページ（市区）ごとに回転して選ぶ */
export function voicesForArea(cityName: string, _pref: string, count = 3): BankVoice[] {
  return pick(BANK, cityName, count);
}
