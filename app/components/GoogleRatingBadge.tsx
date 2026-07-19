import { GOOGLE_RATING, GOOGLE_REVIEWS_URL } from "@/app/lib/voices";

/**
 * Googleクチコミの評価バッジ（★4.9・81件）。お客様の声セクションの見出し下に置く。
 * クリックでGoogleマップのクチコミへ。
 */
export default function GoogleRatingBadge() {
  return (
    <a
      className="g-rating"
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener nofollow"
    >
      <span className="g-rating__label">
        Google<span className="g-rating__sub">クチコミ</span>
      </span>
      <span className="g-rating__stars" aria-hidden="true">
        ★★★★★
      </span>
      <span className="g-rating__score">{GOOGLE_RATING.score}</span>
      <span className="g-rating__count">{GOOGLE_RATING.count}件のクチコミ ›</span>
    </a>
  );
}
