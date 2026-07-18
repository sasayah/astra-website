# pe-astra.com リプレース移行計画（Railway デプロイ版）

WordPress（カスタムテーマ「ASTRA」/ WordPress 5.3.21）で運用中の
**https://pe-astra.com** を、スクラッチで再構築し **Railway** 上で運用する計画書。

- 対象: 近畿一円の不用品回収・遺品整理・特殊清掃「アストラ」の集客サイト
- 方針: **現行の公開ページ構成・URLをそのまま維持して1:1で置き換える**（管理画面機能は不要）
- デプロイ先: **Railway**（Node常駐サービス）
- 更新日: 2026-07-07 / 対象モデル: Fable 5

> **方針決定（2026-07-07）**: 移行手段は3案（A=WordPressをそのままDocker化 / B=取得済みHTMLを静的配信 /
> C=Next.jsでスクラッチ再構築）を比較検討した結果、**C（Next.jsで最初から再構築）を採用**。
> 理由: 将来ブログ投稿・編集者アカウントを入れる前提があり、長期的にCが最も一貫するため。
> Cは「週末の移行作業」ではなく開発プロジェクト規模。最大の作業は §5-1 の**既存コンテンツ抽出**。

---

## 0. 結論（TL;DR）

- スタックは **Next.js（App Router / TypeScript）** を推奨。Railwayは静的CDNではなく
  **サーバー常駐型PaaS**なので、「静的ページ大量 ＋ お問い合わせフォームのサーバー処理」を
  1デプロイで両立できるNext.jsが最適。
- コンテンツは **フェーズ1ではDB不要**（抽出データ＝JSON/MDXをリポジトリ同梱してSSGで1:1複製）。
  ただし将来 **ブログ投稿・アカウント管理**を入れる前提なので、**最初からDB移行しやすいスキーマで
  設計**し、フェーズ4で **Payload CMS（Next.js組込）＋ Railway Postgres** を追加する道筋を用意する。
- 動的処理は **お問い合わせフォームのみ**（確認→送信→サンクス＋自動返信メール）。
  Next.jsのRoute Handlerで実装し、メール送信は **Resend**（API1つ・Railwayと好相性）。
- **画像は問題なし**。現行uploadsは453MBだが実使用は**217点（≒60MB弱）**だけ。実使用分のみ抽出・
  最適化して同梱。将来アップロードする画像は**オブジェクトストレージ（Cloudflare R2 / S3）**へ
  （RailwayのファイルシステムはデプロイでリセットされるためVolume/外部ストレージが必須）。
- URLは完全維持（`.html` 拡張子・階層そのまま）。`/kansai-huyouhin` の大文字/スペースURLだけ
  正規化して301。

---

## 実装状況（2026-07-07 更新）

**フェーズ0〜2 実装完了・ローカル検証済み**（`web/` に Next.js アプリ）。

| フェーズ | 状態 | 内容 |
|---------|------|------|
| 0 初期化・レイアウト・アセット | ✅ | Next.js 16 構築、Header/Footer の React 化、実使用画像等を約76MBに集約 |
| 1 静的1:1複製 | ✅ | 全 **526ページ**を抽出→正規化→SSG。トップ/固定/エリア/声/ブログ全種で表示・アセット404ゼロを確認 |
| 1 お問い合わせフォーム | ✅ | `/api/contact`（Resend）＋送信横取り。入力→送信→自動整形メール→サンクス遷移まで実地検証済み |
| 2 Railway 設定 | ✅ | `railway.json`（Nixpacks / `next start` / ヘルスチェック）、`.env.example` |
| SEO改善 | ✅ | sitemap.xml(526URL)/robots.txt生成、全ページOGP・canonical・keywords復元、実favicon、日本語404、GTM env切替 |
| 3 本番切替（DNS） | ⬜ | 未実施（Railwayデプロイ→ドメイン切替。§7、MX注意） |
| 4 CMS化（Payload） | ✅ | Payload v3をNext同居。管理画面`/admin`、編集者アカウント＋権限、ブログ244件・声119件をDB投入済み。DBはSQLite(ローカル)/Postgres(本番)をenv切替 |

**フェーズ4補足**: CMSは構築・データ投入・管理画面動作まで完了。残るは公開ページを静的から
Payload読み込み（ISR）へ切替える作業。データは投入済みなので切替のみ。管理者初期アカウント:
`admin@pe-astra.com` / `astra-admin-2026`（本番前に必ず変更）。画像アップロードは将来R2/S3へ。

