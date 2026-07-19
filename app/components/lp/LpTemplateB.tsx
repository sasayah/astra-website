import type { LpCity, LpItem } from "@/app/lib/lp-data";
import { SINGLE_ITEM_PRICES, priceOf, withCity } from "@/app/lib/lp-data";
import LpDisposalOptions from "@/app/components/lp/LpDisposalOptions";

const TEL = "0120-709-333";
const TEL_HREF = "tel:0120709333";
const LINE_URL = "https://line.me/R/ti/p/@raa8611w";
const UP = "/wp-content/uploads";

/* B案LP（料金表特化型）。bfh.jp/くらしのマーケットを参考にした
 * 「価格の透明性ファースト」構成。/lp/b/{item}/ で配信し、既存A案とABテストする。
 * 単品価格は lp-data.ts の SINGLE_ITEM_PRICES（★仮値・オーナー確認待ち★）。 */

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

function IcoLine({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 5.8-3.4 7.9-5.9C21.4 14.4 22 12.8 22 11c0-4.4-4.5-8-10-8z"
      />
    </svg>
  );
}

function TelBlock() {
  return (
    <div className="lpb-telblock">
      <p className="lpb-telblock__lead">お急ぎの方はお電話が最速です</p>
      <a className="lp-tel" href={TEL_HREF}>
        <span className="lp-tel__hint">通話料無料・24時間365日受付</span>
        <span className="lp-tel__num">
          <IcoPhone className="lp-tel__ico" />
          {TEL}
        </span>
        <span className="lp-tel__foot">お見積もりだけでもOK・営業のお電話は一切しません</span>
      </a>
      <a className="lp-line" href={LINE_URL} target="_blank" rel="noopener">
        <IcoLine className="lp-line__ico" />
        <span className="lp-line__body">
          <span className="lp-line__main">LINEで無料見積もり</span>
          <span className="lp-line__sub">写真を送るだけ・最速でお返事します</span>
        </span>
        <span className="lp-line__arrow">›</span>
      </a>
    </div>
  );
}

