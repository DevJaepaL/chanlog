import type { Metadata } from "next";
import Image from "next/image";
import background from "app/bg.jpg"

export const metadata: Metadata = {
  title: "Info",
  description: "소개하는 공간",
};

export default function Info() {
  return (
    <section className="break-keep">      
      <section className="mb-10">
      <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-300 mb-10"/>      
        <h4 className="mb-6 text-2xl font-semibold">Career 💼</h4>
        <ul className="flex list-disc flex-col gap-1 px-4">
          <li>
            <div>
              <p>(주)그리드원 <span className="text-sm">2023.08 ~</span></p>
              <p className="text-sm">주요 업무 : 자사 솔루션 백엔드 & 클라우드 서비스 개발 및 유지보수</p>
            </div>
          </li>
        </ul>
      </section>      
      <section className="mb-10">    
        <h4 className="mb-6 text-2xl font-semibold">Stack 👨‍💻</h4>
        <ul className="flex list-disc flex-col gap-1 px-4">
          <li>
              <p className="text-sm">Java ☕ - JVM, 객체지향 개념과 몇가지의 디자인 패턴 이해, Spring 웹 프레임워크</p>
          </li>
          <li>
              <p className="text-sm">Python 🐍 - 데이터 핸들링 및 전처리, 머신러닝 & LLM 기초 지식 이해</p>
          </li>
        </ul>
      </section>      
      <section className="mb-10">
        <h4 className="mb-6 text-2xl font-semibold">Experience 🌠</h4>
        <ul className="flex list-disc flex-col gap-1 px-4">
          <li>
            <div>
              <a href="https://github.com/DevJaepaL/TodayBooks" target="_blank">
                <p className="font-semi-bold underline underline-offset-4 hover:font-bold">
                  <strong>오책볼래?</strong>
                </p>
              </a>              
              <p className="text-sm">소개 : 하루마다 사용자의 취향에 맞는 책을 추천해주는 앱</p>
              <span className="text-sm"> 2023. 06 ~ 07</span>
            </div>
          </li>
          <li>
            <div>
              <a href="https://quado-jjkl.web.app/" target="_blank">
                <p className="font-semi-bold underline underline-offset-4 hover:font-bold">
                  <strong>To Do Challenge</strong>
                </p>
              </a>              
              <p className="text-sm">소개 : 크로스플랫폼 기반의 심플한 To-Do 관리 Web App</p>
              <span className="text-sm"> 2023. 03 ~ 06</span>
            </div>
          </li>
        </ul>        
      </section>  
    </section>
  );
}