詳細な使い方・デプロイ手順は [`web/README.md`](web/README.md)。ビルドは全530ルートが成功。

---

## 1. リポジトリ構成（取得済みの資料）

```
/Users/hiromu/dev/astra/
├── MIGRATION_PLAN.md          ← 本ファイル
├── old_wordpress/             ← 旧WordPress一式（FTP実体・702MB / 9,838ファイル）
│   ├── index.php header.php footer.php mail.php thanks.php  ← ルートの手組みPHP LP層
│   ├── css/ img/ js/           ← 同上のフロント資材
│   ├── wp-content/
│   │   ├── themes/ASTRA/       ★現行デザイン本体＆反復ページのテンプレート設計図
│   │   ├── uploads/            ★記事・ページで使う画像/PDF（453MB）
│   │   └── plugins/            （ACF Pro / All in One SEO / Sitemap）
│   ├── wp-admin/ wp-includes/  （WordPressコア。再構築では不要）
│   ├── testsite/               （別インストール＝ステージング残骸・移行対象外）
│   └── db/                     ← DBダンプ置き場（未取得。§6参照）
└── original-site/             ← 移行の"正解データ"
    ├── html-snapshot/         ★公開ページ全527ファイルのレンダリング済みHTML
    ├── urls.txt / all_links.txt
```

- **再構築の元データ = `original-site/html-snapshot/`**（訪問者が見る完成HTML）
- **デザイン部品 = `old_wordpress/wp-content/themes/ASTRA/`（CSS/JS/画像）＋ `uploads/`**
- **反復ページの構造 = テーマのテンプレPHP**（`page-huyouhin-city.php` 等、下記§3-2）

---

## 2. 現行の技術構成（調査結果）

| 項目 | 内容 |
|------|------|
| CMS | WordPress 5.3.21 ＋ 自作テーマ **ASTRA**（既製の"Astra"とは別物） |
| フロント | jQuery / slick / fancybox / matchHeight（画像主体の日本式LP） |
| プラグイン | Advanced Custom Fields Pro、All in One SEO Pack、Google Sitemap Generator |
| 動的機能 | **お問い合わせフォームのみ**（それ以外は実質静的） |

### サーバー実体は2層構成
1. **ルート直下の手組みPHP LP** … `index.php` / `mail.php`（フォーム）/ `thanks.php` ＋ `css/ img/ js/`
2. **WordPressテーマ `themes/ASTRA/`** … 現行トップ・ブログ・声・エリアの本体。
   テンプレPHPが**反復ページの設計図**（→ そのままコンポーネントに写経できる）

---

## 3. ページ構成（公開ページ全ラインナップ）

内部リンクを総ざらいし取りこぼしゼロで取得済み（`html-snapshot/` 527ファイル）。

### 3-1. 固定ページ（1ページずつ手移植）
| 種別 | URL |
|------|-----|
| トップ | `/` |
| 主要サービス | `/service`（特殊清掃`#a01`・解体`#a02`内包）、`/huyouhin`、`/ihinseiri`、`/moving`、`/hoarding` |
| 集客LP・フォーム | `/huyouhin2` `/huyouhin3` `/huyouhin-line` `/huyouhin2-line` `/huyouhin-ph` `/huyouhin2-form` `/huyouhin2-form-2` `/hoarding-form` |
| 情報・会社 | `/company` `/faq` `/policy` `/news` `/contact`（`/contact/confirm` `/contact/thanks`） |

### 3-2. 反復ページ（テンプレート × データ駆動で量産）
| 種別 | URL | 件数 | 生成元テンプレート |
|------|-----|------|-------------------|
| ブログ記事 | `/blog/{id}.html` | 約253 | `themes/ASTRA/single.php` |
| ブログ一覧 | `/blog`（`/blog/活動報告` 含む） | — | `archive.php` |
| お客様の声 | `/voice/{県}/{市町村}` | 約120（＋県別一覧6・トップ1） | `single.php` |
| エリアLP | `/kansai-huyouhin/{市町村}` | 118（＋トップ1） | `page-huyouhin-city.php`（**`city`フィールドのみ差し替えの同一テンプレ**） |

> `/kansai-huyouhin` はナビが**大文字始まり**（`/Osakashi`）、サイトマップは**小文字**、
> 一部リンクに**半角スペース混入**（`/Kawakami Mura`）。実サーバーは両方200。
> → 新サイトは **小文字ハイフン区切りに正規化し、旧URLは301で1本化**。

