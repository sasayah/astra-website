import type { LpCity, LpItem } from "@/app/lib/lp-data";
import { lpCopy } from "@/app/lib/lp-data";
import LpDisposalOptions from "@/app/components/lp/LpDisposalOptions";
import { voicesForItem } from "@/app/lib/voices";
import GoogleRatingBadge from "@/app/components/GoogleRatingBadge";

const TEL = "0120-709-333";
const TEL_HREF = "tel:0120709333";
const LINE_URL = "https://line.me/R/ti/p/@raa8611w";
const UP = "/wp-content/uploads";

/** トップページ掲載の間取り別料金（部屋まるごとの場合の実在の目安） */
const ROOM_PRICES: [string, string][] = [
  ["1K", "35,000円〜"],
  ["1DK", "60,000円〜"],
  ["1LDK", "80,000円〜"],
  ["2DK", "120,000円〜"],
  ["2LDK", "140,000円〜"],
  ["3DK", "160,000円〜"],
  ["3LDK", "180,000円〜"],
];

/* ---- inline icons（外部依存なし） ---- */

function IcoPhone({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"
      />
    </svg>
  );
}

function IcoCheck({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.2-4.1-4.1 1.4-1.4 2.7 2.7 5.8-5.8 1.4 1.4-7.2 7.2z"
      />
    </svg>
  );
}

function IcoLine({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 5.8-3.4 7.9-5.9C21.4 14.4 22 12.8 22 11c0-4.4-4.5-8-10-8zM8.8 13.3H6.9a.5.5 0 0 1-.5-.5V9.1a.5.5 0 0 1 1 0v3.2h1.4a.5.5 0 0 1 0 1zm1.8-.5a.5.5 0 0 1-1 0V9.1a.5.5 0 0 1 1 0v3.7zm4.5 0a.5.5 0 0 1-.9.3l-1.9-2.6v2.3a.5.5 0 0 1-1 0V9.1a.5.5 0 0 1 .9-.3l1.9 2.6V9.1a.5.5 0 0 1 1 0v3.7zm3-2.4a.5.5 0 0 1 0 1h-1.4v.9h1.4a.5.5 0 0 1 0 1h-1.9a.5.5 0 0 1-.5-.5V9.1a.5.5 0 0 1 .5-.5h1.9a.5.5 0 0 1 0 1h-1.4v.8h1.4z"
      />
    </svg>
  );
}

/* ---- CTA ---- */

function TelButton() {
  return (
    <a className="lp-tel" href={TEL_HREF}>
      <span className="lp-tel__hint">通話料無料・24時間365日受付</span>
      <span className="lp-tel__num">
        <IcoPhone className="lp-tel__ico" />
        {TEL}
      </span>
      <span className="lp-tel__foot">お見積もりだけでもOK・営業のお電話は一切しません</span>
    </a>
  );
}

function LineButton() {
  return (
    <a className="lp-line" href={LINE_URL} target="_blank" rel="noopener">
      <IcoLine className="lp-line__ico" />
      <span className="lp-line__body">
        <span className="lp-line__main">LINEで無料見積もり</span>
        <span className="lp-line__sub">写真を送るだけ・最速でお返事します</span>
      </span>
      <span className="lp-line__arrow">›</span>
    </a>
  );
}

