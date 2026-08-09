import {
  ACCENT,
  BOOT,
  CHEEK,
  COOL,
  COOL_DARK,
  HAIR_DARK,
  HAIR_GRAY,
  INK,
  NAVY,
  SKIN,
  STAR,
} from "@/app/components/lp/lp-palette";
import { ItemGlyph } from "@/app/components/lp/ItemIcon";

/**
 * LP用の人物イラスト（コードSVG製）。
 * 2.8頭身・フラット塗り＋輪郭線1色で、アストくんと同じ画風に揃える。
 *
 * 方針:
 * - 「困っている人」は寒色グレーの服（＝困りゾーンの色）。アストラ側は作業服ネイビー＋星ワッペン
 * - 顔は点目＋短い眉＋単純な口のみ。実在スタッフの似顔絵ではないと一目で分かる記号性を保つ
 * - 実在の顧客・スタッフを表すものではない（お客様の声セクションには使わない）
 *
 * 図解に合成するときは *Group（<g>を返す）を使い、<svg>を入れ子にしない。
 * 座標系は共通で 72×106。骨格: 頭 cy=25 r=16 ／ 胴 y=46..78 ／ 脚 y=77..97。
 */

export type PersonKind = "shufu" | "senior" | "tanshin";
export type Mood = "worry" | "happy";
export type WorkerPose = "bow" | "carry" | "estimate" | "phone";

export const PERSON_VIEWBOX = "0 0 72 106";

const SH_L: [number, number] = [23, 52]; // 左肩
const SH_R: [number, number] = [49, 52]; // 右肩

