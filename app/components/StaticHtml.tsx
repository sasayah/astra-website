/**
 * 旧サイトから抽出した本文HTMLをそのまま描画する。
 * WordPress由来のHTMLはブラウザが正規化する非厳密なタグ入れ子を含むため、
 * ハイドレーション不一致の警告を抑制する（内容は静的で不変）。
 * id="static-content" は RunInlineScripts がインラインscriptを実行する際の起点。
 */
export default function StaticHtml({ html }: { html: string }) {
  return (
    <div
      id="static-content"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
