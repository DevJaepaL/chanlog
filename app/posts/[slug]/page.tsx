import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import Balancer from "react-wrap-balancer";
import { Mdx } from "@/components/mdx";
import { PostToc } from "@/components/post-toc";
import { extractToc } from "@/lib/toc";
import { formatPostDate, normalizePostTags } from "@/lib/posts";
import { profile } from "@/lib/profile";

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

  const tags = normalizePostTags(post.tags);

  return (
    <article className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-6">
      <header className="mx-auto mb-8 max-w-[45rem] border-b border-hairline pb-8 pt-8 sm:mb-10 sm:pb-10 sm:pt-14">
        {tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={tag}
                className={`inline-flex h-6 items-center rounded-md px-2 text-label ${
                  index === 0
                    ? "bg-primary-soft text-primary"
                    : "bg-canvas-muted text-ink-tertiary"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <h1 className="mt-4 break-keep text-heading-2 text-ink sm:text-heading-1">
          <Balancer>{post.title}</Balancer>
        </h1>
        <p className="mt-4 break-keep text-body-md text-ink-muted sm:text-body-lg">
          {post.summary}
        </p>
        <p className="mt-3 text-body-sm text-ink-muted">
          <span className="mr-2 font-semibold text-ink">{profile.name}</span>
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
        </p>
      </header>
      <div className="xl:grid xl:grid-cols-[minmax(0,45rem)_13.75rem] xl:justify-center xl:gap-x-16">
        <PostToc items={toc} />
        <div className="mx-auto min-w-0 max-w-[45rem] xl:col-start-1 xl:row-start-1 xl:mx-0">
          <Mdx code={post.body.code} />
        </div>
      </div>
    </article>
  );
};
export default Post;
