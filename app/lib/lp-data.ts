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

/**
 * 品目別 単品回収の料金目安（税込・搬出費込みの想定）。B案LP（/lp/b/...）のみで使用。
 * ※★仮の暫定値★ オーナー未確認。確認が取れるまで広告配信のリンク先にしないこと。
 *   確定後にこのコメントを更新する。軽トラ〜2tの積み放題価格のみ実掲載値（/huyouhin掲載）。
 */
export type LpPriceRow = { slug: string; name: string; price: string; note?: string };
export const SINGLE_ITEM_PRICES: LpPriceRow[] = [
  { slug: "reizouko", name: "冷蔵庫", price: "8,000円〜", note: "2ドア目安・リサイクル料金込み" },
  { slug: "sentakuki", name: "洗濯機", price: "6,000円〜", note: "縦型目安・リサイクル料金込み" },
  { slug: "tv", name: "テレビ", price: "5,000円〜", note: "液晶・ブラウン管どちらもOK" },
  { slug: "aircon", name: "エアコン", price: "5,000円〜", note: "取り外し作業込み" },
  { slug: "mattress", name: "マットレス", price: "6,000円〜", note: "スプリング可" },
  { slug: "bed", name: "ベッド", price: "9,000円〜", note: "解体作業込み" },
  { slug: "tansu", name: "タンス", price: "7,000円〜", note: "婚礼タンス可" },
  { slug: "sofa", name: "ソファ", price: "7,000円〜", note: "2人掛け目安" },
  { slug: "desk", name: "机・デスク", price: "6,000円〜" },
  { slug: "piano", name: "電子ピアノ", price: "10,000円〜", note: "アップライトは要見積り" },
  { slug: "jitensha", name: "自転車", price: "3,000円〜" },
  { slug: "futon", name: "布団", price: "2,000円〜", note: "1枚あたり" },
  { slug: "monitor", name: "モニター", price: "3,000円〜" },
  { slug: "sodaigomi", name: "粗大ごみ1点", price: "3,000円〜", note: "品目により変動" },
];

export function priceOf(slug: string): LpPriceRow | undefined {
  return SINGLE_ITEM_PRICES.find((p) => p.slug === slug);
}

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
