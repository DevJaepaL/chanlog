import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import Balancer from "react-wrap-balancer";
import { Mdx } from "@/components/mdx";
import Image from "next/image";

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

  return (    
    <section>            
      <div className="mb-4">
        <img src={post.thumbnail} className="mb-10 w-auto h-auto rounded-xl"></img>        
        <p className="mb-1 text-4xl font-semibold">
          <Balancer>{post.title}</Balancer>
        </p>
        <h4 className="font-light text-gray-700 ">
          {post.summary}
        </h4>
        <p>
        <small>{post.publishedAt}</small>{" "}
        </p>
      </div>
      <div className="w-[90%] my-[5%] border-[1px] border-black/100"></div>

      <Mdx code={post.body.code} />
    </section>
  );
};
export default Post;
