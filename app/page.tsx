import Image from "next/image";
import avatar from "app/avatar.jpg";
import Link from "next/link";
import { allPosts } from ".contentlayer/generated";

export default function Home() {
  return (
    <section className="break-keep">
      <div className="my-3 flex flex-col items-center gap-4">
        <div className="flex h-[250px] w-[250px] flex-shrink-0 md:h-[250px] md:w-[250px]">
          <Image
            src={avatar}
            alt="이재찬"
            placeholder="blur"
            className="h-full w-full rounded-full object-cover"
          />
        </div>                
        <p className="font-bold text-3xl">Jae Chan</p>
        <small className="text-xs text-zinc-400">Back-End Developer</small>
        <p className="mb-1 text-sm">바삐 흘러가는 중심에서<br/>생각을 정리하고 순간을 기록합니다.</p>
      </div>      
      <div className="w-[100%] my-[5%] border-[3px] border-black/40"></div>
      <section className="mb-10">
      <h1 className="mb-6 text-3xl font-bold">최근 작성한 글</h1>
      {allPosts
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;

          return 1;
        })
        .map((post) => (
          <article key={post.slug} className="mb-6">            
            <Link href={`/posts/${post.slug}`} className="flex flex-row">
              <img src={post.thumbnail} placeholder="blur" className="mr-4 w-52 h-24 object-cover border-solid border-3 rounded-lg"/>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold">{post.title}</h2>
                <h6 className="my-1 text-sm font-normal text-gray-400">
                  {post.summary}
                </h6>
                <p><small className="mr-2">{post.publishedAt}</small></p>
              </div>              
            </Link>            
          </article>
        ))}
      </section>                      
    </section>    
  );
}
