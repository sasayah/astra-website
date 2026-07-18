import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ContactForms from "@/app/components/ContactForms";
import Analytics from "@/app/components/Analytics";
import YahooTag from "@/app/components/YahooTag";
import "./globals.css";

const TPL = "/wp-content/themes/ASTRA";

export const metadata: Metadata = {
  metadataBase: new URL("https://pe-astra.com"),
  title:
    "リサイクル・不用品回収 アストラ ｜近畿一円の不用品回収、遺品整理、処分、生前整理",
  description:
    "近畿一円の不用品回収、遺品整理、生前整理はアストラにお任せください。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Analytics />
        <YahooTag />
        {/* 旧テーマのスタイル一式（React 19 が head へホイスト。相対 url() を保つため /public から配信） */}
        <link rel="stylesheet" href={`${TPL}/style.css`} />
        <link rel="stylesheet" href={`${TPL}/js/slick/slick.css`} />
        <link rel="stylesheet" href={`${TPL}/js/jquery.fancybox.css`} />

        <div id="container">
          <Header />
          {children}
          <Footer />
        </div>
        <ContactForms />

        {/* jQuery を先に確定ロード → プラグインを afterInteractive で登録 →
            それらに依存する common.js は lazyOnload で最後に実行（matchHeight未定義エラー回避）。 */}
        <Script src={`${TPL}/js/jquery.js`} strategy="beforeInteractive" />
        <Script src={`${TPL}/js/slick/slick.js`} strategy="afterInteractive" />
        <Script src={`${TPL}/js/jquery.matchHeight.js`} strategy="afterInteractive" />
        <Script src={`${TPL}/js/jquery.fancybox.js`} strategy="afterInteractive" />
        <Script src={`${TPL}/js/common.js`} strategy="lazyOnload" />
      </body>
    </html>
  );
}
