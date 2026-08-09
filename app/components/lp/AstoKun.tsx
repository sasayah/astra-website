import { ItemGlyph } from "@/app/components/lp/ItemIcon";

/**
 * アストくん — ロゴの流れ星を擬人化したLP用マスコット（コードSVG製・画像ファイル不使用）。
 *
 * 設計ルール（docs/lp-hitoke 提案書の「憲法」準拠）:
 * - パレット5色以内・フラット塗り。グラデ/テクスチャ禁止
 * - セリフは持たない（吹き出しはテンプレ側のHTMLで表示 = ステマ規制対応の様式分離）
 * - dolly/hug ポーズの持ち物は ItemGlyph の差し替えスロット（品目16種対応）
 */

export type AstoPose = "greet" | "dolly" | "hug" | "point" | "phone" | "ok";

const NAVY = "#2b3a55";
const LINE = "#2f3b52";
const STAR = "#ffc53d";
const TRAIL = "#ffd97a";
const BOOT = "#7a5236";
const CHEEK = "#f6a57c";
const ACCENT = "#e85d10";

/** 各品目グリフ（64grid）の接地線Y。dollyポーズで荷台に接地させるための補正テーブル */
const DOLLY_BOTTOM: Record<string, number> = {
  reizouko: 60.5,
  sentakuki: 58.5,
  tv: 53.5,
  aircon: 50.5,
  mattress: 43.5,
  bed: 47.5,
  tansu: 58.5,
  sofa: 49.5,
  desk: 51.5,
  piano: 58.5,
  jitensha: 55,
  futon: 53.5,
  monitor: 51.5,
  kagu: 58.5,
  kaden: 48.5,
  sodaigomi: 55.5,
};

