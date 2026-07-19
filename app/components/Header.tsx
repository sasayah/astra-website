const TPL = "/wp-content/themes/ASTRA";

/**
 * グローバルヘッダー（旧テーマ header.php を移植）。
 * 遷移は旧サイト同様フルリロード（<a>）にして、各ページのインラインスクリプト/
 * フォームハンドラの再適用を確実にする。
 */
export default function Header() {
  return (
    <header id="gHeader">
      <div className="hBox clearfix">
        <div className="header-badge-container">
          <a href="/">
            <img
              src="/wp-content/uploads/2021/08/logo-1.jpeg"
              width={220}
              alt="不用品回収・遺品整理は安心価格のアストラに！ASTRA"
            />
          </a>
          <span className="txt header-badge">古物商許可証番号 第631171800026号</span>
        </div>
        <div className="rBox clearfix">
          <div className="clearfix">
            <div className="topBox clearfix">
              <div className="txtBox">
                <span className="txt">クレジット払い対応可能</span>
                <img src={`${TPL}/img/common/img01.jpg`} width={174} alt="クレジット払い対応可能" />
              </div>
              <div className="telBox">
                <a href="tel:0120709333">0120-709-333</a>
                <span className="txt">受付時間：年中無休 24時間 即日対応</span>
              </div>
              <div className="contact">
                <a href="/contact">
                  <img src={`${TPL}/img/common/contact.jpg`} width={311} alt="お見積りご相談無料 お問い合わせ/お見積り" className="pc" />
                  <img src={`${TPL}/img/common/sp_contact.png`} alt="お見積りご相談無料 お問い合わせ/お見積り" className="sp" />
                </a>
              </div>
            </div>
          </div>
          <div className="linkArea clearfix">
            <nav id="gNavi">
              <ul className="clearfix">
                <li>
                  <a href="/service">サービス紹介</a>
                  <ul className="subNavi">
                    <li><a href="/huyouhin">不用品回収</a></li>
                    <li><a href="/ihinseiri">遺品整理</a></li>
                    <li><a href="/service/#a01">特殊清掃</a></li>
                    <li><a href="/service/#a02">解体・リフォーム</a></li>
                  </ul>
                </li>
                <li><a href="/news">NEWS</a></li>
                <li><a href="/blog">ブログ</a></li>
                <li><a href="/faq">よくある質問</a></li>
                <li><a href="/company">会社概要</a></li>
              </ul>
            </nav>
            <ul className="snsList clearfix">
              <li><a href="https://www.instagram.com/pe.astra/" target="_blank" rel="noopener"><img src={`${TPL}/img/common/sns01.png`} alt="INS" /></a></li>
              <li><a href="https://www.facebook.com/%E9%81%BA%E5%93%81%E6%95%B4%E7%90%86%E3%82%A2%E3%82%B9%E3%83%88%E3%83%A9-236892510531494/" target="_blank" rel="noopener"><img src={`${TPL}/img/common/sns02.png`} alt="f" /></a></li>
              <li><a href="https://line.me/R/ti/p/@raa8611w" target="_blank" rel="noopener"><img src={`${TPL}/img/common/sns03.png`} alt="@" /></a></li>
            </ul>
          </div>
        </div>
        <div className="menu sp"><a href="#"><img src={`${TPL}/img/common/menu.png`} width={45} alt="MENU" /></a></div>
      </div>
      <div className="menuBox">
        <ul className="navi">
          <li>
            <a href="/service">サービス紹介</a>
            <span className="ico"></span>
            <ul className="subNavi">
              <li><a href="/huyouhin">不用品回収</a></li>
              <li><a href="/ihinseiri">遺品整理</a></li>
              <li><a href="/service/#a01">特殊清掃</a></li>
              <li><a href="/service/#a02">解体・リフォーム</a></li>
            </ul>
          </li>
          <li><a href="/news">NEWS</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/faq">よくある質問</a></li>
          <li><a href="/company">会社概要</a></li>
          <li><a href="/contact">お問い合わせ</a></li>
        </ul>
        <ul className="sns">
          <li><a href="https://line.me/R/ti/p/@raa8611w" target="_blank" rel="noopener"><img src={`${TPL}/img/common/sns03.png`} alt="@" /></a></li>
          <li><a href="https://www.facebook.com/%E9%81%BA%E5%93%81%E6%95%B4%E7%90%86%E3%82%A2%E3%82%B9%E3%83%88%E3%83%A9-236892510531494/" target="_blank" rel="noopener"><img src={`${TPL}/img/common/sns02.png`} alt="f" /></a></li>
          <li><a href="https://www.instagram.com/pe.astra/" target="_blank" rel="noopener"><img src={`${TPL}/img/common/sns01.png`} alt="INS" /></a></li>
        </ul>
        <div className="tel">
          <a href="tel:0120709333">
            <div style={{ display: "none" }}>0120-709-333</div>
            <img src={`${TPL}/img/common/sp_tel.png`} width={268} alt="0120-709-333 受付時間：年中無休 24時間 即日対応" />
          </a>
        </div>
        <div className="close"><a href="#"><img src={`${TPL}/img/common/close.png`} alt="CLOSE" width={58} /></a></div>
      </div>
    </header>
  );
}
