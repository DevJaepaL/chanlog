import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Info",
  description: "소개하는 공간",
};

export default function Info() {
  return (
    <section className="break-keep">      
      <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-300 mb-10"/>      
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col mb-10 justify-items-center">
          <h4 className="mb-6 text-2xl font-semibold">Career 💼</h4>
          <ul className="flex list-disc flex-col gap-1 px-4 mb-10">
            <li>                
              <p>(주)그리드원 <span className="text-sm">2023.08 ~</span></p>
              <p className="text-sm">주요 업무 : 자사 솔루션 백엔드 & 클라우드 서비스 개발 및 유지보수</p>                
            </li>
          </ul>
          <h4 className="mb-6 text-2xl font-semibold">Stack 👨‍💻</h4>
          <ul className="flex list-disc flex-col gap-1 px-4 mb-10">
            <li>
              <p className="text-sm">Java ☕ - JVM, 객체지향 개념과 몇가지의 디자인 패턴 이해, Spring 웹 프레임워크</p>
            </li>
            <li>
              <p className="text-sm">Python 🐍 - 데이터 핸들링 및 전처리, 머신러닝 & LLM 기초 지식 이해</p>
            </li>
          </ul>
          <div className="w-[100%] my-[5%] border-[2px] border-black/60"></div>          
        </div>
      </div>
    </section>
  );
}
