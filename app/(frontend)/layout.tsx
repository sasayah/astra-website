import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ContactForms from "@/app/components/ContactForms";
import Analytics from "@/app/components/Analytics";
import YahooTag from "@/app/components/YahooTag";
import "./globals.css";

const TPL = "/wp-content/themes/ASTRA";

/** LocalBusiness 構造化データ（値の出典はフッター・会社概要の実記載のみ） */
const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "不用品回収・遺品整理アストラ",
  url: "https://pe-astra.com/",
  telephone: "0120-709-333",
  image: "https://pe-astra.com/wp-content/uploads/2021/08/logo-1.jpeg",
  address: {
    "@type": "PostalAddress",
    postalCode: "555-0012",
    addressRegion: "大阪府",
    addressLocality: "大阪市西淀川区",
    streetAddress: "御幣島4-10-17",
    addressCountry: "JP",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  areaServed: ["大阪府", "兵庫県", "京都府", "奈良県", "和歌山県", "滋賀県", "三重県"],
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
        />
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
