import lpItemsJson from "@/content/lp-items.json";

/**
 * Yahoo検索広告用の品目別LPデータ。
 * URL: /lp/{item.slug}/ （地域デフォルト=大阪） と /lp/{item.slug}/{city.slug}/
 * 全LPは noindex（広告専用。自然検索は kansai-huyouhin/ 等の既存ページが担う）。
 * コピーの根拠は docs/yahoo-ads-analysis.md の「サイト側の事実」節。品目個別の金額は書かない。
 */

export type LpFaq = { q: string; a: string };
export type LpVoice = { text: string; meta: string };

export type LpItem = {
  slug: string;
  /** 品目名（例: 冷蔵庫） */
  name: string;
  /** 検索動詞句（例: 処分・回収） */
  kw: string;
  /** {city} トークンを含む title */
  title: string;
  /** {city} トークンを含む H1 */
  h1: string;
  lead: string;
  pains: string[];
  points: string[];
  /** 家電リサイクル法対象品目のみ */
  recycleLawNote?: string;
  faq: LpFaq[];
  /** content/pages/voice 由来の実在の声（要約） */
  voices: LpVoice[];
};

export type LpCity = {
  slug: string;
  /** 表示名（例: 豊中市） */
  name: string;
  pref: string;
};

/** 検索クエリ実績のある/配信対象の市区。先頭10市は大阪府（単品キャンペーン配信エリア） */
export const LP_CITIES: LpCity[] = [
  { slug: "osakashi", name: "大阪市", pref: "大阪府" },
  { slug: "sakaishi", name: "堺市", pref: "大阪府" },
  { slug: "higashiosakashi", name: "東大阪市", pref: "大阪府" },
  { slug: "toyonakashi", name: "豊中市", pref: "大阪府" },
  { slug: "takatsukishi", name: "高槻市", pref: "大阪府" },
  { slug: "hirakatashi", name: "枚方市", pref: "大阪府" },
  { slug: "ibarakishi", name: "茨木市", pref: "大阪府" },
  { slug: "minoushi", name: "箕面市", pref: "大阪府" },
  { slug: "izumisanoshi", name: "泉佐野市", pref: "大阪府" },
  { slug: "kawachinaganoshi", name: "河内長野市", pref: "大阪府" },
  { slug: "amagasakishi", name: "尼崎市", pref: "兵庫県" },
  { slug: "nishinomiyashi", name: "西宮市", pref: "兵庫県" },
  { slug: "kobeshi", name: "神戸市", pref: "兵庫県" },
  { slug: "kyotoshi", name: "京都市", pref: "京都府" },
  { slug: "narashi", name: "奈良市", pref: "奈良県" },
];

/** 生成・検証済みコピー（content/lp-items.json）。再生成時はJSONを差し替えるだけでよい */
export const LP_ITEMS: LpItem[] = lpItemsJson as LpItem[];

export function findItem(slug: string): LpItem | undefined {
  return LP_ITEMS.find((i) => i.slug === slug);
}

export function findCity(slug: string): LpCity | undefined {
  return LP_CITIES.find((c) => c.slug === slug);
}

/** {city} トークンを地域名に置換（ベースLPは「大阪」） */
export function withCity(text: string, city?: LpCity): string {
  return text.replaceAll("{city}", city ? city.name : "大阪");
}
