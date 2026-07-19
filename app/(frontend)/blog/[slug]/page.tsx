import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  adjacentPosts,
  excerptOf,
  formatDate,
  isNew,
  postBySlug,
} from "@/app/lib/blog";

/** ブログ記事（Payload DB駆動）。URLは旧サイト互換の /blog/{slug}.html。
 *  旧記事は bodyHtml をそのまま描画、管理画面で書いた記事は content(richtext) を描画。 */
export const dynamic = "force-dynamic";

function slugOf(param: string): string {
  return decodeURIComponent(param).replace(/\.html$/, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await postBySlug(slugOf(slug));
  if (!post) return {};
  const url = `https://pe-astra.com/blog/${post.slug}.html`;
  return {
    title: `${post.title} | 不用品回収なら大阪のアストラ`,
    description: excerptOf(post, 110),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      url,
      siteName: "不用品回収なら大阪のアストラ",
      images: [{ url: "https://pe-astra.com/wp-content/uploads/2021/08/logo-1.jpeg" }],
      locale: "ja_JP",
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await postBySlug(slugOf(slug));
  if (!post) notFound();
  const hasRichText = Boolean(
    post.content && (post.content as { root?: unknown }).root,
  );

  // 旧記事: bodyHtml が .blog.detail のラッパー・見出し・記事ナビまで含む完全な断片
  if (!hasRichText) {
    return <div dangerouslySetInnerHTML={{ __html: post.bodyHtml ?? "" }} />;
  }

  // 管理画面で作成した記事: richtext を旧テーマ互換のマークアップで描画
  const { prev, next } = await adjacentPosts(post);
  return (
    <div className="blog detail">
      <div className="pageTitle">
        <h2>
          <span className="inn">ブログ</span>
        </h2>
      </div>
      <section id="main">
        <div className="content">
          <h3>
            <span className="txt">
              {post.title}
              {isNew(post.publishedAt) ? <span className="new">NEW</span> : null}
            </span>
            <span className="date">{formatDate(post.publishedAt)}</span>
          </h3>
          <div className="editBox">
            <RichText data={post.content as SerializedEditorState} />
          </div>
          <div className="blog-postnav">
            {next ? <a href={`/blog/${next.slug}.html`}>« 後の記事へ</a> : <span />}
            <a href="/blog" className="blog-postnav__index">
              一覧に戻る
            </a>
            {prev ? <a href={`/blog/${prev.slug}.html`}>前の記事へ »</a> : <span />}
          </div>
        </div>
      </section>
    </div>
  );
}