### 3-3. 移行対象外（要確認）
`/不用品都市ごとテスト`（テストページ）、`/sitemap.html`（実体404）、`themes/ASTRA/*_test.php` `*_back20200902` 系（旧バックアップ）。

**公開ページ総数: 約400ページ**

---

## 4. 目標アーキテクチャ（Railway）

```
                    ┌─────────────────────────────────────────┐
   pe-astra.com ──▶ │  Railway Service: Next.js (Node常駐)      │
   (Custom Domain)  │  ─ SSG/ISR: 固定ページ＋反復ページ(約400) │
                    │  ─ Route Handler: /api/contact          │──▶ Resend
                    │      （確認・送信・自動返信）             │    (info@pe-astra.com)
                    │  ─ /public: 既存の実使用画像のみ同梱      │
                    │  ─ /admin: Payload CMS（フェーズ4で追加） │
                    └─────────────────────────────────────────┘
                         │ フェーズ4で追加
              ┌──────────┴───────────┐
              ▼                      ▼
       Railway Postgres        Cloudflare R2 / S3
   （ブログ投稿・ユーザー/権限）  （CMSでアップした画像の永続保存）
```

### スタック選定
| 項目 | 採用 | 理由 |
|------|------|------|
| フレームワーク | **Next.js 15（App Router / TS）** | SSGとフォームAPIを1デプロイで両立。Railwayと好相性。反復テンプレに最適 |
| スタイル | 現行CSSを移植（`themes/ASTRA/index.css` 等）＋必要に応じCSS Modules | 見た目を1:1で維持するのが最優先 |
| コンテンツ | フェーズ1は **リポジトリ内データ（JSON/MDX）**、フェーズ4で **Payload CMS → Postgres** | まず最速で1:1複製。将来ブログ投稿はCMSからDBへ |
| フォーム送信 | **Route Handler + Resend** | サーバー処理はここだけ。API1つで送信・自動返信を実装。独自ドメイン認証(SPF/DKIM)で到達率も確保 |
| CMS・認証 | **Payload CMS v3（Next.js組込）** | ブログ投稿UI・ユーザー/権限管理・REST/GraphQLを標準装備。同一Next.jsアプリ内に同居できRailway 1サービスで完結 |
| DB | **Railway Postgres**（フェーズ4で追加） | Payloadのデータ層。フェーズ1は無し |
| 既存画像 | 実使用217点のみ `/public` に同梱＋最適化 | uploads全453MBは不要。**実質60MB弱**に圧縮 |
| 新規画像 | **Cloudflare R2 / S3**（CMSアップロード先） | RailwayのFSは揮発性。PayloadのStorageアダプタでR2/S3に保存 |

> 代替案: 静的中心なら **Astro** も可だが、フォーム処理に加え将来のCMS(Payload)まで同一アプリで
> まかなえる **Next.js** が、ブログ投稿・アカウント管理まで見据えると最も一貫する。第一候補はNext.js。

### なぜ Payload CMS か
- 「**ブログ投稿機能**」＝管理画面から記事をCRUDできる編集UIが標準で付く。
- 「**アカウント管理機能**」＝ユーザー・ロール（権限）管理がコア機能。編集者アカウントの追加・権限分けが可能。
- Next.jsアプリの中に `/admin` として同居できるため、**Railwayは1サービスのまま**（別途Strapi等を立てる必要なし）。
- Postgresアダプタ・R2/S3ストレージアダプタ完備で、本構成にそのまま乗る。

> **アカウント管理のスコープ確定（2026-07-07）**: 対象は**管理者・編集者アカウント**（ブログを書く
> スタッフの権限管理）。これはPayloadの `users` コレクション＋アクセス制御の標準機能で完結し、
> 追加の認証基盤は不要。※一般ユーザー（顧客）向けログインは現時点で対象外。

### Railway 固有の設定ポイント
- ビルド: Nixpacks が Next.js を自動検出（`npm run build`）。
- 起動コマンド: `next start -p $PORT`（**Railwayが注入する `PORT` を必ず使う**）。
- ヘルスチェック: パス `/`。
- 環境変数: `RESEND_API_KEY` `MAIL_TO=info@pe-astra.com` `MAIL_FROM`（Resendで認証した独自ドメインのアドレス）。
- カスタムドメイン: Railwayで `pe-astra.com` を追加 → DNSをRailwayのCNAME/Aに向ける（切替は§7）。
- 画像を永続保存したい場合のみ Railway Volume。ただし本構成では画像はリポジトリ同梱で不要。

---

## 5. 移行フェーズ

