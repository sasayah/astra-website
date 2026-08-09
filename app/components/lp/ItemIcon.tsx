import type { ReactElement } from "react";

/**
 * 品目アイコン16種（コードSVG製・64x64グリッド）。
 * トンマナ規定: 線=#2f3b52 / 塗り=白+薄黄タブのみ / 角丸 / フラット。
 * ItemGlyph はアストくんの持ち物スロット（<svg>内に直接合成）用。
 */

const LINE = "#2f3b52";
const TINT = "#fff3d0";
const W = "#fff";

const sw = 3;

const GLYPHS: Record<string, ReactElement> = {
  reizouko: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="17" y="5" width="30" height="54" rx="4" fill={W} />
      <path d="M17 26h30" />
      <path d="M41 12v8" />
      <path d="M41 33v12" />
    </g>
  ),
  sentakuki: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="13" y="7" width="38" height="50" rx="5" fill={W} />
      <path d="M13 18h38" />
      <circle cx="20" cy="12.5" r="2" fill={LINE} stroke="none" />
      <circle cx="27" cy="12.5" r="2" fill={LINE} stroke="none" />
      <circle cx="32" cy="37" r="12.5" fill={TINT} />
      <circle cx="32" cy="37" r="7" fill={W} />
    </g>
  ),
  tv: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="12" width="48" height="30" rx="3" fill={TINT} />
      <path d="M32 42v8" />
      <path d="M20 53h24" />
    </g>
  ),
  aircon: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="13" width="52" height="20" rx="5" fill={W} />
      <path d="M12 27h40" />
      <path d="M18 41c0 4-4 4-4 8" fill="none" />
      <path d="M32 41c0 4-4 4-4 8" fill="none" />
      <path d="M46 41c0 4-4 4-4 8" fill="none" />
    </g>
  ),
  mattress: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="22" width="54" height="20" rx="9" fill={W} />
      <path d="M5 32h54" strokeWidth="1.8" opacity="0.7" />
      <circle cx="20" cy="27" r="1.6" fill={LINE} stroke="none" />
      <circle cx="32" cy="27" r="1.6" fill={LINE} stroke="none" />
      <circle cx="44" cy="27" r="1.6" fill={LINE} stroke="none" />
      <circle cx="20" cy="37" r="1.6" fill={LINE} stroke="none" />
      <circle cx="32" cy="37" r="1.6" fill={LINE} stroke="none" />
      <circle cx="44" cy="37" r="1.6" fill={LINE} stroke="none" />
    </g>
  ),
  bed: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14v30" />
      <rect x="10" y="28" width="46" height="12" rx="4" fill={TINT} />
      <rect x="14" y="21" width="12" height="7" rx="3" fill={W} />
      <path d="M56 28v16" />
      <path d="M14 40v6M52 40v6" />
    </g>
  ),
  tansu: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="15" y="7" width="34" height="50" rx="4" fill={W} />
      <path d="M15 24h34" />
      <path d="M15 41h34" />
      <path d="M28 15h8" />
      <path d="M28 32h8" />
      <path d="M28 49h8" />
    </g>
  ),
  sofa: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="17" width="40" height="14" rx="6" fill={W} />
      <rect x="10" y="29" width="44" height="13" rx="5" fill={TINT} />
      <path d="M8 25v17M56 25v17" />
      <path d="M32 17v12" strokeWidth="1.8" opacity="0.7" />
      <path d="M16 42v6M48 42v6" />
    </g>
  ),
  desk: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="20" width="48" height="6" rx="2" fill={TINT} />
      <path d="M12 26v24M52 26v24" />
      <rect x="34" y="26" width="18" height="11" rx="2" fill={W} />
      <path d="M40 31.5h6" />
      <rect x="14" y="12" width="10" height="8" rx="1.5" fill={W} />
      <rect x="26" y="14" width="7" height="6" rx="1.5" fill={W} />
    </g>
  ),
  piano: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="9" width="44" height="40" rx="3" fill={W} />
      <rect x="10" y="34" width="44" height="9" fill={TINT} />
      <path d="M18 34v6M26 34v6M34 34v6M42 34v6" strokeWidth="2" />
      <path d="M14 49v8M50 49v8" />
    </g>
  ),
  jitensha: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="17" cy="43" r="10.5" />
      <circle cx="47" cy="43" r="10.5" />
      <path d="M17 43l9-17h13l8 17" />
      <path d="M26 26l4 17" />
      <path d="M22 22h9" />
      <path d="M43 20l4 6" />
      <path d="M40 20h7" />
    </g>
  ),
  futon: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 46c0-5 4-8 10-8h34v10H20c-6 0-10-3-10-8z" fill={W} transform="translate(0,4)" />
      <path d="M12 34c0-5 4-8 10-8h32v10H22c-6 0-10-3-10-8z" fill={TINT} transform="translate(0,4)" />
      <path d="M14 22c0-5 4-8 10-8h30v10H24c-6 0-10-3-10-8z" fill={W} transform="translate(0,4)" />
      <path d="M46 16v38" strokeWidth="2" opacity="0.7" />
    </g>
  ),
  monitor: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="10" width="46" height="28" rx="3" fill={TINT} />
      <path d="M32 38v8" />
      <path d="M22 50h20" />
      <path d="M26 46h12" strokeWidth="2" />
    </g>
  ),
  kagu: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="7" width="28" height="50" rx="3" fill={W} />
      <path d="M24 7v50" />
      <path d="M20 30v6M28 30v6" />
      <rect x="42" y="34" width="14" height="5" rx="2" fill={TINT} />
      <path d="M44 39v12M54 39v12" />
      <path d="M42 34v-9" />
    </g>
  ),
  kaden: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="17" width="50" height="30" rx="4" fill={W} />
      <rect x="13" y="23" width="26" height="18" rx="2" fill={TINT} />
      <circle cx="48" cy="26" r="2.4" fill={LINE} stroke="none" />
      <path d="M45 34h6" />
      <path d="M45 39h6" />
    </g>
  ),
  sodaigomi: (
    <g stroke={LINE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 30h32v24H12z" fill={W} />
      <path d="M12 30l-6-8M44 30l6-8" fill="none" />
      <path d="M28 30v24" strokeWidth="1.8" opacity="0.6" />
      <circle cx="52" cy="46" r="7.5" fill={TINT} />
      <path d="M49 40c1-3 5-3 6 0" fill="none" strokeWidth="2.4" />
    </g>
  ),
};

/* 洗濯機と同型のフォールバック回避のため、未定義slugは粗大ごみアイコンを使う */
export function ItemGlyph({ slug }: { slug: string }) {
  return GLYPHS[slug] ?? GLYPHS.sodaigomi;
}

const LABELS: Record<string, string> = {
  reizouko: "冷蔵庫",
  sentakuki: "洗濯機",
  tv: "テレビ",
  aircon: "エアコン",
  mattress: "マットレス",
  bed: "ベッド",
  tansu: "タンス",
  sofa: "ソファ",
  desk: "学習机",
  piano: "ピアノ",
  jitensha: "自転車",
  futon: "布団",
  monitor: "モニター",
  kagu: "大型家具",
  kaden: "家電製品",
  sodaigomi: "粗大ごみ",
};

export default function ItemIcon({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={`${LABELS[slug] ?? "品目"}のイラスト`}>
      <ItemGlyph slug={slug} />
    </svg>
  );
}
