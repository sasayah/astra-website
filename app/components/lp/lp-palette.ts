/**
 * LPイラスト（アストくん・人物・図解）の共通パレット。
 * 全アセットをこの5+補助色に収めることで「フリー素材の寄せ集め」化を防ぐ。
 * lp.css 側の --lp-star 等と対応させること（値の二重管理を避けるため参照はここに集約）。
 */

export const INK = "#2f3b52"; // 全アセット共通の輪郭線
export const NAVY = "#2b3a55"; // 作業服
export const STAR = "#ffc53d"; // ロゴの流れ星
export const TRAIL = "#ffd97a"; // 流れ星の尾・スピード線
export const ACCENT = "#e85d10"; // 反射ライン・CTA同系
export const BOOT = "#7a5236";
export const CHEEK = "#f6a57c";

/** 人物 */
export const SKIN = "#f7d5b5";
export const HAIR_DARK = "#4a3b32";
export const HAIR_GRAY = "#a9a49c";
/** 困りゾーンは寒色グレー（アストラ側の暖色と対比させる） */
export const COOL = "#8fa3b0";
export const COOL_DARK = "#78909f";

/** 図解の面 */
export const PAPER = "#fff";
export const TINT = "#fff3d0";
export const SHADE = "#00000014";
