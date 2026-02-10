import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import Balancer from "react-wrap-balancer";
import { Mdx } from "@/components/mdx";
import { PostToc } from "@/components/post-toc";
import { extractToc } from "@/lib/toc";

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = allPosts.find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }
  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    slug,
  } = post;

  return {
    title,
    description,
    openGraph: {
      title: { absolute: title },
      description,
      type: "article",
      publishedTime,
      url: `https://localhost/posts/${slug}`,
    },
  };
}

const Post = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === params.slug);
  if (!post) {
    return false;
  }
  const toc = extractToc(post.body.raw);

  return (
    <>
      <PostToc items={toc} title={post.title} />
      <section className="text-stone-800">
        <div className="mb-4 text-stone-800">
          {/* <img src={post.thumbnail} className="mb-10 w-auto h-56 object-over rounded-xl"></img>         */}
          <p className="mb-1 text-xl font-semibold text-stone-800 sm:text-2xl">
            <Balancer>{post.title}</Balancer>
          </p>
          <h4 className="text-sm font-light text-gray-700 sm:text-base ">
            {post.summary}
          </h4>
          <p>
            <small>{post.publishedAt}</small>{" "}
          </p>
        </div>
        <div className="my-[5%] w-[100%] border-[1px] border-black/100"></div>

        <Mdx code={post.body.code} />
      </section>
    </>
  );
};
export default Post;
