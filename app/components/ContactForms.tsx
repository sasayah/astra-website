"use client";

import { useEffect } from "react";
import { fireYahooFormConversion } from "@/app/lib/yahoo";

/**
 * 旧サイトのフォーム（メインの .mailForm と 全ページ共通の簡易見積 .simple_form）の
 * 送信を横取りし、/api/contact 経由で Resend 送信する。
 * キャプチャ段階で stopImmediatePropagation することで、RunInlineScripts が復元した
 * 旧インライン送信ハンドラ（WordPress/admin-ajax宛て）を抑止して二重送信を防ぐ。
 */
export default function ContactForms() {
  useEffect(() => {
    const forms = Array.from(
      document.querySelectorAll<HTMLFormElement>("form.mailForm, form.simple_form"),
    );
    const handler = async (e: Event) => {
      const form = e.currentTarget as HTMLFormElement;
      e.preventDefault();
      e.stopImmediatePropagation();
      const submitters = form.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
        'button[type="submit"], input[type="submit"]',
      );
      submitters.forEach((b) => (b.disabled = true));
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          body: new FormData(form),
        });
        const json = await res.json().catch(() => ({ ok: false }));
        if (json.ok) {
          if (form.classList.contains("simple_form")) {
            // 簡易見積はページ遷移しないため、ここでフォームCVを直接計測する
            // （/contact/thanks へ遷移する mailForm は GTM のPVトリガーが計測）
            fireYahooFormConversion();
            alert(
              "送信が完了しました！\nご連絡をお待ちください。\nお急ぎの場合は、0120-709-333 までご連絡ください。",
            );
            form.reset();
            submitters.forEach((b) => (b.disabled = false));
          } else {
            window.location.href = "/contact/thanks";
          }
        } else {
          alert("送信に失敗しました。お手数ですが 0120-709-333 までご連絡ください。");
          submitters.forEach((b) => (b.disabled = false));
        }
      } catch {
        alert("送信に失敗しました。お手数ですが 0120-709-333 までご連絡ください。");
        submitters.forEach((b) => (b.disabled = false));
      }
    };
    forms.forEach((f) => f.addEventListener("submit", handler, true));
    return () => forms.forEach((f) => f.removeEventListener("submit", handler, true));
  }, []);

  return null;
}
