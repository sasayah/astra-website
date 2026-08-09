import AstoKun from "@/app/components/lp/AstoKun";
import { carryPose } from "@/app/lib/lp-hitoke";
import type { AstoPose } from "@/app/components/lp/AstoKun";
import { HeroSky } from "@/app/components/lp/LpFigures";

/**
 * 「人っけ」レイヤーの部品群。
 * 憲法: キャラは親しみの装置であって実在証明ではない。
 * - キャラの吹き出し = 事業者の主張のみ（クチコミ枠とは様式を分離）
 * - 料金表・許可情報・比較表の数字ゾーンには置かない
 * - キャラ幅はモバイル画面幅の38%上限（CSS側で max-width 制御）
 */

/** ヒーローのビジュアル帯: 朝焼けクリーム空＋大阪の街並みシルエット＋アストくん＋吹き出し */
export function LpHeroVisual({ itemSlug, itemName }: { itemSlug: string; itemName: string }) {
  const pose = carryPose(itemSlug);
  return (
    <div className="lp-hv">
      {/* 背景: 朝焼けの空と大阪の街（詳細は LpFigures.HeroSky） */}
      <HeroSky />
      <div className="lp-hv__row">
        <AstoKun className="lp-hv__chara" pose={pose} item={itemSlug} />
        <p className="lp-hv__bubble">
          {itemName}、<br />
          ボクにおまかせ
          <br />
          ください！
        </p>
      </div>
    </div>
  );
}

/** 白抜き円バッジ3連（固いデザイン。キャラとペアで出す実在訴求）
 *  wide=広域LP（拠点前提の「20分」を使わず「最短当日」表記にする） */
export function LpBadges3({ wide }: { wide: boolean }) {
  return (
    <ul className="lp-badges3" aria-label="サービスの特徴">
      <li>
        <small>見積り・相談</small>
        <strong>0円</strong>
      </li>
      <li className="lp-badges3__x" aria-hidden="true">
        ×
      </li>
      <li>
        <small>追加料金</small>
        <strong>0円</strong>
      </li>
      <li className="lp-badges3__x" aria-hidden="true">
        ×
      </li>
      <li>
        <small>最短</small>
        <strong>{wide ? "当日" : "20分"}</strong>
      </li>
    </ul>
  );
}

/** セクション内のキャラ吹き出し（＝事業者の主張のみを言わせる） */
export function AstoNote({
  pose = "greet",
  children,
  small = false,
}: {
  pose?: AstoPose;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className={`lp-asto-note${small ? " lp-asto-note--sm" : ""}`}>
      <AstoKun className="lp-asto-note__chara" pose={pose} />
      <p className="lp-asto-note__bubble">{children}</p>
    </div>
  );
}

/** 電話CTA直近の「女性スタッフ在籍」可視化（有利誤認回避のため受付対応と明記） */
export function StaffNote() {
  return (
    <p className="lp-staff-note">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="lp-staff-note__ico">
        <circle cx="12" cy="9" r="4.2" fill="currentColor" />
        <path d="M4.5 20a7.5 6.5 0 0 1 15 0z" fill="currentColor" />
        <path d="M6.5 9a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="16.6" y="8" width="2.6" height="4.6" rx="1.3" fill="currentColor" />
      </svg>
      女性スタッフも在籍（受付対応）。はじめての方もご安心ください
    </p>
  );
}