/** 頭部（角丸五芒星＋流れ星の尾）。原点=星の中心 */
function StarHead({ tail = true }: { tail?: boolean }) {
  return (
    <g>
      {tail ? (
        <g fill="none" strokeLinecap="round">
          <path d="M-15-16 Q-28-13 -36-4" stroke={TRAIL} strokeWidth="6" opacity="0.55" />
          <path d="M-14-10 Q-24-8 -31-1" stroke={TRAIL} strokeWidth="4" opacity="0.35" />
        </g>
      ) : null}
      <path
        d="M0-22l6 12.1 13.4 1.8-9.9 9.4 2.6 13.3-12.1-6.6-12.1 6.6 2.6-13.3-9.9-9.4 13.4-1.8z"
        fill={STAR}
        stroke={LINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="-4.6" cy="-3.6" r="2" fill={LINE} />
      <circle cx="4.6" cy="-3.6" r="2" fill={LINE} />
      <circle cx="-4" cy="-4.3" r="0.65" fill="#fff" />
      <circle cx="5.2" cy="-4.3" r="0.65" fill="#fff" />
      <path d="M-3.4 2.4a4.4 3.2 0 0 0 6.8 0" fill="none" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="-8.8" cy="0.8" rx="2.1" ry="1.4" fill={CHEEK} opacity="0.55" />
      <ellipse cx="8.8" cy="0.8" rx="2.1" ry="1.4" fill={CHEEK} opacity="0.55" />
    </g>
  );
}

/** 胴体（作業服）。原点=胴体上端中央。腕はポーズ側で描く */
function Torso() {
  return (
    <g>
      <rect x="-10" y="0" width="20" height="21" rx="6" fill={NAVY} stroke={LINE} strokeWidth="1.5" />
      <path d="M-10 5.5h20" stroke={ACCENT} strokeWidth="1.4" opacity="0.9" />
      <path
        d="M-0.5 9.5l1.7 3.4 3.7.5-2.7 2.6.6 3.7-3.3-1.8-3.3 1.8.6-3.7-2.7-2.6 3.7-.5z"
        fill={STAR}
        transform="translate(0.5,-1)"
      />
    </g>
  );
}

function Boots() {
  return (
    <g>
      <rect x="-8" y="21" width="6.5" height="6.5" rx="2.4" fill={BOOT} />
      <rect x="1.5" y="21" width="6.5" height="6.5" rx="2.4" fill={BOOT} />
    </g>
  );
}

/** 腕（角丸長方形）＋白手袋。rotate は肩位置基準 */
function Arm({ x, y, deg }: { x: number; y: number; deg: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${deg})`}>
      <rect x="-2.6" y="-2" width="5.2" height="13" rx="2.6" fill={NAVY} stroke={LINE} strokeWidth="1.2" />
      <circle cx="0" cy="12" r="3.1" fill="#fff" stroke={LINE} strokeWidth="1.2" />
    </g>
  );
}

export default function AstoKun({
  pose = "greet",
  item,
  className = "",
}: {
  pose?: AstoPose;
  /** dolly / hug ポーズの持ち物（品目slug） */
  item?: string;
  className?: string;
}) {
  const label = "マスコットキャラクターのアストくん";

  if (pose === "dolly") {
    return (
      <svg className={className} viewBox="0 0 150 104" role="img" aria-label={`${label}（台車で運ぶ）`}>
        {/* キャラ（前傾） */}
        <g transform="translate(37,39) rotate(4)">
          <StarHead />
          <g transform="translate(0,19)">
            <Torso />
            <Boots />
            {/* 両腕を台車ハンドルへ伸ばす */}
            <g transform="translate(9,3) rotate(-80)">
              <rect x="-2.4" y="-2" width="4.8" height="16" rx="2.4" fill={NAVY} stroke={LINE} strokeWidth="1.2" />
              <circle cx="0" cy="15.5" r="3" fill="#fff" stroke={LINE} strokeWidth="1.2" />
            </g>
            <g transform="translate(8,9) rotate(-86)">
              <rect x="-2.4" y="-2" width="4.8" height="16" rx="2.4" fill={NAVY} stroke={LINE} strokeWidth="1.2" />
              <circle cx="0" cy="15.5" r="3" fill="#fff" stroke={LINE} strokeWidth="1.2" />
            </g>
          </g>
        </g>
        {/* スピード線 */}
        <g stroke={TRAIL} strokeWidth="2.6" strokeLinecap="round" opacity="0.7">
          <path d="M6 58h12" />
          <path d="M2 68h9" />
        </g>
        {/* 台車 */}
        <g stroke={LINE} strokeWidth="2.2" strokeLinecap="round">
          <path d="M63 46 L63 88" fill="none" />
          <path d="M60 46 h6" fill="none" />
          <path d="M63 88 h58" fill="none" />
        </g>
        <circle cx="76" cy="95" r="6" fill={LINE} />
        <circle cx="76" cy="95" r="2.2" fill="#fff" />
        <circle cx="112" cy="95" r="6" fill={LINE} />
        <circle cx="112" cy="95" r="2.2" fill="#fff" />
        {/* 品目スロット（荷台 y=88 に接地。scale 0.72 でキャラと線幅を揃える） */}
        <g
          transform={`translate(69, ${(87 - 0.72 * (DOLLY_BOTTOM[item ?? "sodaigomi"] ?? 55.5)).toFixed(1)}) scale(0.72)`}
        >
          <ItemGlyph slug={item ?? "sodaigomi"} />
        </g>
      </svg>
    );
  }

  if (pose === "hug") {
    return (
      <svg className={className} viewBox="0 0 96 110" role="img" aria-label={`${label}（抱えて運ぶ）`}>
        <g transform="translate(48,30)">
          <StarHead />
          <g transform="translate(0,19)">
            <Torso />
            <Boots />
          </g>
        </g>
        {/* 品目（胴の前に抱える） */}
        <g transform="translate(27,54) scale(0.66)">
          <ItemGlyph slug={item ?? "futon"} />
        </g>
        {/* 品目の上から腕を回す（内側へ抱え込む角度） */}
        <g transform="translate(48,54)">
          <Arm x={-10} y={3} deg={-38} />
          <Arm x={10} y={3} deg={38} />
        </g>
      </svg>
    );
  }

  if (pose === "point") {
    return (
      <svg className={className} viewBox="0 0 96 110" role="img" aria-label={`${label}（ご案内）`}>
        <g transform="translate(48,30)">
          <StarHead />
          <g transform="translate(0,19)">
            <Torso />
            <Boots />
            <Arm x={-9} y={4} deg={24} />
            {/* 指差し腕（右斜め下前方） */}
            <g transform="translate(10,3) rotate(-118)">
              <rect x="-2.6" y="-2" width="5.2" height="14" rx="2.6" fill={NAVY} stroke={LINE} strokeWidth="1.2" />
              <circle cx="0" cy="13" r="3.4" fill="#fff" stroke={LINE} strokeWidth="1.2" />
              <path d="M0 15.5l0 4.5" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  if (pose === "phone") {
    return (
      <svg className={className} viewBox="0 0 96 110" role="img" aria-label={`${label}（お電話受付）`}>
        <g transform="translate(48,30)">
          <StarHead />
          <g transform="translate(0,19)">
            <Torso />
            <Boots />
            <Arm x={-9} y={4} deg={18} />
            {/* 受話ポーズ：腕を頭の右下へ */}
            <g transform="translate(9,2) rotate(148)">
              <rect x="-2.6" y="-2" width="5.2" height="12" rx="2.6" fill={NAVY} stroke={LINE} strokeWidth="1.2" />
            </g>
            {/* スマホ */}
            <rect x="10" y="-16" width="7" height="12.5" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.4" transform="rotate(14 13.5 -10)" />
          </g>
        </g>
        {/* 着信マーク */}
        <g stroke={ACCENT} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M74 16a7 7 0 0 1 4 5" />
          <path d="M78 10a12 12 0 0 1 7 9" />
        </g>
      </svg>
    );
  }

  if (pose === "ok") {
    return (
      <svg className={className} viewBox="0 0 96 110" role="img" aria-label={`${label}（OKサイン）`}>
        <g transform="translate(48,32)">
          <StarHead />
          <g transform="translate(0,19)">
            <Torso />
            <Boots />
            <Arm x={-9} y={4} deg={20} />
            {/* OKの腕（上げてリング） */}
            <g transform="translate(10,2) rotate(-160)">
              <rect x="-2.6" y="-2" width="5.2" height="12" rx="2.6" fill={NAVY} stroke={LINE} strokeWidth="1.2" />
              <circle cx="0" cy="14" r="4.4" fill="none" stroke={LINE} strokeWidth="2.6" />
              <circle cx="0" cy="14" r="4.4" fill="none" stroke="#fff" strokeWidth="1.2" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  /* greet（既定）: 右手を挙げて軽い会釈 */
  return (
    <svg className={className} viewBox="0 0 96 110" role="img" aria-label={`${label}（ごあいさつ）`}>
      <g transform="translate(48,30)">
        <StarHead />
        <g transform="translate(0,19)">
          <Torso />
          <Boots />
          <Arm x={-9} y={4} deg={22} />
          <Arm x={10} y={3} deg={-150} />
        </g>
      </g>
    </svg>
  );
}
