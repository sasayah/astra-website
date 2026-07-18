#!/usr/bin/env python3
"""スナップショットの<head>から各ページのSEOメタを抽出し manifest.json を生成。
canonical / og:url は本番ドメイン(pe-astra.com)の絶対URLのまま保持する。"""
import os, re, json, html

SNAP = "/Users/hiromu/dev/astra/original-site/html-snapshot"
OUT = "/Users/hiromu/dev/astra/web/content/manifest.json"
EXCLUDE_SUBSTR = ["不用品都市ごとテスト"]
LOGO = "https://pe-astra.com/wp-content/uploads/2021/08/logo-1.jpeg"
PLACEHOLDER = "all-in-one-seo-pack/images/default-user-image"


def g(doc, pattern):
    m = re.search(pattern, doc, re.I | re.S)
    return html.unescape(m.group(1)).strip() if m else ""


def meta_name(doc, name):
    return g(doc, rf'<meta[^>]+name=["\']{name}["\'][^>]+content=["\'](.*?)["\']') or \
           g(doc, rf'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']{name}["\']')


def meta_prop(doc, prop):
    return g(doc, rf'<meta[^>]+property=["\']{prop}["\'][^>]+content=["\'](.*?)["\']') or \
           g(doc, rf'<meta[^>]+content=["\'](.*?)["\'][^>]+property=["\']{prop}["\']')


def main():
    head_re = re.compile(r"<head>(.*?)</head>", re.I | re.S)
    manifest = {}
    for root, _, files in os.walk(SNAP):
        for fn in sorted(files):
            if not fn.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(root, fn), SNAP)
            if any(x in rel for x in EXCLUDE_SUBSTR):
                continue
            doc = open(os.path.join(root, fn), encoding="utf-8", errors="ignore").read()
            if '<footer id="gFooter"' not in doc or "</header>" not in doc:
                continue
            hm = head_re.search(doc)
            head = hm.group(1) if hm else doc

            title = re.sub(r"\s+", " ", g(head, r"<title>(.*?)</title>"))
            og_img = meta_prop(head, "og:image")
            if not og_img or PLACEHOLDER in og_img:
                og_img = LOGO  # プレースホルダは自社ロゴに置換（改善）
            robots = meta_name(head, "robots")
            manifest[rel] = {
                "title": title,
                "description": meta_name(head, "description"),
                "keywords": meta_name(head, "keywords"),
                "canonical": g(head, r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']'),
                "ogType": meta_prop(head, "og:type") or "website",
                "ogTitle": meta_prop(head, "og:title") or title,
                "ogDescription": meta_prop(head, "og:description"),
                "ogUrl": meta_prop(head, "og:url"),
                "ogSiteName": meta_prop(head, "og:site_name") or "不用品回収なら大阪のアストラ",
                "ogImage": og_img,
                "twitterCard": meta_name(head, "twitter:card") or "summary",
                "noindex": "noindex" in robots.lower(),
            }
    json.dump(manifest, open(OUT, "w"), ensure_ascii=False, indent=0)
    print(f"manifest: {len(manifest)} pages")
    # サンプル
    for k in ["index.html", "company/index.html", "blog/3207.html"]:
        if k in manifest:
            print(f"  {k}: title={manifest[k]['title'][:30]!r} ogImage={manifest[k]['ogImage'][-40:]}")


if __name__ == "__main__":
    main()