export default function LpTemplateB({ item, city }: { item: LpItem; city?: LpCity }) {
  const area = city ? city.name : "大阪";
  const lpLabel = `B:${item.name} ${area}`;
  const t = (s: string) => withCity(s, city);
  const price = priceOf(item.slug);
  return (
    <main className="lp lp--b">
      {/* ファーストビュー: 価格ファースト */}
      <section className="lpb-hero">
        <div className="lp-inner">
          <p className="lpb-hero__area">
            {area}
            {city ? "" : "・関西一円"}対応｜西淀川区役所サイネージ掲載・総合実績10,000件
          </p>
          <h1 className="lpb-hero__title">
            {area}の{item.name}
            {item.kw.split("・")[0]}
          </h1>
          <div className="lpb-price-card">
            <p className="lpb-price-card__label">{item.name}の回収 参考価格</p>
            <p className="lpb-price-card__price">
              {price ? price.price : "無料見積もり"}
              <span className="lpb-price-card__tax">目安</span>
            </p>
            {price?.note ? <p className="lpb-price-card__note">{price.note}</p> : null}
            <p className="lpb-price-card__note">
              現地でお見積もり後に確定金額をご提示。確定後の追加料金は0円です。
            </p>
            <ul className="lpb-price-card__zero">
              <li>
                見積り<strong>0円</strong>
              </li>
              <li>
                ご相談<strong>0円</strong>
              </li>
              <li>
                追加料金<strong>0円</strong>
              </li>
            </ul>
          </div>
          <TelBlock />
        </div>
      </section>

      {/* 悪徳業者注意（信頼） */}
      <section className="lpb-warn">
        <div className="lp-inner">
          <h2 className="lpb-warn__title">「無料回収」をうたう業者にご注意ください</h2>
          <p>
            トラックで巡回し「無料で回収します」と声をかけ、積み込み後に高額請求するトラブルが増えています。
            アストラは<strong>作業前に確定金額をご提示</strong>し、
            <strong>お見積もり後の追加料金は0円</strong>
            。古物商許可（第631171800026号）を取得した{area}の地元業者です。
          </p>
        </div>
      </section>

      {/* 品目別料金表 */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">PRICE LIST</span>
            品目別の回収料金目安
          </h2>
          <div className="lp-table-wrap">
            <table className="lpb-pricelist">
              <thead>
                <tr>
                  <th>品目</th>
                  <th>料金目安</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {SINGLE_ITEM_PRICES.map((p) => (
                  <tr key={p.slug} className={p.slug === item.slug ? "is-current" : ""}>
                    <td>{p.name}</td>
                    <td className="lpb-pricelist__price">{p.price}</td>
                    <td>{p.note ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="lp-works__note">
            ※上記は目安です。設置状況・搬出経路を現地で確認のうえ、<strong>作業前に確定金額をご提示</strong>します。ご提示後の追加料金は0円。金額にご納得いただけなければ、その場でお断りいただけます（お見積もりは0円です）。
          </p>
          <details className="lp-room-prices">
            <summary>全品目の参考価格表を見る（家電・家具・寝具・事務用品ほか）</summary>
            <div style={{ padding: "0 16px 16px" }}>
              <img
                src={`${UP}/2021/07/price2.png`}
                alt="参考価格一覧: TV4,000円〜 冷蔵庫6,000円〜 洗濯機5,000円〜 エアコン1,500円〜 ソファ3,000円〜 タンス3,000円〜 ベッドマット3,000円〜 ほか。一覧にないものも回収OK"
                loading="lazy"
              />
            </div>
          </details>
          <h3 className="lp-subtitle">まとめて処分ならトラック積み放題がお得</h3>
          <div className="lp-trucks">
            <img
              src={`${UP}/2021/07/s_truck.jpg`}
              alt="軽トラ 1点からでもOK 料金¥12,000〜¥30,000"
              loading="lazy"
            />
            <img
              src={`${UP}/2021/07/m_truck.jpg`}
              alt="1トントラック 目安1R〜1LDK 30,000円〜50,000円 作業費運搬費込み"
              loading="lazy"
            />
            <img
              src={`${UP}/2021/07/l_truck.jpg`}
              alt="2トントラック 目安1LDK〜3LDK 50,000円〜80,000円 作業費運搬費込み"
              loading="lazy"
            />
          </div>
          <div className="lp-sec__cta">
            <TelBlock />
          </div>
        </div>
      </section>

      {/* 自治体比較（+リサイクル法） */}
      <section className="lp-sec lp-sec--tint">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">COMPARE</span>
            {item.name}の処分方法くらべ
          </h2>
          {item.recycleLawNote ? (
            <div className="lp-law" style={{ marginBottom: 16 }}>
              <p>{t(item.recycleLawNote)}</p>
            </div>
          ) : null}
          <LpDisposalOptions item={item} />
        </div>
      </section>

      {/* 作業事例 + 実写 */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">WORKS</span>
            実際の作業事例と料金
          </h2>
          <div className="lp-works">
            <img
              src={`${UP}/2021/07/works1.jpg`}
              alt="作業事例: 1R 3人2時間作業 合計55,000円"
              loading="lazy"
            />
            <img
              src={`${UP}/2021/07/works2.jpg`}
              alt="作業事例: 3LDK 4人3時間作業 買取相殺で合計150,000円"
              loading="lazy"
            />
          </div>
          <p className="lp-works__note">
            ※当社が実際に行った作業と実際の料金です。買取品がある場合は回収費用から差し引きます。
          </p>
          <figure className="lp-photo">
            <img
              src={`${UP}/2025/01/S__206430216-1.jpg`}
              alt="大阪市西淀川区役所のデジタルサイネージで紹介されているアストラの広告"
              loading="lazy"
            />
            <figcaption>大阪市西淀川区役所のデジタルサイネージで紹介されています</figcaption>
          </figure>
        </div>
      </section>

      {/* 声 */}
      {item.voices.length > 0 ? (
        <section className="lp-sec lp-sec--tint">
          <div className="lp-inner">
            <h2 className="lp-title">
              <span className="lp-title__sub">VOICE</span>
              ご利用いただいたお客様の声
            </h2>
            <ul className="lp-voices">
              {item.voices.map((v) => (
                <li key={v.text}>
                  <p>「{t(v.text)}」</p>
                  <span>{v.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 流れ */}
      <section className="lp-sec">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">FLOW</span>
            ご利用の流れ
          </h2>
          <ol className="lp-flow">
            <li>
              <span className="lp-flow__step">STEP 1</span>
              <strong>お問い合わせ</strong>
              <p>電話・LINE・フォームからご連絡ください。</p>
            </li>
            <li>
              <span className="lp-flow__step">STEP 2</span>
              <strong>無料見積もり</strong>
              <p>作業前に確定金額をご提示。納得してから作業開始。</p>
            </li>
            <li>
              <span className="lp-flow__step">STEP 3</span>
              <strong>回収・お支払い</strong>
              <p>搬出はすべてスタッフにお任せ。クレジット払いも対応。</p>
            </li>
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-sec lp-sec--tint">
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

      {/* フォーム */}
      <section className="lp-sec lp-sec--form" id="lp-form">
        <div className="lp-inner">
          <h2 className="lp-title">
            <span className="lp-title__sub">CONTACT</span>
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
                <input type="radio" name="quantity_id" value="単品" defaultChecked />
                <span>{item.name}のみ（単品）</span>
              </label>
              <label>
                <input type="radio" name="quantity_id" value="軽トラック1台分" />
                <span>ほかにも数点まとめて（軽トラック1台分まで）</span>
              </label>
              <label>
                <input type="radio" name="quantity_id" value="2tトラック1台分" />
                <span>お部屋まるごと・大量（トラック積み放題）</span>
              </label>
            </fieldset>
            <p className="lp-form__row">
              <label htmlFor="lpb-name">お名前</label>
              <input id="lpb-name" type="text" name="name" autoComplete="name" />
            </p>
            <p className="lp-form__row">
              <label htmlFor="lpb-phone">
                電話番号<span className="lp-required">必須</span>
              </label>
              <input
                id="lpb-phone"
                type="tel"
                name="phone_number"
                required
                autoComplete="tel"
                placeholder="090-0000-0000"
              />
            </p>
            <p className="lp-form__row">
              <label htmlFor="lpb-address">エリア（市区町村）</label>
              <input
                id="lpb-address"
                type="text"
                name="address"
                defaultValue={city ? `${city.pref}${city.name}` : ""}
                placeholder={`例）${city ? city.pref + city.name : "大阪市住吉区"}`}
              />
            </p>
            <p className="lp-form__row">
              <label htmlFor="lpb-message">ご相談内容（任意）</label>
              <textarea
                id="lpb-message"
                name="message"
                rows={3}
                placeholder={`例）${item.name}の回収希望。エレベーターなし3階です。`}
              />
            </p>
            <button type="submit" className="lp-form__submit">
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
            {item.kw}は、今日アストラにお任せください
          </h2>
          <div className="lp-cta-card lp-cta-card--dark">
            <TelBlock />
          </div>
        </div>
      </section>

      {/* 追従CTA */}
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
