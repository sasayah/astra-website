#!/usr/bin/env python3
"""全スナップショットHTMLから本文領域を抽出し、URLをローカル相対化して
content/pages 配下に出力。タイトル/メタ情報を manifest.json に集約する。"""
import os, re, json, html

SNAP = "/Users/hiromu/dev/astra/original-site/html-snapshot"
OUT = "/Users/hiromu/dev/astra/web/content/pages"
MANIFEST = "/Users/hiromu/dev/astra/web/content/manifest.json"

# 移行対象外
EXCLUDE_SUBSTR = ["不用品都市ごとテスト"]


def localize(s: str) -> str:
    s = re.sub(r"https?://pe-astra\.com", "", s)
    s = re.sub(r'(?<=["\'(\s])//pe-astra\.com', "", s)
    return s


def meta_of(doc: str):
    def tag(pattern):
        m = re.search(pattern, doc, re.I | re.S)
        return html.unescape(m.group(1)).strip() if m else ""
    title = re.sub(r"\s+", " ", tag(r"<title>(.*?)</title>"))
    desc = tag(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']')
    if not desc:
        desc = tag(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']')
    canon = tag(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']')
    canon = localize(canon)
    return title, desc, canon


def main():
    manifest = {}
    ok = skip = 0
    skipped = []
    for root, _, files in os.walk(SNAP):
        for fn in sorted(files):
            if not fn.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(root, fn), SNAP)
            if any(x in rel for x in EXCLUDE_SUBSTR):
                skip += 1
                continue
            doc = open(os.path.join(root, fn), encoding="utf-8", errors="ignore").read()
            i = doc.find("</header>")
            j = doc.find('<footer id="gFooter"')
            if i == -1 or j == -1:
                skip += 1
                skipped.append(rel)
                continue
            body = localize(doc[i + len("</header>"):j]).strip()
            title, desc, canon = meta_of(doc)
            out = os.path.join(OUT, rel)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "w", encoding="utf-8").write(body)
            manifest[rel] = {"title": title, "description": desc, "canonical": canon}
            ok += 1
    json.dump(manifest, open(MANIFEST, "w"), ensure_ascii=False, indent=0)
    print(f"抽出: {ok}  スキップ: {skip}")
    for s in skipped[:20]:
        print("  skip(marker無):", s)


if __name__ == "__main__":
    main()
