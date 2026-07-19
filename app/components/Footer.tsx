const TPL = "/wp-content/themes/ASTRA";

/** グローバルフッター（旧テーマ footer.php を移植） */
export default function Footer() {
  return (
    <footer id="gFooter">
      <div className="fBox clearfix">
        <div className="fLinkArea">
          <ul className="fNavi clearfix">
            <li>
              <ul>
                <li><a href="/">ホーム</a></li>
                <li><a href="/service">サービス紹介</a></li>
                <li><a href="/huyouhin">不用品回収</a></li>
                <li><a href="/ihinseiri">遺品整理</a></li>
                <li><a href="/news">NEWS</a></li>
                <li><a href="/blog">ブログ</a></li>
              </ul>
            </li>
            <li>
              <ul>
                <li><a href="/faq">よくある質問</a></li>
                <li><a href="/company">会社概要</a></li>
                <li><a href="/contact">お問い合わせ/お見積り</a></li>
                <li><a href="/policy">個人情報保護方針</a></li>
              </ul>
            </li>
          </ul>
          <ul className="snsList clearfix">
            <li><a href="https://www.instagram.com/pe.astra/" target="_blank" rel="noopener"><img src={`${TPL}/img/common/f_sns01.png`} alt="ins" /></a></li>
            <li><a href="https://www.facebook.com/%E9%81%BA%E5%93%81%E6%95%B4%E7%90%86%E3%82%A2%E3%82%B9%E3%83%88%E3%83%A9-236892510531494/" target="_blank" rel="noopener"><img src={`${TPL}/img/common/f_sns02.png`} alt="f" /></a></li>
            <li><a href="https://line.me/R/ti/p/@raa8611w" target="_blank" rel="noopener"><img src={`${TPL}/img/common/f_sns03.png`} alt="@" /></a></li>
          </ul>
        </div>
        <div className="fLogoBox">
          <div className="fLogo">
            <a href="/">
              <img src={`${TPL}/img/common/f_logo.png`} alt="不用品回収・遺品整理は安心価格のアストラに！" className="pc" />
              <img src={`${TPL}/img/common/sp_f_logo.png`} alt="不用品回収・遺品整理は安心価格のアストラに！" className="sp" />
            </a>
            <span className="txt">古物商許可証番号 第631171800026号</span>
          </div>
          <p className="address pc">〒555-0012　大阪府大阪市西淀川区御幣島4-10-17</p>
        </div>
      </div>
      <div className="tel">
        <a href="tel:0120709333">0120-709-333</a>
        <span className="txt">受付時間：年中無休 24時間 即日対応</span>
      </div>
      <p className="address sp">〒555-0012　大阪府大阪市西淀川区御幣島4-10-17</p>
      <p className="copyright">Copyright (C) 不用品回収・遺品整理アストラ All Rights Reserved.</p>
    </footer>
  );
}
