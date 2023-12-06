import Image from "next/image";
import avatar from "app/avatar.jpg";

export default function Home() {
  return (
    <section className="break-keep">
      <div className="my-4 flex items-center gap-8">
        <div className="flex h-[100px] w-[100px] flex-shrink-0 md:h-[125px] md:w-[125px]">
          <Image
            src={avatar}
            alt="이재찬"
            placeholder="blur"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="max-w-sm leading-7">
            <h4 className="inline-block text-2xl font-bold">이재찬</h4>
            <h3 className="text-gray-500">생각을 정리하고 순간을 기록하는 곳</h3>
        </div>
      </div>
      <div className="pt-5 leading-7">
      </div>
    </section>
  );
}
