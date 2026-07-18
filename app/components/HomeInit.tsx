"use client";

import { useEffect } from "react";

/**
 * トップページ専用の初期化（旧 footer.php のホーム用インラインスクリプト相当）。
 * jQuery(beforeInteractive) と slick(afterInteractive) のロード完了を待ってから
 * メインビジュアルのスライダーと matchHeight を起動する。
 */
export default function HomeInit() {
  useEffect(() => {
    let tries = 0;
    const timer = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const $ = (window as any).jQuery;
      if ($ && $.fn && $.fn.slick) {
        clearInterval(timer);
        $("#main .reasonBox li .photo").matchHeight?.();
        const slider = $(".mainVisual .slider");
        if (slider.length && !slider.hasClass("slick-initialized")) {
          slider.slick({
            autoplay: true,
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: true,
            prevArrow: ".mainVisual .arrow .prev",
            nextArrow: ".mainVisual .arrow .next",
          });
        }
      } else if (++tries > 100) {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return null;
}
