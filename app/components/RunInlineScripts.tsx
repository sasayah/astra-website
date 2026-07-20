"use client";

import { useEffect } from "react";

/**
 * dangerouslySetInnerHTML で挿入した静的HTML内のインライン<script>は
 * ブラウザ仕様で実行されないため、マウント後に本物のscript要素へ置換して実行する。
 * jQuery は beforeInteractive でグローバル提供済み。
 * 通常のHTMLパース時と同じ順序性を保つため、src付きscriptはロード完了を待ってから
 * 次のscriptを実行する（例: CDNのslick読込 → 直後のインライン $('.slider').slick() ）。
 * ※ DOMContentLoaded 依存のスクリプトは既に発火済みのため再バインドされない場合がある（既知の制約）。
 */
export default function RunInlineScripts() {
  useEffect(() => {
    // 地域ページは分割挿入により複数コンテナになるため、全コンテナのscriptを文書順に実行
    const containers = Array.from(document.querySelectorAll("[data-static-content]"));
    if (!containers.length) return;
    let cancelled = false;
    const scripts = containers.flatMap((c) => Array.from(c.querySelectorAll("script")));

    const run = async () => {
      for (const old of scripts) {
        if (cancelled || !old.isConnected) return;
        // 実行済みマーク（React StrictModeのeffect二重実行でconst再宣言等を起こさない）
        if (old.hasAttribute("data-inline-ran")) continue;
        const code = old.textContent || "";
        const src = old.getAttribute("src") || "";
        // 外部CDNのjQuery再読込はスキップ。テーマは jQuery 1.9.1 前提で、新版(3.x)を
        // 読み込むと window.jQuery が差し替わり slick/matchHeight/fancybox が消えて壊れる。
        if (/(code\.jquery\.com|\/jquery[.-]|ajax\/libs\/jquery)/i.test(src)) continue;
        // 旧WordPress依存のスクリプトはスキップ（新環境で動かずエラーになるだけ）:
        // reCAPTCHA と、admin-ajax/wp_mail 宛ての簡易見積フォーム送信。フォームは ContactForms が処理する。
        if (/grecaptcha|custom_form_submitted|admin-ajax/.test(code)) continue;
        const s = document.createElement("script");
        for (const attr of Array.from(old.attributes)) {
          s.setAttribute(attr.name, attr.value);
        }
        s.setAttribute("data-inline-ran", "1");
        if (src) {
          // src付きは順序保証のためロード完了(またはエラー)まで待つ
          await new Promise<void>((resolve) => {
            s.onload = () => resolve();
            s.onerror = () => resolve();
            old.replaceWith(s);
          });
        } else {
          s.textContent = code;
          old.replaceWith(s);
        }
      }
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
