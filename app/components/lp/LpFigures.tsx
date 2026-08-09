import { ACCENT, COOL, INK, STAR, TINT, TRAIL } from "@/app/components/lp/lp-palette";
import { ItemGlyph } from "@/app/components/lp/ItemIcon";
import { TroubledPersonGroup, WorkerGroup } from "@/app/components/lp/LpPeople";
import type { PersonKind } from "@/app/components/lp/LpPeople";

/**
 * LPの図解アセット（コードSVG製）。
 * 「文字だけで説明していた区間」を絵に置き換えるためのパーツ群。
 *
 * 憲法:
 * - 価格・条件・電話番号はSVG内に焼き込まず、必ずHTML側テキストで併記する
 *   （SEO・スクリーンリーダー・修正容易性・A/Bのため）
 * - 図中に登場する人物はイラストであり、実在の顧客・スタッフを表さない
 */

/* ===== ヒーロー背景: 朝焼けの空と大阪の街 ===== */

export function HeroSky() {
  return (
    <svg className="lp-hv__sky" viewBox="0 0 360 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="astoSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="50%" stopColor="#ffeaC6" />
          <stop offset="100%" stopColor="#ffd9a4" />
        </linearGradient>
        <radialGradient id="astoSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffc94f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffc94f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="360" height="200" fill="url(#astoSky)" />
      {/* 朝日 */}
      <circle cx="302" cy="62" r="58" fill="url(#astoSun)" />
      <circle cx="302" cy="62" r="16" fill="#ffc23f" opacity="0.55" />
      {/* 雲 */}
      <g fill="#fffdf6" opacity="0.9">
        <path d="M30 44c0-6 4.8-10.8 10.8-10.8 3.6 0 6.8 1.8 8.8 4.5 2-5 6.9-8.5 12.7-8.5 7.6 0 13.7 6.1 13.7 13.7 0 .4 0 .7-.1 1.1z" />
        <path d="M232 30c0-4.6 3.7-8.4 8.4-8.4 2.8 0 5.3 1.4 6.8 3.5 1.6-3.9 5.4-6.6 9.9-6.6 5.9 0 10.6 4.8 10.6 10.6v.9z" />
      </g>
      {/* 遠景の街 */}
      <g fill="#efdcb4">
        <path d="M0 152v-26h14v-14h11v40zM40 152v-32h16v-13h10v45zM88 152v-42h20v42zM130 152v-23h12v-13h10v36zM214 152v-19h13v-10h9v29zM262 152v-29h17v29zM306 152v-19h11v-11h10v30zM342 152v-25h18v25z" />
      </g>
      {/* 大阪のタワー（記号としてのシルエット） */}
      <g fill="#e8d0a0">
        <path d="M154 152l7-43h4.5l-1.4-14h-2.6l-1.3-9h7.8l1.3-8h2.6l1.3 8h7.8l-1.3 9h-2.6l-1.4 14h4.5l7 43z" />
      </g>
      {/* 近景の街並み */}
      <g fill="#e0c893">
        <path d="M0 200v-32h18v-14h14v46zM36 200v-38h22v-12h13v50zM76 200v-49h26v49zM108 200v-28h15v-15h14v43zM142 200v-42h21v42zM169 200v-35h19v35zM194 200v-53h23v53zM223 200v-31h14v-14h13v45zM256 200v-45h22v45zM284 200v-24h13v-14h15v38zM318 200v-49h21v49zM345 200v-27h15v27z" />
      </g>
      {/* 窓明かり */}
      <g fill="#fff6dd" opacity="0.85">
        <rect x="82" y="160" width="5" height="6" rx="1" />
        <rect x="91" y="160" width="5" height="6" rx="1" />
        <rect x="200" y="156" width="5" height="6" rx="1" />
        <rect x="209" y="156" width="5" height="6" rx="1" />
        <rect x="324" y="160" width="5" height="6" rx="1" />
        <rect x="333" y="160" width="5" height="6" rx="1" />
      </g>
      {/* 流れ星の軌跡（視線をCTA方向へ運ぶ） */}
      <path d="M16 36q44-19 98-7" fill="none" stroke={TRAIL} strokeWidth="3" strokeLinecap="round" opacity="0.9" strokeDasharray="1 10" />
    </svg>
  );
}

/* ===== 軽トラック（共通パーツ・荷台 x0..52 / y8..34） ===== */

export function MiniTruck({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <rect x="0" y="8" width="52" height="26" rx="3" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <path d="M52 34V4h18l10 14v16z" fill="#fff" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M58 9h10l6 9H58z" fill={TINT} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M22 22l1.9 3.9 4.3.6-3.1 3 .7 4.2-3.8-2-3.8 2 .7-4.2-3.1-3 4.3-.6z" fill={STAR} />
      <circle cx="16" cy="38" r="7" fill={INK} />
      <circle cx="16" cy="38" r="2.6" fill="#fff" />
      <circle cx="68" cy="38" r="7" fill={INK} />
      <circle cx="68" cy="38" r="2.6" fill="#fff" />
    </g>
  );
}

/* ===== お悩みセクション: 品目を前に困っている人 ===== */

export function PainFigure({ itemSlug, kind = "shufu" }: { itemSlug: string; kind?: PersonKind }) {
  return (
    <svg className="lp-painfig" viewBox="0 0 170 112" role="img" aria-label="大きな不用品の処分方法に困っている方のイラスト">
      <g transform="translate(4,4) scale(0.95)">
        <TroubledPersonGroup kind={kind} mood="worry" />
      </g>
      <g transform="translate(88,36) scale(1.15)">
        <ItemGlyph slug={itemSlug} />
      </g>
      {/* 「？」の吹き出し */}
      <g transform="translate(96,14)">
        <circle cx="0" cy="0" r="13" fill="#fff" stroke={INK} strokeWidth="1.8" />
        <path d="M-9 8l-5 7 8-2z" fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M-3.6-3.6a3.6 3.6 0 1 1 3.6 3.6v2" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="0" cy="6.4" r="1.5" fill={INK} />
      </g>
    </svg>
  );
}

/* ===== ご利用の流れ: 3ステップの絵 ===== */

export function FlowFigure({ step }: { step: 1 | 2 | 3 }) {
  if (step === 1) {
    return (
      <svg className="lp-flowfig" viewBox="0 0 132 112" role="img" aria-label="お客様がスマートフォンでお問い合わせをするイラスト">
        <g transform="translate(14,4) scale(0.95)">
          <TroubledPersonGroup kind="shufu" mood="happy" holdingPhone />
          {/* 手の位置（46,38 付近）にスマホを重ねる */}
          <g transform="rotate(16 46 34)">
            <rect x="41.5" y="25" width="9.5" height="16" rx="2.6" fill="#fff" stroke={INK} strokeWidth="1.6" />
            <rect x="43.2" y="27.5" width="6.1" height="10" rx="1" fill={TINT} />
          </g>
        </g>
        <g stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M74 26a9 9 0 0 1 5.4 6.2" />
          <path d="M80 19a16.5 16.5 0 0 1 8.4 11.4" />
        </g>
      </svg>
    );
  }
  if (step === 2) {
    return (
      <svg className="lp-flowfig" viewBox="0 0 132 112" role="img" aria-label="スタッフが確定金額のお見積もりを提示するイラスト">
        <g transform="translate(-2,4) scale(0.95)">
          <WorkerGroup pose="estimate" />
        </g>
        <g transform="translate(104,30)">
          <circle cx="0" cy="0" r="16" fill={STAR} stroke={INK} strokeWidth="1.8" />
          <path d="M-6 -1l4 4.4 8-8.4" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="lp-flowfig" viewBox="0 0 132 112" role="img" aria-label="スタッフが荷物を軽トラックへ運び出すイラスト">
      <g transform="translate(-6,6) scale(0.9)">
        <WorkerGroup pose="carry" item="sodaigomi" />
      </g>
      <MiniTruck x={62} y={56} scale={0.66} />
    </svg>
  );
}

/* ===== 料金: 軽トラの積載量図解 ===== */

const LOAD_LABEL = {
  quarter: "1点〜数点",
  half: "荷台の半分ほど",
  full: "荷台いっぱい（積み放題）",
} as const;

export function TruckLoadFigure({ level }: { level: keyof typeof LOAD_LABEL }) {
  // 荷台の内側は y8..34。底(y=34)に接地させて積む
  const boxes =
    level === "quarter"
      ? [{ x: 8, y: 21, w: 17, h: 13 }]
      : level === "half"
        ? [
            { x: 5, y: 16, w: 17, h: 18 },
            { x: 24, y: 22, w: 14, h: 12 },
          ]
        : [
            { x: 3, y: 12, w: 15, h: 22 },
            { x: 20, y: 8, w: 14, h: 26 },
            { x: 36, y: 16, w: 13, h: 18 },
            { x: 12, y: 1, w: 13, h: 11 },
          ];
  return (
    <svg className="lp-loadfig" viewBox="0 0 84 48" role="img" aria-label={`軽トラックに${LOAD_LABEL[level]}積んだ状態のイラスト`}>
      <MiniTruck x={0} y={0} scale={1} />
      {/* 積み荷は荷台の上に重ねて描く */}
      {boxes.map((b) => (
        <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={TINT} stroke={INK} strokeWidth="1.8" />
      ))}
      {/* 荷台の縁を描き直して「中に積まれている」ことを示す */}
      <rect x="0" y="8" width="52" height="26" rx="3" fill="none" stroke={INK} strokeWidth="2.4" />
    </svg>
  );
}

/* ===== 処分方法くらべ: 3コマ対比 ===== */

export function CompareTriptych({ speed }: { speed: string }) {
  return (
    <ul className="lp-compare3">
      <li>
        <svg className="lp-compare3__fig" viewBox="0 0 140 112" role="img" aria-label="自治体の粗大ごみ回収は収集日を待ち、搬出も自分で行うイラスト">
          <g transform="translate(0,6) scale(0.9)">
            <TroubledPersonGroup kind="shufu" mood="worry" />
          </g>
          <g transform="translate(74,26)">
            <rect x="0" y="0" width="52" height="46" rx="4" fill="#fff" stroke={INK} strokeWidth="2" />
            <path d="M0 13h52" stroke={INK} strokeWidth="2" />
            <rect x="9" y="-5" width="5" height="10" rx="2.5" fill={INK} />
            <rect x="38" y="-5" width="5" height="10" rx="2.5" fill={INK} />
            <g fill={COOL} opacity="0.8">
              <rect x="7" y="20" width="8" height="7" rx="1.5" />
              <rect x="19" y="20" width="8" height="7" rx="1.5" />
              <rect x="31" y="20" width="8" height="7" rx="1.5" />
              <rect x="7" y="31" width="8" height="7" rx="1.5" />
            </g>
            <rect x="19" y="31" width="20" height="7" rx="3.5" fill={ACCENT} opacity="0.9" />
          </g>
        </svg>
        <b className="lp-compare3__head">自治体の回収</b>
        <span>申し込んでから収集日まで待ち、指定場所までの搬出はご自身で</span>
      </li>
      <li>
        <svg className="lp-compare3__fig" viewBox="0 0 140 112" role="img" aria-label="自分で運び出すと階段の上げ下ろしが重労働になるイラスト">
          <g fill="#e9e3d4" stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
            <path d="M2 110V92h24V74h24V56h24v54z" />
          </g>
          <g transform="translate(44,0) scale(0.86)">
            <TroubledPersonGroup kind="tanshin" mood="worry" />
          </g>
          <rect x="58" y="46" width="30" height="22" rx="3" fill={TINT} stroke={INK} strokeWidth="2" />
        </svg>
        <b className="lp-compare3__head">ご自身で運び出す</b>
        <span>階段や玄関からの搬出は、重量物ほど体への負担と破損のリスクが大きい</span>
      </li>
      <li className="is-astra">
        <svg className="lp-compare3__fig" viewBox="0 0 140 112" role="img" aria-label="アストラのスタッフが搬出から積み込みまで対応するイラスト">
          <g transform="translate(2,6) scale(0.9)">
            <WorkerGroup pose="carry" item="sofa" />
          </g>
          <MiniTruck x={72} y={58} scale={0.66} />
          <g transform="translate(96,22)">
            <circle cx="0" cy="0" r="15" fill={STAR} stroke={INK} strokeWidth="1.8" />
            <path d="M-6 -0.5l4.2 4.5 7.8-8.2" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <b className="lp-compare3__head">アストラにおまかせ</b>
        <span>{speed}でお伺い。搬出から積み込み・処分までスタッフが対応します</span>
      </li>
    </ul>
  );
}

/* ===== 料金: お見積もりの流れ（長文の置き換え） ===== */

export function PriceFlowFigure({ itemName }: { itemName: string }) {
  return (
    <ol className="lp-priceflow" aria-label="お見積もりから作業までの流れ">
      <li>
        <svg viewBox="0 0 48 44" aria-hidden="true">
          <rect x="14" y="6" width="20" height="32" rx="4" fill="#fff" stroke={INK} strokeWidth="2.4" />
          <rect x="18" y="11" width="12" height="19" rx="1.5" fill={TINT} />
          <g stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinecap="round">
            <path d="M38 12a8 8 0 0 1 4.6 5.4" />
          </g>
        </svg>
        <b>ご連絡</b>
        <span>電話・LINE</span>
      </li>
      <li className="lp-priceflow__arrow" aria-hidden="true">
        ›
      </li>
      <li>
        <svg viewBox="0 0 48 44" aria-hidden="true">
          <rect x="7" y="5" width="26" height="32" rx="3" fill="#fff" stroke={INK} strokeWidth="2.4" />
          <path d="M13 14h14M13 20h14" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <circle cx="34" cy="30" r="11" fill={STAR} stroke={INK} strokeWidth="2.2" />
          <text x="34" y="35" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK}>
            ¥0
          </text>
        </svg>
        <b>その場で見積り</b>
        <span>出張費も0円</span>
      </li>
      <li className="lp-priceflow__arrow" aria-hidden="true">
        ›
      </li>
      <li>
        <svg viewBox="0 0 48 44" aria-hidden="true">
          <circle cx="24" cy="22" r="16" fill={TINT} stroke={INK} strokeWidth="2.4" />
          <path d="M16 22l6 6 11-12" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <b>ご納得ならGO</b>
        <span>お断りもOK</span>
      </li>
      <li className="lp-priceflow__arrow" aria-hidden="true">
        ›
      </li>
      <li className="is-goal">
        <svg viewBox="0 0 48 44" aria-hidden="true">
          <g transform="translate(-2,4) scale(0.62)">
            <MiniTruck x={0} y={0} scale={1} />
          </g>
        </svg>
        <b>作業・お支払い</b>
        <span>追加料金0円</span>
      </li>
      <p className="lp-priceflow__note">
        {itemName}1点だけでもお伺いします。金額は作業前に確定し、ご提示後の追加料金は0円です。
      </p>
    </ol>
  );
}

/* ===== お客様の声のアバター =====
 * 実在のGoogleクチコミ投稿者のため、年齢・性別を推測した似顔絵は作らない。
 * 投稿者名の頭文字＋名前から決まる配色のみで人格を出す（Google上の表示と同じ考え方）。 */

const AVATAR_COLORS = ["#2b3a55", "#a8631b", "#3c6b4a", "#6b3f7a", "#1f5f7a", "#8a3b3b"];

export function VoiceAvatar({ name }: { name: string }) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const bg = AVATAR_COLORS[h % AVATAR_COLORS.length];
  const initial = [...name.trim()][0] ?? "＊";
  return (
    <span className="lp-voices__avatar" style={{ background: bg }} aria-hidden="true">
      {initial}
    </span>
  );
}