/** 肩から手先へ伸びる腕。角度と長さは座標から算出するのでポーズ指定が破綻しない */
function Limb({
  from,
  to,
  color,
  hand = "skin",
  w = 8,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  hand?: "skin" | "glove" | "none";
  w?: number;
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  // rectは+y方向に伸ばすので、回転角は atan2(dx, dy)
  const deg = (Math.atan2(dx, dy) * 180) / Math.PI;
  return (
    <g transform={`translate(${from[0]},${from[1]}) rotate(${deg.toFixed(1)})`}>
      <rect x={-w / 2} y={-w / 2} width={w} height={len + w / 2} rx={w / 2} fill={color} stroke={INK} strokeWidth="1.5" />
      {hand === "none" ? null : (
        <circle cx="0" cy={len} r="4.3" fill={hand === "glove" ? "#fff" : SKIN} stroke={INK} strokeWidth="1.4" />
      )}
    </g>
  );
}

/* ---- 顔・髪 ---- */

function Face({ mood }: { mood: Mood }) {
  if (mood === "worry") {
    return (
      <g>
        <path d="M28 17.5l5.5 3" stroke={INK} strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <path d="M44 17.5l-5.5 3" stroke={INK} strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <circle cx="30.8" cy="25.5" r="2" fill={INK} />
        <circle cx="41.2" cy="25.5" r="2" fill={INK} />
        <path d="M32.5 33.5a4 2.6 0 0 1 7 0" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M50.5 18.5c1.5 2.1 2.3 3.3 2.3 4.2a2.3 2.3 0 0 1-4.6 0c0-.9.8-2.1 2.3-4.2z" fill="#8ecbe8" stroke={INK} strokeWidth="1.1" />
      </g>
    );
  }
  return (
    <g>
      <path d="M28 19a3.8 3.8 0 0 1 5.6 0" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M38.4 19a3.8 3.8 0 0 1 5.6 0" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M28.2 26.4a3.2 2.8 0 0 1 5.2 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M38.6 26.4a3.2 2.8 0 0 1 5.2 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M32.5 32.5a4 3.2 0 0 0 7 0" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      <ellipse cx="26.8" cy="30.5" rx="2.5" ry="1.6" fill={CHEEK} opacity="0.5" />
      <ellipse cx="45.2" cy="30.5" rx="2.5" ry="1.6" fill={CHEEK} opacity="0.5" />
    </g>
  );
}

/** 頭より先に描く髪（サイド・お団子） */
function HairBack({ kind }: { kind: PersonKind }) {
  if (kind === "shufu") {
    return (
      <g fill={HAIR_DARK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        <rect x="18.5" y="18" width="6.5" height="22" rx="3.2" />
        <rect x="47" y="18" width="6.5" height="22" rx="3.2" />
      </g>
    );
  }
  if (kind === "senior") {
    return <circle cx="36" cy="8" r="5.5" fill={HAIR_GRAY} stroke={INK} strokeWidth="1.5" />;
  }
  return null;
}

/** 頭の後に描く髪（前髪キャップ） */
function HairFront({ kind }: { kind: PersonKind }) {
  const fill = kind === "senior" ? HAIR_GRAY : HAIR_DARK;
  return (
    <path
      d="M20.5 23a15.5 15.5 0 0 1 31 0c-4-4.6-9.5-6.8-15.5-6.8S24.5 18.4 20.5 23z"
      fill={fill}
      stroke={INK}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  );
}

function Legs({ color, shoe }: { color: string; shoe: string }) {
  return (
    <g>
      <rect x="27" y="74" width="8" height="23" rx="4" fill={color} stroke={INK} strokeWidth="1.5" />
      <rect x="37" y="74" width="8" height="23" rx="4" fill={color} stroke={INK} strokeWidth="1.5" />
      <rect x="24" y="95" width="12" height="7" rx="3" fill={shoe} stroke={INK} strokeWidth="1.4" />
      <rect x="36" y="95" width="12" height="7" rx="3" fill={shoe} stroke={INK} strokeWidth="1.4" />
    </g>
  );
}

function Neck() {
  return <rect x="32.5" y="37" width="7" height="11" rx="3" fill={SKIN} stroke={INK} strokeWidth="1.5" />;
}

/* ---- 困っている人 ---- */

export function TroubledPersonGroup({
  kind = "shufu",
  mood = "worry",
  holdingPhone = false,
}: {
  kind?: PersonKind;
  mood?: Mood;
  holdingPhone?: boolean;
}) {
  return (
    <g>
      <Legs color={COOL_DARK} shoe={INK} />
      <Neck />
      <HairBack kind={kind} />
      <rect x="21" y="46" width="30" height="32" rx="9" fill={COOL} stroke={INK} strokeWidth="1.6" />
      {holdingPhone ? (
        <>
          <Limb from={SH_L} to={[17, 72]} color={COOL_DARK} />
          <Limb from={SH_R} to={[46, 38]} color={COOL_DARK} />
        </>
      ) : mood === "worry" ? (
        <>
          {/* 片手は下ろし、片手を頬へ（万歳に見せない） */}
          <Limb from={SH_L} to={[17, 72]} color={COOL_DARK} />
          <Limb from={SH_R} to={[46, 36]} color={COOL_DARK} />
        </>
      ) : (
        <>
          <Limb from={SH_L} to={[17, 72]} color={COOL_DARK} />
          <Limb from={SH_R} to={[55, 72]} color={COOL_DARK} />
        </>
      )}
      <circle cx="36" cy="25" r="16" fill={SKIN} stroke={INK} strokeWidth="1.6" />
      <HairFront kind={kind} />
      <Face mood={mood} />
    </g>
  );
}

export function TroubledPerson({
  kind = "shufu",
  mood = "worry",
  className = "",
}: {
  kind?: PersonKind;
  mood?: Mood;
  className?: string;
}) {
  const who = kind === "senior" ? "ご年配の方" : kind === "tanshin" ? "男性" : "女性";
  return (
    <svg
      className={className}
      viewBox={PERSON_VIEWBOX}
      role="img"
      aria-label={`${mood === "worry" ? "処分に困っている" : "解決して笑顔の"}${who}のイラスト`}
    >
      <TroubledPersonGroup kind={kind} mood={mood} />
    </svg>
  );
}

/* ---- アストラの作業員 ---- */

function WorkerTorso() {
  return (
    <g>
      <rect x="21" y="46" width="30" height="32" rx="9" fill={NAVY} stroke={INK} strokeWidth="1.6" />
      <path d="M21 55h30" stroke={ACCENT} strokeWidth="2.2" opacity="0.9" />
      <path d="M36 60l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" fill={STAR} />
    </g>
  );
}

function Cap({ female }: { female: boolean }) {
  return (
    <g>
      {female ? (
        <path d="M20.5 26a15.5 15.5 0 0 1 31 0v9a2.2 2.2 0 0 1-4.4 0v-7H24.9v7a2.2 2.2 0 0 1-4.4 0z" fill={HAIR_DARK} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      ) : null}
      <path d="M20.6 22.5a15.4 15.4 0 0 1 30.8 0z" fill={NAVY} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18.5 22.5h20a2.1 2.1 0 0 1 0 4.2h-20a2.1 2.1 0 0 1 0-4.2z" fill={NAVY} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M36 12l1.7 3.5 3.9.6-2.8 2.7.7 3.8-3.5-1.8-3.5 1.8.7-3.8-2.8-2.7 3.9-.6z" fill={STAR} />
    </g>
  );
}

function WorkerHead({ female }: { female: boolean }) {
  return (
    <g>
      <circle cx="36" cy="25" r="16" fill={SKIN} stroke={INK} strokeWidth="1.6" />
      <Cap female={female} />
      <circle cx="30.8" cy="29" r="2" fill={INK} />
      <circle cx="41.2" cy="29" r="2" fill={INK} />
      <path d="M32.5 34a4 3.2 0 0 0 7 0" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      <ellipse cx="26.8" cy="32.5" rx="2.5" ry="1.6" fill={CHEEK} opacity="0.5" />
      <ellipse cx="45.2" cy="32.5" rx="2.5" ry="1.6" fill={CHEEK} opacity="0.5" />
    </g>
  );
}

export function WorkerGroup({
  female = false,
  pose = "bow",
  item,
}: {
  female?: boolean;
  pose?: WorkerPose;
  item?: string;
}) {
  return (
    <g>
      {/* 脚は常に垂直。お辞儀は上半身だけ前傾させる */}
      <Legs color={NAVY} shoe={BOOT} />
      <g transform={pose === "bow" ? "rotate(-12 36 76)" : undefined}>
        <Neck />
        <WorkerTorso />
        {pose === "carry" ? (
          <>
            {/* 抱えている品目。ネイビーの作業服に沈まないよう明るい面を敷く */}
            {item ? (
              <g>
                <rect x="11" y="54" width="50" height="36" rx="5" fill="#fffaf0" stroke={INK} strokeWidth="1.8" />
                <g transform="translate(11,53) scale(0.78)">
                  <ItemGlyph slug={item} />
                </g>
              </g>
            ) : null}
            <Limb from={SH_L} to={[12, 63]} color={NAVY} hand="glove" />
            <Limb from={SH_R} to={[60, 63]} color={NAVY} hand="glove" />
          </>
        ) : pose === "estimate" ? (
          <>
            <Limb from={SH_L} to={[17, 72]} color={NAVY} hand="glove" />
            <Limb from={SH_R} to={[52, 58]} color={NAVY} hand="glove" />
            <g transform="rotate(7 58 56)">
              <rect x="47" y="42" width="22" height="27" rx="3" fill="#fff" stroke={INK} strokeWidth="1.6" />
              <rect x="54" y="39" width="8" height="5" rx="2" fill={INK} />
              <g stroke={INK} strokeWidth="1.5" strokeLinecap="round">
                <path d="M51 50h14" />
                <path d="M51 55h14" />
              </g>
              <text x="58" y="65" textAnchor="middle" fontSize="9" fontWeight="800" fill={ACCENT}>
                ¥0
              </text>
            </g>
          </>
        ) : pose === "phone" ? (
          <>
            <Limb from={SH_L} to={[17, 72]} color={NAVY} hand="glove" />
            <Limb from={SH_R} to={[57, 40]} color={NAVY} hand="glove" />
            <rect x="50" y="20" width="8" height="13.5" rx="2.4" fill="#fff" stroke={INK} strokeWidth="1.5" transform="rotate(20 54 26.5)" />
          </>
        ) : (
          <>
            <Limb from={SH_L} to={[17, 72]} color={NAVY} hand="glove" />
            <Limb from={SH_R} to={[55, 72]} color={NAVY} hand="glove" />
          </>
        )}
        <WorkerHead female={female} />
      </g>
    </g>
  );
}

export function Worker({
  female = false,
  pose = "bow",
  item,
  className = "",
}: {
  female?: boolean;
  pose?: WorkerPose;
  item?: string;
  className?: string;
}) {
  const doing =
    pose === "carry"
      ? "荷物を運ぶ"
      : pose === "estimate"
        ? "お見積もりを提示する"
        : pose === "phone"
          ? "電話を受ける"
          : "ごあいさつする";
  return (
    <svg
      className={className}
      viewBox={PERSON_VIEWBOX}
      role="img"
      aria-label={`アストラの${female ? "女性" : ""}スタッフが${doing}イラスト`}
    >
      <WorkerGroup female={female} pose={pose} item={item} />
    </svg>
  );
}
