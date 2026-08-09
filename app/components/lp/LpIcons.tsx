import { ACCENT, INK, STAR, TINT } from "@/app/components/lp/lp-palette";

/**
 * 汎用アイコン（コードSVG製・32グリッド）。
 * 「番号＋文章」「Q&A」など文字だけの区間に置いて、流し読みでも要点が拾えるようにする。
 *
 * 画風はItemIcon/アストくんと統一（線=INK・角丸・面はTINT/白のみ）。
 * コピーの文言からアイコンを自動選択するため、品目16種×文言差分があっても運用不要で追随する。
 */

export type IconName =
  | "clock"
  | "yen0"
  | "female"
  | "gov"
  | "cert"
  | "tag"
  | "stairs"
  | "truck"
  | "calendar"
  | "phone"
  | "card"
  | "broom"
  | "shield"
  | "box"
  | "house"
  | "recycle"
  | "line"
  | "shop"
  | "star";

const sw = 2.2;

const PATHS: Record<IconName, React.ReactElement> = {
  clock: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="17" r="11" fill={TINT} />
      <path d="M16 11v6l4 3" fill="none" />
      <path d="M12 4h8" />
      <path d="M16 4v2" />
    </g>
  ),
  yen0: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" fill={TINT} />
      <path d="M11 10l5 7 5-7" fill="none" />
      <path d="M11 18h10M11 22h10" />
      <path d="M16 17v6" />
    </g>
  ),
  female: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="6" fill={TINT} />
      <path d="M6 28c0-5.5 4.5-9 10-9s10 3.5 10 9z" fill="#fff" />
      <path d="M10 10a6 6 0 0 1 12 0" fill="none" />
      <path d="M22.5 9h4" />
    </g>
  ),
  gov: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12L16 5l12 7z" fill={TINT} />
      <path d="M7 13v12M13 13v12M19 13v12M25 13v12" />
      <path d="M4 27h24" />
    </g>
  ),
  cert: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4" width="22" height="20" rx="3" fill="#fff" />
      <path d="M10 11h12M10 16h8" />
      <circle cx="22" cy="21" r="5" fill={STAR} />
      <path d="M20 27l2-2 2 2" fill="none" />
    </g>
  ),
  tag: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h11a1 1 0 0 1 1 1v11L15 29 3 17z" fill={TINT} />
      <circle cx="23" cy="9" r="2.4" fill="#fff" />
    </g>
  ),
  stairs: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 28v-7h8v-7h8V7h9v21z" fill={TINT} />
    </g>
  ),
  truck: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="16" height="12" rx="2" fill="#fff" />
      <path d="M18 21V11h6l4 5v5z" fill={TINT} />
      <circle cx="9" cy="24" r="3" fill="#fff" />
      <circle cx="23" cy="24" r="3" fill="#fff" />
    </g>
  ),
  calendar: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="7" width="24" height="21" rx="3" fill="#fff" />
      <path d="M4 14h24" />
      <path d="M10 4v5M22 4v5" />
      <rect x="9" y="18" width="5" height="4" rx="1" fill={ACCENT} stroke="none" />
    </g>
  ),
  phone: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M8 4h4l2 6-3 2a14 14 0 0 0 7 7l2-3 6 2v4a2 2 0 0 1-2 2C13 24 6 17 6 6a2 2 0 0 1 2-2z"
        fill={TINT}
      />
    </g>
  ),
  card: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="26" height="18" rx="3" fill="#fff" />
      <path d="M3 13h26" />
      <rect x="7" y="18" width="7" height="3" rx="1.5" fill={ACCENT} stroke="none" />
    </g>
  ),
  broom: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3L12 15" fill="none" />
      <path d="M8 15h10l3 13H5z" fill={TINT} />
      <path d="M9 20h12" />
    </g>
  ),
  shield: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3l11 4v9c0 7-5 11-11 13C10 27 5 23 5 16V7z" fill={TINT} />
      <path d="M11 16l3.5 3.5L22 12" fill="none" strokeWidth="2.6" />
    </g>
  ),
  box: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11h22v17H5z" fill="#fff" />
      <path d="M5 11L9 4h14l4 7" fill={TINT} />
      <path d="M16 11v17" />
    </g>
  ),
  house: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15L16 5l12 10" fill="none" />
      <path d="M7 13v14h18V13" fill="#fff" />
      <rect x="13" y="18" width="6" height="9" rx="1" fill={TINT} />
    </g>
  ),
  recycle: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 5l5 8h-10z" fill={TINT} />
      <path d="M25 14l3 9-9-1" fill={TINT} />
      <path d="M7 14l-3 9 9-1" fill={TINT} />
    </g>
  ),
  line: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 5c7 0 12 4.4 12 9.8 0 5.4-5 9.8-12 9.8-1 0-2-.1-3-.3L7 28l1-4.6C5.5 21.6 4 18.4 4 14.8 4 9.4 9 5 16 5z" fill={TINT} />
    </g>
  ),
  shop: (
    <g stroke={INK} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l2-6h20l2 6a4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0z" fill={TINT} />
      <path d="M6 14v14h20V14" fill="#fff" />
      <rect x="11" y="18" width="10" height="10" rx="1" fill={TINT} />
    </g>
  ),
  star: (
    <g stroke={INK} strokeWidth={sw} strokeLinejoin="round">
      <path d="M16 4l3.6 7.4 8.1 1.1-5.9 5.7 1.5 8-7.3-4-7.3 4 1.5-8-5.9-5.7 8.1-1.1z" fill={STAR} />
    </g>
  ),
};