### フェーズ0: プロジェクト初期化
- [ ] `apps/web`（または直下）に Next.js + TS を作成、リポジトリをgit化
- [ ] `themes/ASTRA` から CSS/JS を移植、共通レイアウト（ヘッダー/フッター/SPナビ/CTA）を作成
- [ ] `html-snapshot` と `uploads`・`themes/ASTRA/img` から**実使用画像のみ**を `/public` に抽出

### フェーズ1: 静的1:1複製（"まず全部そのまま置き換える"）
- [ ] 固定ページ（§3-1・約20ページ）をHTMLスナップショットから1ページずつ移植
- [ ] エリアLP（118）… 市町村リストを配列データ化 → `page-huyouhin-city.php` 相当のテンプレで生成
      （**`city`差し替えのみの同一テンプレ＝ほぼゼロコスト**）
- [ ] ブログ（253）・声（120）… §5-1 で抽出したデータを記事テンプレで生成
- [ ] 内部リンク・画像パスを新構成へ張り替え、`/kansai-huyouhin` URLを正規化＋301表を作成
      （スナップショットは `http://` と `https://` のアセット参照が混在。要一括置換）
- [ ] お問い合わせフォーム（確認→送信→自動返信→サンクス）を Route Handler ＋ **Resend** で実装
      - 項目: お名前 / メールアドレス / 電話番号 / 都道府県 / 市区町村 / 番地 / お問い合わせ内容
      - 宛先: `info@pe-astra.com`、ユーザーへ自動返信（現行 `mail.php` の文面を踏襲）
      - 事前準備: Resendアカウント作成 → `pe-astra.com` ドメイン認証（SPF/DKIMのDNSレコード追加）

### フェーズ2: Railwayデプロイ
- [ ] Railwayプロジェクト作成 → GitHub連携で自動デプロイ
- [ ] 環境変数（SMTP/宛先）設定、`PORT` バインド確認、ヘルスチェック
- [ ] Railway発行URLで全ページ・フォーム送信を検証

### フェーズ3: 検証・本番切替
- [ ] 新旧の全URL差分チェック（見た目・title/meta・リンク切れ・OGP）
- [ ] 301リダイレクト表の最終化（正規化URL・旧`.html`）
- [ ] Railwayにカスタムドメイン `pe-astra.com` を追加、DNS切替（§7）
- [ ] フォーム実送信テスト、旧ロリポップ環境の停止

### フェーズ4: CMS化（ブログ投稿・アカウント管理）※将来
- [ ] Railway Postgres を追加、**Payload CMS** を同一Next.jsアプリに組込（`/admin`）
- [ ] コレクション定義: `posts`(ブログ) / `voice`(お客様の声) / `users`(編集者・権限)
- [ ] フェーズ1のブログ/声データ（JSON/MDX）を **Payload経由でDBへインポート**
      （フェーズ1のスキーマをDBモデルと一致させておくので変換は最小）
- [ ] 画像アップロード先を **Cloudflare R2 / S3** に設定（Payload Storageアダプタ）
- [ ] 公開ページを ISR/オンデマンド再生成に切替（投稿→即反映）

---

## 5-1. 既存コンテンツの抽出（本プロジェクト最大の作業）

Cを選んだ以上、**労力の大半はここに集中する**。エリアLP（118）はテンプレ差し替えのみで
ほぼ無コストだが、**ブログ253＋声120＝約370記事**の本文を、保存済みHTMLから機械的に
取り出す必要がある。1行のチェックボックスではなく独立工程として扱う。

### 手順
1. **本文領域の特定** … 各スナップショットからヘッダー/グロナビ/サイドバー/フッター/CTAを除いた
   本文（`#main` / `article` 等）だけを抜き出すセレクタを確定（テーマは共通なので基本1〜2パターン）。
2. **構造化データ化** … タイトル / 公開日 / カテゴリ / 本文HTML / 使用画像 / スラッグ(URL) を
   JSON or MDX に落とす。**スキーマはフェーズ4のPayloadコレクションと一致させる**（後の移行を無コスト化）。
3. **本文HTMLのクレンジング** … 絶対URL→相対化、`http/https`混在の統一、不要なインラインstyle整理、
   画像パスを `/public`（→将来R2）へ張り替え。
4. **目視チェック** … 記事ごとに崩れが出やすいので、差分ビューアで新旧を突き合わせる工程を見込む。

### コスト感（正直な見積り）
- 抽出スクリプトの作り込み: 中（テーマ共通なので1回作れば370件に効く）
- **記事個別の手直し: ここが読めない**。テンプレが素直なら大半自動、崩れる記事だけ手当て。
  最初に10〜20記事で歩留まりを測ってから全体展開するのが安全。

