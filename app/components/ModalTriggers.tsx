"use client";

import { useEffect } from "react";

/**
 * LINE・電話モーダル（.lm_modal / .ph_modal）の開閉をイベント委譲で担う。
 *
 * 旧サイトのインラインJSは DOMContentLoaded で各ボタン要素に直接 onclick を張る方式
 * だったため、(1) Reactのハイドレーションで要素が再構築されるとリスナーが消える、
 * (2) 残存スクリプトのエラーで初期化ごと死ぬ、という壊れ方をしていた
 * （実際に市町村ページ全てでモーダルが無反応になっていた）。
 * document への委譲なら要素の差し替えに影響されず、全ページで確実に動く。
 * 旧インラインJSが生きているページで二重に発火しても表示/非表示の冪等操作のみで無害。
 */
export default function ModalTriggers() {
  useEffect(() => {
    const fitHeight = (modal: HTMLElement) => {
      modal.style.height = `${window.innerHeight}px`;
    };
    const open = (modal: HTMLElement) => {
      modal.style.display = "block";
      fitHeight(modal);
    };
    const close = (modal: HTMLElement) => {
      modal.style.display = "none";
    };
    const q = (sel: string) => document.querySelector<HTMLElement>(sel);

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!(t instanceof Element)) return;

      // 開く: LINEモーダル（モーダルが無いページでは素通し=line.meへ直接遷移）
      if (t.closest(".lm_line_modal")) {
        const modal = q(".lm_modal");
        if (modal) {
          e.preventDefault();
          open(modal);
        }
        return;
      }
      // 開く: 電話モーダル（モーダルが無いページでは素通し=tel:発信）
      if (t.closest(".ph_phone_modal")) {
        const modal = q(".ph_modal");
        if (modal) {
          e.preventDefault();
          open(modal);
        }
        return;
      }
      // 閉じる: ×ボタン
      const lmClose = t.closest(".lm_close");
      if (lmClose) {
        const modal = q(".lm_modal");
        if (modal) {
          e.preventDefault();
          close(modal);
        }
        return;
      }
      const phClose = t.closest(".ph_close");
      if (phClose) {
        const modal = q(".ph_modal");
        if (modal) {
          e.preventDefault();
          close(modal);
        }
        return;
      }
      // 閉じる: モーダル背景（コンテンツ外）クリック
      if (t.classList.contains("lm_modal")) close(t);
      if (t.classList.contains("ph_modal")) close(t);
    };

    const onResize = () => {
      for (const sel of [".lm_modal", ".ph_modal"]) {
        const modal = q(sel);
        if (modal && modal.style.display === "block") fitHeight(modal);
      }
    };

    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
