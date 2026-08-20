import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import Balancer from "react-wrap-balancer";
import { Mdx } from "@/components/mdx";
import { PostToc } from "@/components/post-toc";
import { extractToc } from "@/lib/toc";

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = allPosts.find((item) => item.slug === params.slug);
  if (!post) return;

  const { title, publishedAt: publishedTime, summary: description, slug } = post;

  return {
    title,
    description,
    openGraph: {
      title: { absolute: title },
      description,
      type: "article",
      publishedTime,
      url: `https://chanlog.blog/posts/${slug}`,
    },
  };
}

const Post = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();
  const toc = extractToc(post.body.raw);

  return (
    <>
      <PostToc items={toc} title={post.title} />
      <article className="mx-auto w-full max-w-3xl px-6 py-16">
        <header className="mb-8 border-b border-hairline pb-6">
          <p className="text-caption text-ink-faint">{post.publishedAt}</p>
          <h1 className="mt-2 break-keep text-heading-2 text-ink sm:text-heading-1">
            <Balancer>{post.title}</Balancer>
          </h1>
          <p className="mt-2 break-keep text-body-md text-ink-muted">
            {post.summary}
          </p>
        </header>
        <Mdx code={post.body.code} />
      </article>
    </>
  );
};
export default Post;