---

## 6. データベースについて

- 現行公開DBは **`LAA1026756-astranewweb`**（`wp-config.php`で確認）。他に `-astra`（testsite）、`-zaawa8`。
- DBホスト `mysql142.phy.lolipop.lan` は**ロリポップ内部専用**で外部から接続不可。
- **本計画ではDBは必須ではない**。本文は `html-snapshot/` から抽出可能。
- 記事の再編集元データが欲しい場合のみ、**ロリポップ管理画面の phpMyAdmin で
  `LAA1026756-astranewweb` を SQLエクスポート** → `old_wordpress/db/` に配置。
- 将来CMS化する場合は Railway Postgres を追加し、抽出データを投入。

---

## 6-2. 画像の扱い（現状把握と方針）

### 現状（調査結果）
| 項目 | 数値 |
|------|------|
| `uploads/` 総ファイル | 2,686（453MB） |
| うちWP自動生成リサイズ版（`-150x150`等の不要物） | 2,137 |
| **公開ページが実際に参照する画像** | **217点**（uploads 90点＝56MB ＋ テーマ 127点） |

→ 現行の画像資産は膨大に見えるが、**実際に使われているのは217点・実質60MB弱**。残りは
WordPressが量産したサムネイル等で移行不要。

### 方針
1. **既存画像（移行分）** … `html-snapshot` が参照する217点だけを抽出 → 最適化（サイズ縮小・
   WebP化・`next/image`）→ リポジトリの `/public` に同梱。Railwayデプロイに含まれ、追加ストレージ不要。
2. **将来アップロードする画像（ブログ投稿分）** … RailwayのコンテナFSは**デプロイのたびに消える揮発性**。
   そのため投稿画像は **Cloudflare R2（推奨・エグレス無料）または S3** に保存し、Payloadの
   Storageアダプタ経由でアップロード。CDN配信で表示も高速。
3. **ブログ本文中の画像** … フェーズ1では既存217点に含めて同梱。フェーズ4でCMS管理に移す際に
   R2/S3へ移設。

> 補足: `old_wordpress/wp-content/uploads/` の全453MBはアーカイブとして手元に保持。新サイトには
> 実使用分のみ載せる方針。「後から昔の画像が必要」になっても元データはローカルに残っている。

---

## 7. 本番切替（DNS）

1. Railwayでサービスが安定稼働 → カスタムドメイン `pe-astra.com`（と `www`）を追加。
2. ロリポップ/ドメイン管理のDNSを Railway 指定の値へ変更（CNAME or A）。
   TTLを事前に短縮しておくと切替が速い。
3. **⚠️ MXレコードは触らない**。`info@pe-astra.com` の**メール受信は現行のまま**にするため、
   Webの向き先（A/CNAME）だけを変更し、MX・メール関連レコードは残す。
   （Resendは"送信"用でSPF/DKIMのTXTを足すだけ。受信のMXとは別物なので混同しない）
4. 反映後、HTTPS証明書（Railway自動発行）と全URL・フォームを最終確認。
5. 問題なければ旧WordPress（ロリポップ）を停止。

---

## 7-2. ランニングコストの目安

| 項目 | 概算 | 備考 |
|------|------|------|
| 現行（ロリポップ） | 月数百円 | 参考 |
| Railway（Next.js常駐のみ・フェーズ1〜3） | 月 $5前後〜 | 従量課金。低トラフィックなら小さい |
| ＋ Railway Postgres（フェーズ4） | 追加課金 | CMS導入時のみ |
| ＋ Cloudflare R2（フェーズ4） | ほぼ無料〜少額 | エグレス無料。画像量次第 |
| Resend | 無料枠あり | 少量の問い合わせメールなら無料枠内 |

> 個人サイトとしては現行より月額が上がる。フェーズ1〜3は最小構成（Next.js1サービス）に留め、
> Postgres/R2はフェーズ4で必要になってから足すことでコストを抑える。

---

## 8. セキュリティ上の注意

- チャットで共有された **FTP／DBのパスワードは平文**。移行完了後にロリポップ管理画面で**必ず変更**。
- `old_wordpress/wp-config.php` や `mail.php` に認証情報あり。リポジトリを外部公開する場合は
  `.gitignore` で `old_wordpress/` を除外するか値をマスクすること。
- Resend APIキー等の秘密情報は Railway の環境変数で管理し、コードにハードコードしない。