export default function LpTemplate({ item, city }: { item: LpItem; city?: LpCity }) {
  const area = city ? city.name : (item.area ?? "大阪");
  // 広域LP（関西全域配信の広告の受け皿）では拠点前提の「最短20分」を使わない
  const wide = !city && item.area != null;
  const speed = wide ? "最短当日" : "最短20分";
  const lpLabel = `${item.name}${item.kw} ${area}`;
  // 品目コピーの全フィールドで {city} 置換＋広域LPの速度表現差し替えを行う
  const t = (s: string) => lpCopy(s, item, city);
  const merits: [string, string][] = [
    wide ? ["最短当日", "回収OK"] : ["最短20分", "即日回収OK"],
    ["追加料金", "0円"],
    ["見積り・相談", "0円"],
    [`${area}全域`, "対応"],
  ];
  return (
    <main className="lp">
      {/* ファーストビュー */}
      <section className="lp-hero">
        <div className="lp-inner">
          <p className="lp-hero__badge">
            <IcoCheck className="lp-hero__badge-ico" />
            大阪市西淀川区役所のサイネージで紹介中
          </p>
          <h1 className="lp-hero__title">{t(item.h1)}</h1>
          <ul className="lp-merits">
            {merits.map(([a, b]) => (
              <li key={a}>
                <strong>{a}</strong>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="lp-hero__lead">{t(item.lead)}</p>
          <div className="lp-cta-card">
            <TelButton />
            <LineButton />
            <p className="lp-cta-card__note">
              買取できる{item.name}は<strong>買取額でお値引き</strong>
              。まずは状態をお知らせください。
            </p>
          </div>
          <img
            className="lp-banner"
            src={`${UP}/2022/01/amazon2.jpeg`}
            alt="期間限定 無料訪問見積もりの際、もれなく全員にAmazonギフト券1,000円分プレゼント。まずはお気軽にお電話を 0120-709-333"
          />
        </div>
      </section>

      {/* 実績バー */}
      <div className="lp-stats">
        <div className="lp-inner lp-stats__row">
          <div className="lp-stats__item">
            <span className="lp-stats__label">総合実績</span>
            <span className="lp-stats__value">
              <em>10,000</em>件
            </span>
          </div>
          <div className="lp-stats__item">
            <span className="lp-stats__label">お客様満足度</span>
            <span className="lp-stats__value">
              <em>98.8</em>%
            </span>
          </div>
          <div className="lp-stats__item">
            <span className="lp-stats__label">電話受付</span>
            <span className="lp-stats__value">
              <em>24</em>時間365日
            </span>
          </div>
        </div>
      </div>

      {/* お悩み */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">CHECK</span>
            こんなお困りごとはありませんか？
          </h2>
          <ul className="lp-pains">
            {item.pains.map((p) => (
              <li key={p}>
                <IcoCheck className="lp-pains__ico" />
                {t(p)}
              </li>
            ))}
          </ul>
          <div className="lp-answer">
            <p className="lp-answer__arrow" aria-hidden="true" />
            <p className="lp-answer__text">
              その{item.name}、アストラが
              <strong>搬出から回収まで丸ごと</strong>お引き受けします
            </p>
          </div>
        </div>
      </section>

      {/* 選ばれる理由 */}
      <section className="lp-sec lp-sec--tint">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">REASON</span>
            {area}で{item.name}の{item.kw}なら
            <br />
            アストラが選ばれる理由
          </h2>
          <ol className="lp-reasons">
            {[
              ...item.points,
              "女性スタッフ在籍。女性のおひとり暮らしやご年配の方のお宅への訪問も安心です。",
            ].map((p, i) => (
              <li key={p}>
                <span className="lp-reasons__num">{String(i + 1).padStart(2, "0")}</span>
                <p>{t(p)}</p>
              </li>
            ))}
          </ol>
          <figure className="lp-photo">
            <img
              src={`${UP}/2021/06/1624678116531.jpg`}
              alt="回収作業を終えたアストラのスタッフとお客様"
              loading="lazy"
            />
            <figcaption>作業後のお客様と回収スタッフ（実際の現場より）</figcaption>
          </figure>
        </div>
      </section>

      {/* リサイクル法の注意（対象品目のみ） */}
      {item.recycleLawNote ? (
        <section className="lp-sec">
          <div className="lp-inner">
            <h2 className="lp-title">
              <span className="lp-title__sub">POINT</span>
              {item.name}の処分で知っておきたいこと
            </h2>
            <div className="lp-law">
              <p>{t(item.recycleLawNote)}</p>
            </div>
          </div>
        </section>
      ) : null}

      {/* 料金 */}
      <section className="lp-sec lp-sec--tint">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">PRICE</span>
            料金について
          </h2>
          <p className="lp-price__intro">
            {item.name}
            1点だけでも喜んでお伺いします。サイズ・階数・搬出経路を確認のうえ、
            <strong>作業前にその場で確定金額</strong>
            をご提示。確定後の追加料金は0円で、金額にご納得いただけなければその場でお断りいただけます（お見積もりは0円です）。
          </p>
          <div className="lp-trucks">
            <img
              src={`${UP}/2021/07/s_truck.jpg`}
              alt="軽トラ 1点からでもOK 料金¥12,000〜¥30,000 買取のみもOK・家電など年式によっては無料回収します"
              loading="lazy"
            />
            <img
              src={`${UP}/2021/07/m_truck.jpg`}
              alt="1トントラック 目安1R〜1LDKくらいのお荷物 30,000円〜50,000円 作業費運搬費込み・大型家電もおまかせ・簡単なお掃除付き"
              loading="lazy"
            />
            <img
              src={`${UP}/2021/07/l_truck.jpg`}
              alt="2トントラック 目安1LDK〜3LDKくらいのお荷物 50,000円〜80,000円 作業費運搬費込み・お部屋まるごとOK・簡単なお掃除付き"
              loading="lazy"
            />
          </div>
          <details className="lp-room-prices">
            <summary>お部屋まるごと処分の場合の料金目安を見る</summary>
            <div className="lp-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>間取り</th>
                    <th>料金目安</th>
                  </tr>
                </thead>
                <tbody>
                  {ROOM_PRICES.map(([room, price]) => (
                    <tr key={room}>
                      <td>{room}</td>
                      <td>{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <h3 className="lp-subtitle">{item.name}の処分方法くらべ</h3>
          <LpDisposalOptions item={item} />
          <div className="lp-sec__cta">
            <p className="lp-cta-lead">今お電話いただければ、{speed}でお伺いできます</p>
            <TelButton />
            <p className="lp-cta-sub">＼電話が苦手な方は／</p>
            <LineButton />
          </div>
        </div>
      </section>

      {/* 作業事例 */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">WORKS</span>
            実際の作業事例
          </h2>
          <div className="lp-works">
            <figure>
              <img
                src={`${UP}/2021/07/works1.jpg`}
                alt="作業事例ビフォーアフター: 1R 3人2時間作業 合計55,000円"
                loading="lazy"
              />
              <figcaption>1R・スタッフ3名/2時間 → 合計55,000円</figcaption>
            </figure>
            <figure>
              <img
                src={`${UP}/2021/07/works2.jpg`}
                alt="作業事例ビフォーアフター: 3LDK 4人3時間作業 小計175,000円から買取25,000円を差し引き合計150,000円"
                loading="lazy"
              />
              <figcaption>3LDK・スタッフ4名/3時間 → 買取▲25,000円で合計150,000円</figcaption>
            </figure>
          </div>
          <p className="lp-works__note">
            ※当社が実際に行った作業と実際の料金です。買取品がある場合は回収費用から差し引きます。
          </p>
        </div>
      </section>

      {/* 市役所トラスト */}
      <section className="lp-sec lp-sec--tint">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">TRUST</span>
            大阪市役所で紹介中のサービスです
          </h2>
          <figure className="lp-photo">
            <img
              src={`${UP}/2025/01/S__206430216-1.jpg`}
              alt="大阪市西淀川区役所のデジタルサイネージで紹介されているアストラの広告"
              loading="lazy"
            />
            <figcaption>
              大阪市西淀川区役所のデジタルサイネージで紹介されています
            </figcaption>
          </figure>
          <p className="lp-trust__text">
            アストラは大阪市西淀川区に拠点を置く地元の回収業者です。古物商許可（第631171800026号）を取得し、
            法令に沿った適正な回収・処分を行っています。
          </p>
        </div>
      </section>

      {/* ご利用の流れ */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">FLOW</span>
            ご利用の流れ（最短3ステップ）
          </h2>
          <ol className="lp-flow">
            <li>
              <span className="lp-flow__step">STEP 1</span>
              <strong>お問い合わせ</strong>
              <p>電話・LINE・フォームからご連絡。写真があるとスムーズです。</p>
            </li>
            <li>
              <span className="lp-flow__step">STEP 2</span>
              <strong>無料見積もり</strong>
              <p>確定金額をご提示。ご納得いただいてから作業します。</p>
            </li>
            <li>
              <span className="lp-flow__step">STEP 3</span>
              <strong>回収作業</strong>
              <p>{speed}でお伺い。搬出はすべてスタッフにお任せください。</p>
            </li>
          </ol>
        </div>
      </section>

      {/* お客様の声（品目×地域で出し分け） */}
      {(() => {
        const voices = voicesForItem(item.slug, city?.name, city?.pref ?? "大阪府");
        if (voices.length === 0) return null;
        return (
          <section className="lp-sec lp-sec--tint">
            <div className="lp-inner">
              <h2 className="lp-title">
                <span className="lp-title__sub">VOICE</span>
                ご利用いただいたお客様の声
              </h2>
              <p className="lp-voices__lead">
                Googleでたくさんの高評価をいただいております
              </p>
              <GoogleRatingBadge />
              <ul className="lp-voices">
                {voices.map((v) => (
                  <li key={v.name}>
                    <p>{v.text}</p>
                    <div className="lp-voices__meta">
                      <svg className="lp-voices__ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2.5c-4 0-8 2-8 4.5v2h16v-2c0-2.5-4-4.5-8-4.5z"
                        />
                      </svg>
                      <span>
                        {v.name}さん<small>Googleのクチコミより</small>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })()}

      {/* FAQ */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">FAQ</span>
            よくあるご質問
          </h2>
          <div className="lp-faq">
            {item.faq.map((f) => (
              <details key={f.q}>
                <summary>{t(f.q)}</summary>
                <p>{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 見積りフォーム */}
      <section className="lp-sec lp-sec--form" id="lp-form">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">CONTACT</span>
            {area}の{item.name}
            {item.kw}
            <br />
            無料見積もりフォーム
          </h2>
          <p className="lp-form__caption">
            営業のお電話は一切いたしません。お急ぎの方はお電話（
            <a href={TEL_HREF}>{TEL}</a>）が最速です。
          </p>
          <form action="" method="post" className="simple_form lp-form">
            <input type="hidden" name="service_id" value="不用品回収" />
            <input type="hidden" name="lp" value={lpLabel} />
            <fieldset>
              <legend>
                回収量<span className="lp-required">必須</span>
              </legend>
              <label>
                <input type="radio" name="quantity_id" className="input-service" value="単品" defaultChecked />
                <span>{item.name}のみ（単品）</span>
              </label>
              <label>
                <input type="radio" name="quantity_id" className="input-service" value="軽トラック1台分" />
                <span>ほかにも数点まとめて（軽トラック1台分まで）</span>
              </label>
              <label>
                <input type="radio" name="quantity_id" className="input-service" value="2tトラック1台分" />
                <span>お部屋まるごと・大量（トラック積み放題）</span>
              </label>
            </fieldset>
            <p className="lp-form__row">
              <label htmlFor="lp-name">お名前</label>
              <input id="lp-name" type="text" name="name" autoComplete="name" />
            </p>
            <p className="lp-form__row">
              <label htmlFor="lp-phone">
                電話番号<span className="lp-required">必須</span>
              </label>
              <input
                id="lp-phone"
                type="tel"
                name="phone_number"
                required
                autoComplete="tel"
                placeholder="090-0000-0000"
              />
            </p>
            <p className="lp-form__row">
              <label htmlFor="lp-address">エリア（市区町村）</label>
              <input
                id="lp-address"
                type="text"
                name="address"
                defaultValue={city ? `${city.pref}${city.name}` : ""}
                placeholder={`例）${city ? city.pref + city.name : "大阪市住吉区"}`}
              />
            </p>
            <p className="lp-form__row">
              <label htmlFor="lp-message">ご相談内容（任意）</label>
              <textarea
                id="lp-message"
                name="message"
                rows={3}
                placeholder={`例）${item.name}の回収希望。エレベーターなし3階です。`}
              />
            </p>
            {/* id=submit_button はGTMのCVトリガー（Click ID）が参照している */}
            <button type="submit" id="submit_button" className="lp-form__submit">
              無料見積もりを依頼する（0円）
            </button>
            <p className="lp-form__privacy">
              ご入力いただいた情報はお見積もりのご連絡のみに使用します。
            </p>
          </form>
        </div>
      </section>

      {/* クロージング */}
      <section className="lp-closing">
        <div className="lp-inner">
          <h2 className="lp-closing__title">
            {area}の{item.name}
            {item.kw}は、
            <br />
            今日アストラにお任せください
          </h2>
          <div className="lp-cta-card lp-cta-card--dark">
            <TelButton />
            <LineButton />
          </div>
        </div>
      </section>

      {/* 追従フッターCTA（モバイル） */}
      <nav className="lp-sticky" aria-label="お問い合わせ">
        <a href={TEL_HREF} className="lp-sticky__tel">
          <IcoPhone className="lp-sticky__ico" />
          <span>
            <strong>{TEL}</strong>
            <small>タップで電話・24時間受付</small>
          </span>
        </a>
        <a href={LINE_URL} target="_blank" rel="noopener" className="lp-sticky__line">
          <IcoLine className="lp-sticky__ico" />
          <span>
            <strong>LINE見積り</strong>
            <small>写真でOK</small>
          </span>
        </a>
      </nav>
    </main>
  );
}
