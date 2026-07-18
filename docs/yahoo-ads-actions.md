# Yahoo広告 改善アクション一覧（要オーナー承認 → 管理画面で実施）

前提: 本リポジトリの新サイト（LP群 + CVタグ）が pe-astra.com に切替デプロイされてから実施する。
分析の根拠は docs/yahoo-ads-analysis.md。

## 1. 品目広告グループの最終リンク先を品目LPへ変更（最重要）

現状は全広告が汎用LP（/huyouhin2）行き。品目LPに変えることで広告関連性・品質・CVRの改善を狙う。

| 広告グループ（単品） | 新しい最終リンク先 |
|---|---|
| 冷蔵庫 | https://pe-astra.com/lp/reizouko/ |
| 洗濯機 | https://pe-astra.com/lp/sentakuki/ |
| テレビ・ブラウン管 | https://pe-astra.com/lp/tv/ |
| エアコン・クーラー | https://pe-astra.com/lp/aircon/ |
| マットレス | https://pe-astra.com/lp/mattress/ |
| ベット | https://pe-astra.com/lp/bed/ |
| タンス | https://pe-astra.com/lp/tansu/ |
| ソファ | https://pe-astra.com/lp/sofa/ |
| 机・デスク | https://pe-astra.com/lp/desk/ |
| ピアノ | https://pe-astra.com/lp/piano/ |
| 自転車 | https://pe-astra.com/lp/jitensha/ |
| 布団 | https://pe-astra.com/lp/futon/ |
| 液晶、ディスプレイ | https://pe-astra.com/lp/monitor/ |
| 一般・大型全般・単品全般 | https://pe-astra.com/lp/kagu/ または現状維持（/huyouhin2） |

大型キャンペーン:
- 大型一般のうち「粗大ごみ」系クエリ → 粗大ごみ専用グループを新設し https://pe-astra.com/lp/sodaigomi/ へ
- 地域クエリ（東大阪/豊中/枚方/高槻等、CVR高）→ 地域LP https://pe-astra.com/lp/{item}/{city}/ を活用
  （例: 冷蔵庫×東大阪 = /lp/reizouko/higashiosakashi/）

city slug一覧: osakashi, sakaishi, higashiosakashi, toyonakashi, takatsukishi, hirakatashi, ibarakishi, minoushi, izumisanoshi, kawachinaganoshi, amagasakishi, nishinomiyashi, kobeshi, kyotoshi, narashi

## 2. 対象外キーワード（アカウント全体 or 大型キャンペーン）

CV0で費用を垂れ流しているクエリ群（全期間データ根拠）:

```
修理
やることリスト
後悔
単身パック
引越し業者          ← 引っ越しグループ以外に追加
日通
サカイ引越センター
アート引越センター
ベスト引越サービス
街の引っ越し屋さん
町の引っ越し屋さん
お助け隊
キングライオン
ごみえもん
うるココ
アクタス
関西グリーンサービス
エアコンフーリー
不用品回収の窓口
```

注意: 「大阪市 粗大ごみ」はCTR1.4%と低いがCPA¥7-9kでCVは出ているため除外しない（専用LP+専用広告文で改善する方が良い）。

## 3. 大型一般グループの整理

- 直近30日: ¥317,451でCV17（CPA¥18,674）。特に「不用品回収」完全一致がCPC¥1,069・CV0。
- 推奨: インテントマッチ/フレーズ一致で拾えている地域・品目クエリを専用グループに移し、
  汎用ビッグワード（不用品回収・廃品回収）は上限CPC制御 or 別グループで入札を切り下げる。
- 「回収」「処分」「捨てる」等の1語インテントマッチは停止候補（CV僅少）。

## 4. 遺品整理グループ

全期間 遺品整理 完全一致: ¥24,067 CV0。/ihinseiri LPの改善（電話CTA強化・事例・料金目安）までは
日予算を絞るか一時停止を推奨。

## 5. 地域拡大（品目LP投入後）

単品キャンペーンは現在大阪府のみ。大型キャンペーンでは兵庫・京都・奈良の品目クエリ
（尼崎テレビ処分、京都冷蔵庫処分等）でCVが出ているため、品目×地域LPを最終リンク先にした
うえで単品の配信地域を兵庫・京都・奈良へ拡大テストする価値あり。

## 6. 計測の注意（切替時チェックリスト）

- [ ] Railway本番環境に NEXT_PUBLIC_GTM_ID=GTM-MCVFLTS を設定（未設定だとGTMもCVも動かない）
- [ ] 切替後、tel:リンククリック/LINEクリック/フォーム送信でCVがYahoo管理画面に入ることを確認
- [ ] simple_form送信成功時のフォームCV（新規実装）が二重計測になっていないこと
  （GTMのフォームCVトリガーは /contact/thanks PV のみ。simple_formはコード発火のみ）
