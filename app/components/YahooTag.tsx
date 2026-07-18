import Script from "next/script";

/**
 * LINEヤフー広告 サイトジェネラルタグ（ytag）。
 * 旧WordPressサイトは全ページのheadに無条件で設置していたため同じ挙動にする。
 * コンバージョン発火自体は GTM（tel:/line.meクリック、/contact/thanks PV）と
 * app/lib/yahoo.ts の fireYahooFormConversion() が担う。
 */
export default function YahooTag() {
  return (
    <>
      <Script
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
        strategy="afterInteractive"
      />
      <Script id="ytag-base" strategy="afterInteractive">
        {`window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie","config":{"ycl_use_non_cookie_storage":true}});`}
      </Script>
    </>
  );
}
