import { SINGLE_ITEM_PRICES } from "@/app/lib/lp-data";
import { postsForCity } from "@/app/lib/content";
import { voicesForArea } from "@/app/lib/voices";
import GoogleRatingBadge from "@/app/components/GoogleRatingBadge";
import areaDataJson from "@/content/area-data.json";

const TEL = "0120-709-333";
const TEL_HREF = "tel:0120709333";
const SITE_URL = "https://pe-astra.com";

type AreaInfo = { name: string; pref: string; comment: string };
const AREA_DATA = areaDataJson as Record<string, AreaInfo>;

/** 同一県内の近隣エリア（重複slugは市区名で一意化、自分自身は除外） */
function neighborsOf(slug: string, limit = 12): { slug: string; name: string }[] {
  const self = AREA_DATA[slug];
  if (!self) return [];
  const seen = new Set<string>([self.name]);
  const out: { slug: string; name: string }[] = [];
  for (const [s, v] of Object.entries(AREA_DATA)) {
    if (v.pref !== self.pref || seen.has(v.name)) continue;
    seen.add(v.name);
    out.push({ slug: s, name: v.name });
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * kansai-huyouhin/{市区町村} ページ末尾に付与するSEO強化セクション。
 * ①品目別参考価格のテキスト表（原典: price2.png の実在価格） ②家電リサイクル法の注意
 * ③地域FAQ（FAQPage構造化データ付き） ④パンくず構造化データ ⑤電話CTA
 * 静的HTML本文（口コミ・トラック料金画像）はそのまま、後段に追記する構成。
 */
export default function AreaSeoSections({
  city,
  slug,
  pathname,
}: {
  city: string;
  slug: string;
  pathname: string;
}) {
  const area = AREA_DATA[slug];
  const works = postsForCity(city);
  const neighbors = neighborsOf(slug);
  const faq: [string, string][] = [
    [
      `${city}はどこまで対応していますか？`,
      `${city}全域に対応しています。大阪・兵庫・京都・奈良・和歌山・滋賀の関西一円でご依頼いただけます。`,
    ],
    [
      "どのくらいで来てもらえますか？",
      `${city}を含む関西一円で即日対応が可能です。電話受付は24時間年中無休、日時指定もOKです。お引っ越しの退去日などお急ぎの場合も、まずはお電話でご相談ください。`,
    ],
    [
      "冷蔵庫や洗濯機などの家電も回収できますか？",
      "回収できます。エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/衣類乾燥機は家電リサイクル法の対象で自治体の粗大ごみに出せませんが、アストラなら面倒な手続きごとまとめて対応します。",
    ],
    [
      "料金の目安を教えてください。",
      "冷蔵庫6,000円〜・洗濯機5,000円〜・タンス3,000円〜などの参考価格をご用意しています。お見積もり・ご相談は0円、現地で確定金額をご提示し、確定後の追加料金は0円です。買取できる品は回収費用から差し引きます。",
    ],
  ];

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL + "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "関西の対応エリア",
          item: SITE_URL + "/kansai-huyouhin",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${city}の不用品回収`,
          item: SITE_URL + pathname,
        },
      ],
    },
  ];

  return (
    <section className="area-seo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <div className="area-seo__inner">
        {area ? (
          <div className="area-seo__comment">
            <span className="area-seo__comment-label">{city}のエリア担当より</span>
            <p>{area.comment}</p>
          </div>
        ) : null}

        {works.total > 0 ? (
          <>
            <h2>{city}の作業事例（実施工ブログ）</h2>
            <p>
              実際に{city}でお伺いした作業の記録です（全{works.total}件）。
            </p>
            <ul className="area-seo__works">
              {works.posts.map((p) => (
                <li key={p.path}>
                  <a href={p.path}>{p.label}</a>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h2>{city}の品目別 回収参考価格</h2>
        <p>
          {city}での単品回収の参考価格です（目安）。現地確認のうえ作業前に確定金額をご提示し、
          ご提示後の追加料金は0円。金額にご納得いただけなければその場でお断りいただけます（お見積もりは0円）。
          買取できる品は回収費用から差し引きます。
        </p>
        <div className="area-seo__table-wrap">
          <table>
            <thead>
              <tr>
                <th>品目</th>
                <th>参考価格</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {SINGLE_ITEM_PRICES.map((p) => (
                <tr key={p.slug}>
                  <td>{p.name}</td>
                  <td className="area-seo__price">{p.price}</td>
                  <td>{p.note ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="area-seo__note">
          ※料金は目安です。想定以上に作業時間がかかる場合は変動します。一覧にない品目もお気軽にご相談ください。
        </p>

        <h2>家電の処分は自治体の粗大ごみに出せません</h2>
        <p>
          エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/衣類乾燥機の4品目は家電リサイクル法の対象のため、
          {city}
          を含む各自治体の粗大ごみ回収では引き取ってもらえません。リサイクル券の手配や指定引取場所への持ち込みが必要になりますが、
          アストラにご依頼いただければ搬出から適正な処分までまとめてお任せいただけます。
        </p>

        {area ? (
          <>
            <h2>ご利用いただいたお客様の声</h2>
            <p>Googleでたくさんの高評価をいただいております。</p>
            <GoogleRatingBadge />
            <ul className="area-seo__voices">
              {voicesForArea(city, area.pref).map((v) => (
                <li key={v.name}>
                  <p>{v.text}</p>
                  <span>
                    {v.name}さん（Googleのクチコミより）
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h2>{city}の不用品回収でよくあるご質問</h2>
        <dl className="area-seo__faq">
          {faq.map(([q, a]) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>

        <div className="area-seo__cta">
          <p className="area-seo__cta-lead">
            {city}の不用品回収・遺品整理はアストラへ。お見積もり・ご相談0円です。
          </p>
          <a href={TEL_HREF} className="area-seo__tel">
            {TEL}
            <span>通話料無料・24時間365日受付・お見積もりだけでもOK</span>
          </a>
        </div>

        {neighbors.length > 0 && area ? (
          <>
            <h2>{area.pref}の近隣対応エリア</h2>
            <ul className="area-seo__neighbors">
              {neighbors.map((n) => (
                <li key={n.slug}>
                  <a href={`/kansai-huyouhin/${n.slug}`}>{n.name}の不用品回収</a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
