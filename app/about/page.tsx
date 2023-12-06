import type { Metadata } from "next";
import Balancer from "react-wrap-balancer";

export const metadata: Metadata = {
  title: "About",
  description: "소개하는 공간",
};

function About() {
  return (
    <>
      <section className="mb-12">
        <h3 className="text-4xl font-semibold">
          <Balancer>
            생각을 정리하고<br />
            순간을 기록하는 곳
          </Balancer>
        </h3>

        <div className="my-6 leading-7">
          <p>하루에 느꼈던 생각과 감정 그리고 공부한 것을 기록합니다.</p>
        </div>
        
      </section>
      <div className="w-[55%] my-[5%] border-[3px] border-black/40"></div>
      <section className="mb-10">
      </section>
      <section className="mb-10">
        <h4 className="mb-6 text-2xl font-semibold">Career</h4>
        <ul className="flex list-disc flex-col gap-1 px-4">
          <li>
            <div>
              <p>(주)그리드원 <span className="text-sm">2023.08 ~</span></p>
              <p className="text-sm">주요 업무 : 자사 솔루션 백엔드 & 클라우드 서비스 개발 및 유지보수</p>
            </div>
          </li>
        </ul>
      </section>
      <section>
        <h4 className="mb-6 text-2xl font-semibold">Experience</h4>
        <ul className="flex list-disc flex-col gap-1 px-4">
          <li>
            정보처리산업기사
          </li>
        </ul>
      </section>
    </>
  );
}
export default About;
