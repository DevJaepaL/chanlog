import Image from "next/image";
import avatar from "app/avatar.jpg";
import Link from "next/link";
import { allPosts } from ".contentlayer/generated";

export default function Home() {
  return (
    <section className="break-keep">
      <div className="my-4 flex items-center gap-8">
        <div className="flex h-[150px] w-[220px] flex-shrink-0 md:h-[200px] md:w-[300px]">
          <Image
            src={avatar}
            alt="이재찬"
            placeholder="blur"
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
        <div className="max-w-lg leading-6">
          <p className="font-bold text-3xl">Jae Chan <span className="text-xs text-zinc-400">Back-End Developer</span></p>
          <p className="mb-1">생각을 정리하고 순간을 잊지 않도록 기록합니다.</p>          
        </div>        
      </div>
      <p className="">
            먼저, 블로그에 와주신 모든 분들을 환영합니다.<br/>
            이곳을 만든 이유는 나만의 형태에 맞는 공간을 만들고 생각을 글로 정리하고 싶었어요.<br/>
            주로 다룰 글은 기술적인 내용이며 공간이 다듬어지는데로 일기와 앨범도 다룰 예정이에요.
      </p>        
      <div className="w-[100%] my-[5%] border-[3px] border-black/40"></div>
      <section className="mb-10">
      <h1 className="mb-6 text-2xl font-bold">최근 작성한 글</h1>
      {allPosts
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;

          return 1;
        })
        .map((post) => (
          <article key={post.slug} className="mb-6 border-solid border-2 p-3">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <h6 className="my-1 text-sm font-normal text-gray-400">
                {post.summary}
              </h6>
              <p>
                <small className="mr-2">{post.publishedAt}</small>
              </p>
            </Link>
          </article>
        ))}
      </section>          
    </section>
  );
}
