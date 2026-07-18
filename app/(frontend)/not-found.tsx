import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません | 不用品回収なら大阪のアストラ",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 64, fontWeight: "bold", color: "#6cb4e4", lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: 22, margin: "16px 0 8px" }}>
        お探しのページは見つかりませんでした
      </h1>
      <p style={{ color: "#666", lineHeight: 1.8, margin: "0 0 32px" }}>
        ページが移動または削除された可能性があります。<br />
        お手数ですが、トップページからお探しください。
      </p>
      <p>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#6cb4e4",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          トップページへ戻る
        </a>
      </p>
      <p style={{ marginTop: 40, color: "#888" }}>
        お急ぎの方はお電話ください：
        <a href="tel:0120709333" style={{ color: "#e72234", fontWeight: "bold" }}>
          0120-709-333
        </a>
      </p>
    </main>
  );
}
