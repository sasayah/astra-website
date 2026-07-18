# pe-astra.com — Next.js リプレース版

WordPress（旧テーマ ASTRA）で運用していた **pe-astra.com** を Next.js でスクラッチ再構築し、
Railway で運用するためのアプリ。旧サイトの公開ページ構成・URL をそのまま 1:1 で置き換えている。

- フレームワーク: Next.js 16（App Router / TypeScript）
- 生成方式: 公開ページは全 SSG（約 526 ページ）。管理画面/APIは動的
- 動的処理: お問い合わせフォーム（`/api/contact` → Resend）／ Payload CMS（`/admin`）
- CMS: Payload v3（Next同居）。DBは SQLite(ローカル)/Postgres(本番) を env 切替

## ディレクトリ

Next の「複数ルートレイアウト」構成。公開サイトと Payload 管理画面が `<html>` を別々に持つ。

```
web/
├── app/
│   ├── (frontend)/             # 公開サイト（独自の <html><body>）
│   │   ├── layout.tsx          #   Header/Footer/ContactForms/Analytics/共通CSS・JS
│   │   ├── page.tsx            #   トップページ
│   │   ├── [...slug]/page.tsx  #   全サブページのキャッチオール（SSG）
│   │   └── not-found.tsx       #   日本語404
│   ├── (payload)/              # Payload 管理画面・API（Payload の <html>）
│   ├── api/contact/route.ts    # フォーム送信（Resend）
│   ├── api/seed/route.ts       # 初回データ投入（token保護）
│   ├── components/             # Header/Footer/StaticHtml/RunInlineScripts/ContactForms/Analytics/HomeInit
│   ├── lib/                    # content.ts / metadata.ts / pageContent.ts
│   ├── sitemap.ts robots.ts    # SEO（全526URLのsitemap・robots）
│   └── icon.png apple-icon.png # favicon（旧サイトの実アイコン）
├── collections/                # Payload: Users(編集者) / Posts(ブログ) / Voice(声) / Media
├── payload.config.ts           # Payload設定（DB adapter env切替）
├── content/
│   ├── pages/**.html           # 旧サイトから抽出・正規化した各ページ本文
│   └── manifest.json           # ページごとの title/description/canonical/OGP
├── public/wp-content/          # 旧テーマの CSS/JS/画像 ＋ 実使用 uploads（約76MB）
└── scripts/
    ├── extract-content.py      # スナップショット→content/pages 抽出（要 original-site/）
    ├── build-manifest.py       # 旧headからSEOメタを抽出しmanifest生成
    └── normalize-content.mjs   # parse5 でブラウザ同等に正規化
```

## Payload CMS（`/admin`）

- コレクション: **Users**（管理者/編集者・権限）, **Posts**（ブログ, 244件移行済）, **Voice**（お客様の声, 119件移行済）, **Media**。
- 初期管理者: `admin@pe-astra.com` / `astra-admin-2026`（**本番前に必ず変更**）。
- データ投入（再実行は冪等・legacyUrlで重複スキップ）:
  ```bash
  curl -X POST "http://localhost:3000/api/seed?token=$SEED_TOKEN"
  ```
- 移行記事は共通ブロック（追従CTA/見積フォーム）を除いた本文を `bodyHtml` に格納。
- **未了**: 公開ブログ/声ページはまだ静的HTML。CMS編集を反映するには公開側をPayload読み込み（ISR）へ切替が必要（データは投入済み）。
- Node 25 では `payload` CLI（generate:types等）が動かないため、型は未生成・importMapは空（標準コンポーネントのみで動作）。本番Node 20-22推奨。

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 全ページを静的生成
npm run start    # 本番サーバ（PORT を尊重）
```

## 移行パイプライン（コンテンツ再生成する場合）

`../original-site/html-snapshot/`（旧サイトのレンダリング済みHTML）が前提。

```bash
python3 scripts/extract-content.py   # 本文抽出 + manifest 生成
node scripts/normalize-content.mjs   # HTML正規化（ハイドレーション対策）
```

各ページは「`</header>` と `<footer>` の間の本文」を抽出し、ドメイン絶対URLを相対化したもの。
ヘッダー/フッターは React コンポーネントで描画する。本文内のインライン `<script>` は
`RunInlineScripts` が実行する。

## Yahoo広告用LP（/lp/…）と計測

- `/lp/{品目}/`・`/lp/{品目}/{市区}/` は Yahoo検索広告専用LP（全て noindex・sitemap対象外）。
  - データ: `content/lp-items.json`（品目コピー）+ `app/lib/lp-data.ts`（市区リスト・型）
  - テンプレート: `app/components/lp/LpTemplate.tsx` + `app/(frontend)/lp/lp.css`
  - コピー再生成後は `node scripts/assemble-lp-data.mjs <生成JSON>` で検証込みで反映
- CV計測: GTM（`NEXT_PUBLIC_GTM_ID=GTM-MCVFLTS`）が tel:クリック / line.me クリック /
  `/contact/thanks` PV でYahoo CVを発火。ytagサイトジェネラルタグは `YahooTag` が全ページに設置。
  簡易見積（simple_form）成功時のみコードから直接フォームCVを発火（`app/lib/yahoo.ts`）。
- 広告アカウントの分析・改善アクションは `docs/yahoo-ads-analysis.md` / `docs/yahoo-ads-actions.md`。

## Railway デプロイ

- ビルダー: Nixpacks（`railway.json` 参照）。`npm run build` → `npm run start`。
- `next start` は Railway の `PORT` を自動で使用。ヘルスチェックは `/`。
- 環境変数（`.env.example` 参照）:
  - `NEXT_PUBLIC_GTM_ID` … 本番切替時に `GTM-MCVFLTS` を設定（未設定だとYahoo広告CV計測が止まる）
  - `RESEND_API_KEY` … 未設定でもフォームは動作し内容をログ出力（本番では必須）
  - `MAIL_TO` … 管理者受信アドレス（既定 `info@pe-astra.com`）
  - `MAIL_FROM` … 差出人（Resend で認証済みの独自ドメインアドレス）
- カスタムドメイン切替時は **MX レコードを触らない**（メール受信を維持）。

## 既知の制約（フェーズ1時点）

- お問い合わせの「送信確認」画面は簡略化し、送信 → サンクスへ直行（旧サイトは確認画面あり）。
- 簡易見積フォーム（`.simple_form`）は reCAPTCHA を省略し `/api/contact` に送信。
- ブログ/お客様の声はまだ静的。将来 Payload CMS + Postgres で編集可能化予定（MIGRATION_PLAN.md フェーズ4）。
