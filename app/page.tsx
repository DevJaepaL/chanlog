import Image from "next/image";
import avatar from "app/avatar.jpg";
import Link from "next/link";
import { allPosts } from ".contentlayer/generated";

export default function Home() {
  return (
    <section className="break-keep">
      <div className="my-3 flex flex-col items-center gap-4 text-stone-900">
        <div className="flex h-[250px] w-[250px] flex-shrink-0 md:h-[200px] md:w-[200px]">
          <Image
            src={avatar}
            alt="이재찬"
            placeholder="blur"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center my-3">
          <p className="font-bold text-3xl text-stone-800">Jae Chan</p>
          <p className=" mb-2 text-xs text-zinc-400">Back-End Developer</p>
          <p className="mb-1 text-sm">바삐 흘러가는 중심에서</p>
          <p className="mb-1 text-sm">순간을 기록하고자 노력합니다.</p>
        </div>        
      </div>      
      <div className="w-[100%] my-[3%] border-[2px] border-black/60"></div>
      <section className="mb-10">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">최근 작성한 글</h1>
      {allPosts
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;

          return 1;
        })
        .map((post) => (
          <article key={post.slug} className="mb-6">            
            <Link href={`/posts/${post.slug}`} className="flex flex-row">
              <img src={post.thumbnail} placeholder="blur" className="mr-4 w-52 h-28 object-cover border-solid border-3 rounded-lg"/>
              <div className="flex flex-col justify-center text-stone-900">
                <h2 className="text-2xl font-bold">{post.title}</h2>
                <h6 className="my-1 text-sm font-normal text-stone-700">
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
