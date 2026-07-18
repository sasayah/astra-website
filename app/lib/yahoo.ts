/**
 * LINEヤフー広告のコンバージョン測定定数。
 * 値の出典: 広告管理ツール > ライブラリー > コンバージョン測定（docs/yahoo-ads-analysis.md）
 * GTM(GTM-MCVFLTS)側にも tel:クリック / line.meクリック / /contact/thanks PV の
 * 発火トリガーがあるため、コード側から直接発火するのは
 * 「GTMにトリガーが存在しないイベント」（simple_form送信成功）だけにする（二重計測防止）。
 */
export const YAHOO_CONVERSION_ID = "1001234223";

export const YAHOO_CV = {
  /** フォーム問い合わせ完了 ¥3,000 */
  form: { label: "LWQVCN257ZQDEMT4mLQo", value: "3000" },
  /** LINE問い合わせ ¥3,000（GTMが line.me クリックで発火） */
  line: { label: "TsiGCO6s7ZQDEMT4mLQo", value: "3000" },
  /** 電話問い合わせ ¥10,000（GTMが tel: クリックで発火） */
  phone: { label: "soe8CMaW7ZQDEMT4mLQo", value: "10000" },
} as const;

/** simple_form 送信成功時にフォームCVを発火（ytag未ロード環境では何もしない） */
export function fireYahooFormConversion() {
  try {
    const w = window as unknown as {
      ytag?: (arg: unknown) => void;
      dataLayer?: { push: (arg: unknown) => void };
    };
    w.ytag?.({
      type: "yss_conversion",
      config: {
        yahoo_conversion_id: YAHOO_CONVERSION_ID,
        yahoo_conversion_label: YAHOO_CV.form.label,
        yahoo_conversion_value: YAHOO_CV.form.value,
      },
    });
    // GTM側で将来トリガーを組めるようイベントも積んでおく
    w.dataLayer?.push({ event: "simple_form_submit" });
  } catch {
    /* 計測失敗で送信フローを壊さない */
  }
}
