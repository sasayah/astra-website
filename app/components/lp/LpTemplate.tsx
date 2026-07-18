import type { LpCity, LpItem } from "@/app/lib/lp-data";
import { withCity } from "@/app/lib/lp-data";

const TEL = "0120-709-333";
const TEL_HREF = "tel:0120709333";
const LINE_URL = "https://line.me/R/ti/p/@raa8611w";

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

function TelButton({ large = false }: { large?: boolean }) {
  return (
    <a className={`lp-cta lp-cta--tel${large ? " lp-cta--large" : ""}`} href={TEL_HREF}>
      <span className="lp-cta__label">電話で無料相談（24時間365日）</span>
      <span className="lp-cta__main">{TEL}</span>
    </a>
  );
}

function LineButton({ large = false }: { large?: boolean }) {
  return (
    <a
      className={`lp-cta lp-cta--line${large ? " lp-cta--large" : ""}`}
      href={LINE_URL}
      target="_blank"
      rel="noopener"
    >
      <span className="lp-cta__label">写真を送るだけ・最速見積り</span>
      <span className="lp-cta__main">LINEで無料見積り</span>
    </a>
  );
}

export default function LpTemplate({ item, city }: { item: LpItem; city?: LpCity }) {
  const area = city ? city.name : "大阪";
  const lpLabel = `${item.name}${item.kw} ${area}`;
  // 品目コピーの全フィールドで {city} トークンを地域名に置換する
  const t = (s: string) => withCity(s, city);
  return (
    <main className="lp-page">
      {/* ファーストビュー */}
      <section className="lp-hero">
        <p className="lp-hero__badge">大阪市役所で紹介中の安心サービス</p>
        <h1 className="lp-hero__title">{t(item.h1)}</h1>
        <ul className="lp-hero__chips">
          <li>最短20分〜 即日回収</li>
          <li>追加料金0円</li>
          <li>お見積もり・ご相談0円</li>
          <li>{area}全域対応</li>
        </ul>
        <p className="lp-hero__lead">{t(item.lead)}</p>
        <div className="lp-hero__cta">
          <TelButton large />
          <LineButton large />
        </div>
        <p className="lp-hero__note">
          買取可能な{item.name}は買取金額でお値引き。まずは状態をお知らせください。
        </p>
      </section>

      {/* お悩み */}
      <section className="lp-sec">
        <h2 className="lp-sec__title">こんなお困りごとはありませんか？</h2>
        <ul className="lp-pains">
          {item.pains.map((p) => (
            <li key={p}>{t(p)}</li>
          ))}
        </ul>
        <p className="lp-sec__answer">
          その{item.name}、アストラが<strong>搬出から回収まで丸ごと</strong>お引き受けします。
        </p>
      </section>

      {/* 選ばれる理由 */}
      <section className="lp-sec lp-sec--tint">
        <h2 className="lp-sec__title">
          {area}で{item.name}の{item.kw}ならアストラ
        </h2>
        <ol className="lp-points">
          {item.points.map((p) => (
            <li key={p}>{t(p)}</li>
          ))}
          <li>女性スタッフ在籍。丁寧・迅速な対応を心がけています。</li>
          <li>日時指定OK・電話受付は24時間年中無休。お急ぎにも対応します。</li>
        </ol>
      </section>

      {/* リサイクル法の注意（対象品目のみ） */}
      {item.recycleLawNote ? (
        <section className="lp-sec">
          <h2 className="lp-sec__title">{item.name}の処分で知っておきたいこと</h2>
          <p className="lp-law">{t(item.recycleLawNote)}</p>
        </section>
      ) : null}

      {/* 行政回収との比較 */}
      <section className="lp-sec">
        <h2 className="lp-sec__title">自治体の粗大ごみ回収との違い</h2>
        <div className="lp-table-wrap">
          <table className="lp-compare">
            <thead>
              <tr>
                <th></th>
                <th className="lp-compare__astra">アストラ</th>
                <th>自治体の回収</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>スピード</th>
                <td className="lp-compare__astra">最短20分〜・即日OK</td>
                <td>事前申込・指定日まで待つ</td>
              </tr>
              <tr>
                <th>搬出</th>
                <td className="lp-compare__astra">スタッフが室内から搬出</td>
                <td>指定場所まで自分で運ぶ</td>
              </tr>
              <tr>
                <th>日時指定</th>
                <td className="lp-compare__astra">いつでも指定OK</td>
                <td>不可（地域の指定日）</td>
              </tr>
              <tr>
                <th>費用</th>
                <td className="lp-compare__astra">
                  追加料金0円（買取相殺で総費用0円になる場合も）
                </td>
                <td>品目ごとに手数料</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 料金の考え方 */}
      <section className="lp-sec lp-sec--tint">
        <h2 className="lp-sec__title">料金について</h2>
        <p>
          {item.name}
          1点だけでも喜んでお伺いします。サイズ・階数・搬出経路を確認のうえ、
          <strong>作業前にその場で確定金額</strong>をご提示。作業後の追加料金は0円です。
          LINEで写真をお送りいただければ、最速でお見積りをご返信します。
        </p>
        <details className="lp-room-prices">
          <summary>お部屋まるごと処分の場合の料金目安はこちら</summary>
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
        <div className="lp-sec__cta">
          <LineButton />
        </div>
      </section>

      {/* ご利用の流れ */}
      <section className="lp-sec">
        <h2 className="lp-sec__title">ご利用の流れ（最短3ステップ）</h2>
        <ol className="lp-flow">
          <li>
            <strong>お問い合わせ</strong>
            <span>電話・LINE・フォームからご連絡。写真があるとスムーズです。</span>
          </li>
          <li>
            <strong>無料見積り</strong>
            <span>確定金額をご提示。内容にご納得いただいてから作業します。</span>
          </li>
          <li>
            <strong>回収作業</strong>
            <span>最短20分でお伺い。搬出もすべてスタッフにお任せください。</span>
          </li>
        </ol>
      </section>

      {/* お客様の声（実在の声のみ） */}
      {item.voices.length > 0 ? (
        <section className="lp-sec lp-sec--tint">
          <h2 className="lp-sec__title">ご利用いただいたお客様の声</h2>
          <ul className="lp-voices">
            {item.voices.map((v) => (
              <li key={v.text}>
                <p>「{t(v.text)}」</p>
                <span>{v.meta}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="lp-sec">
        <h2 className="lp-sec__title">よくあるご質問</h2>
        <dl className="lp-faq">
          {item.faq.map((f) => (
            <div key={f.q}>
              <dt>{t(f.q)}</dt>
              <dd>{t(f.a)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 見積りフォーム */}
      <section className="lp-sec lp-sec--form" id="lp-form">
        <h2 className="lp-sec__title">
          {area}の{item.name}
          {item.kw}・無料見積りフォーム
        </h2>
        <p className="lp-form__caption">
          営業のお電話は一切いたしません。お急ぎの方はお電話（{TEL}）が最速です。
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
            <input id="lp-address" type="text" name="address" defaultValue={city ? `${city.pref}${city.name}` : ""} placeholder={`例）${city ? city.pref + city.name : "大阪市住吉区"}`} />
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
          <button type="submit" className="lp-form__submit">
            無料見積りを依頼する（0円）
          </button>
        </form>
      </section>

      {/* クロージング */}
      <section className="lp-sec lp-closing">
        <h2 className="lp-sec__title">
          {area}の{item.name}
          {item.kw}は、今日アストラにお任せください
        </h2>
        <div className="lp-hero__cta">
          <TelButton large />
          <LineButton large />
        </div>
      </section>

      {/* 追従フッターCTA（モバイル） */}
      <div className="lp-sticky-cta">
        <a href={TEL_HREF} className="lp-sticky-cta__tel">
          電話で相談
        </a>
        <a href={LINE_URL} target="_blank" rel="noopener" className="lp-sticky-cta__line">
          LINE見積り
        </a>
        <a href="#lp-form" className="lp-sticky-cta__form">
          フォーム
        </a>
      </div>
    </main>
  );
}