const LABELS: Record<IconName, string> = {
  clock: "時間",
  yen0: "料金",
  female: "女性スタッフ",
  gov: "自治体",
  cert: "許可・証明",
  tag: "買取",
  stairs: "搬出",
  truck: "回収",
  calendar: "日程",
  phone: "電話",
  card: "支払い",
  broom: "清掃",
  shield: "安心",
  box: "まとめて",
  house: "お部屋",
  recycle: "リサイクル",
  line: "LINE",
  shop: "店舗・法人",
  star: "ポイント",
};

export default function UtilIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" role="img" aria-label={`${LABELS[name]}のアイコン`}>
      {PATHS[name]}
    </svg>
  );
}

/**
 * コピーの文言からアイコンを推定する。
 * 上から順にマッチさせるので、より具体的な語を先に置くこと。
 */
const RULES: [RegExp, IconName][] = [
  [/業務用|法人|店舗|事業者|オフィス|飲食店/, "shop"],
  [/女性/, "female"],
  [/区役所|自治体|市役所|サイネージ|行政/, "gov"],
  [/許可|古物商|法令|適正|マニフェスト/, "cert"],
  [/リサイクル/, "recycle"],
  [/買[いい]?取|値引き|査定/, "tag"],
  [/クレジット|カード|支払|現金/, "card"],
  [/LINE|写真を送/, "line"],
  // 「自分で」を「分で」と誤検出しないよう、分は数字付きのみ拾う
  [/[0-9０-９]\s*分|最短|即日|当日|スピード|急ぎ|すぐ|早く/, "clock"],
  [/手数料|手続き|申込|粗大ごみ/, "gov"],
  [/階段|搬出|運び出|運べ|２階|2階|解体|重い|重く|大きく|大型|玄関|エレベーター/, "stairs"],
  [/日時指定|予約|収集日|土日|夜間|深夜|時間帯|期日/, "calendar"],
  [/何点|点も|まとめて|点数|一度に|複数|数点|大量|量が多/, "box"],
  [/0円|無料|追加料金|見積|料金|費用|円〜|価格|お得/, "yen0"],
  [/電話|問い合わせ|受付|ご連絡/, "phone"],
  [/掃除|清掃|片付け|かたづけ/, "broom"],
  [/安心|丁寧|信頼|実績|保険|養生|傷/, "shield"],
  [/部屋|引っ越し|引越|遺品|生前整理|一軒|空き家|買い替え|買替|処分方法/, "house"],
  [/エリア|地域|対応範囲|トラック|積み放題|回収|処分|引き取/, "truck"],
];

export function iconForText(text: string): IconName {
  for (const [re, name] of RULES) {
    if (re.test(text)) return name;
  }
  return "star";
}

/**
 * アイコン種別ごとの「一言見出し」。
 * 長い説明文の前に太字で置き、流し読みでも要点だけ拾えるようにする。
 * 事実の言い換えのみで、新しい約束はしない（許可済みファクトの範囲内）。
 */
const SHORT_LABELS: Record<IconName, string> = {
  clock: "最短20分・即日OK",
  yen0: "追加料金0円",
  female: "女性スタッフ在籍",
  gov: "自治体で出せないものも",
  cert: "許可を取って適正処分",
  tag: "買取でお値引き",
  stairs: "搬出までまるごと",
  truck: "まとめて回収OK",
  calendar: "日時のご指定OK",
  phone: "年中無休で受付",
  card: "クレジット払いOK",
  broom: "簡単なお掃除つき",
  shield: "ていねいに養生",
  box: "何点でもOK",
  house: "お部屋まるごとOK",
  recycle: "リサイクル法も対応",
  line: "LINEで写真見積り",
  shop: "業務用・法人もOK",
  star: "アストラの強み",
};

export function shortLabelFor(name: IconName): string {
  return SHORT_LABELS[name];
}
