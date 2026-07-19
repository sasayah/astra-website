import type { Metadata } from "next";
import { excerptOf, formatDate, isNew, listPosts, type PostDoc } from "@/app/lib/blog";

/** ブログ一覧（Payload DB駆動）。旧テーマの .comNewsList マークアップを踏襲。
 *  管理画面の更新を即時反映するためビルド時プリレンダはしない。 */
export const dynamic = "force-dynamic";

const NOIMG = "/wp-content/themes/ASTRA/img/news/noimage.jpg";

export const metadata: Metadata = {
  title: "ブログ | 不用品回収なら大阪のアストラ",
  description:
    "不用品回収アストラの作業ブログ。大阪を中心に関西一円で行った不用品回収・遺品整理の事例を紹介しています。",
  alternates: { canonical: "https://pe-astra.com/blog" },
};

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const res = await listPosts(page, 20);
  const posts = res.docs as PostDoc[];
  return (
    <div className="blog">
      <div className="pageTitle">
        <h2>
          <span className="inn">ブログ</span>
        </h2>
      </div>
      <section id="main">
        <div className="content">
          <ul className="comNewsList">
            {posts.map((p) => (
              <li key={p.id}>
                <a href={`/blog/${p.slug}.html`}>
                  <div className="flex">
                    <div className="photo">
                      <span
                        className="bgimg noimg"
                        style={{ backgroundImage: `url(${NOIMG})` }}
                      >
                        <img src={NOIMG} alt="NEWS" />
                      </span>
                    </div>
                    <div className="txtBox">
                      <p className="ttl">
                        <span className="date">{formatDate(p.publishedAt)}</span>
                        {p.title}
                        {isNew(p.publishedAt) ? <span className="new">NEW</span> : null}
                      </p>
                      <p>{excerptOf(p)}</p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {res.totalPages > 1 ? (
            <div className="blog-pager">
              {res.hasPrevPage ? (
                <a href={`/blog?page=${page - 1}`}>« 新しい記事</a>
              ) : (
                <span />
              )}
              <span className="blog-pager__info">
                {page} / {res.totalPages}ページ
              </span>
              {res.hasNextPage ? (
                <a href={`/blog?page=${page + 1}`}>過去の記事 »</a>
              ) : (
                <span />
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
