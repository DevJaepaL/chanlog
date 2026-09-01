import { describe, expect, it } from "vitest";
import {
  careers,
  contacts,
  profile,
  projects,
  skillGroups,
} from "@/lib/profile";
import * as accent from "@/lib/accent";

const ACCENTS = ["sky", "purple", "pink", "orange", "teal", "green"];

describe("profile 데이터", () => {
  it("기본 프로필 필드와 구조화한 소개 문단이 있다", () => {
    expect(profile.name.length).toBeGreaterThan(0);
    expect(profile.role.length).toBeGreaterThan(0);
    expect(profile.about.greeting.length).toBeGreaterThan(0);
    expect(profile.about.summaries).toHaveLength(3);
  });

  it("경력은 최신순으로 정렬되어 있다", () => {
    const starts = careers.map((c) => c.startedAt);
    const sorted = [...starts].sort().reverse();
    expect(starts).toEqual(sorted);
  });

  it("모든 경력에 현재 공개하는 필수 필드가 있다", () => {
    for (const career of careers) {
      expect(career.company).toBeTruthy();
      expect(career.period).toBeTruthy();
      expect(career.highlights.length).toBeGreaterThan(0);
    }
  });

  it("프로젝트는 포트폴리오 서사에 맞춘 공개 순서를 유지한다", () => {
    expect(projects.map((project) => project.title)).toEqual([
      "농식품 팜맵 서비스 개선",
      "생성형 AI ChatBot & RAG · 문서 처리 솔루션",
      "한국수자원공사 생성형 AI 서비스 시범사업 및 운영",
      "신한카드 RPA 운영 고도화 프로젝트",
      "B은행 생성형 AI 서비스 실증사업",
    ]);
  });

  it("팜맵·K-water 화면과 신한카드 RPA 프로젝트의 공개 계약을 유지한다", () => {
    const farmMapProject = projects.find(
      (project) => project.client === "농정원"
    );
    const kWaterProject = projects.find(
      (project) => project.client === "한국수자원공사"
    );
    const rpaProject = projects.find(
      (project) => project.detail === "rpa-ocr-pipeline"
    );

    expect(farmMapProject?.previews).toEqual([
      {
        label: "영상 기반 객체 판별 흐름",
        src: "/images/project-previews/farm-map-01.png",
        alt: "항공정사영상에서 SegFormer·Pix2Poly·Swin Transformer를 거쳐 HITL과 QGIS 작업자가 검토하는 객체 판별 흐름",
        width: 643,
        height: 306,
      },
      {
        label: "팜맵 데이터 추출·가공 흐름",
        src: "/images/project-previews/farm-map-02.png",
        alt: "갱신 후·전 팜맵, LX맵, 경작신고 농경지에서 데이터를 수집·연계·추출하고 로그와 메타데이터를 관리하는 흐름",
        width: 802,
        height: 242,
      },
      {
        label: "팜맵 애플리케이션 컴포넌트 구조",
        src: "/images/project-previews/farm-map-03.png",
        alt: "전자정부 표준 프레임워크의 디자인과 기반소스 코드 위에 업무·공통·공간정보 공통 컴포넌트를 구성한 구조",
        width: 771,
        height: 457,
      },
    ]);
    expect(kWaterProject?.previews).toEqual([
      {
        label: "메인 화면",
        src: "/images/project-previews/k-water-01.webp",
        alt: "K-water 생성형 AI 서비스 메인 화면",
      },
      {
        label: "질의응답 화면",
        src: "/images/project-previews/k-water-02.webp",
        alt: "K-water 생성형 AI 서비스 질의응답 화면",
      },
      {
        label: "보고서 생성 화면",
        src: "/images/project-previews/k-water-03.webp",
        alt: "K-water 생성형 AI 서비스 보고서 생성 화면",
      },
    ]);
    expect(rpaProject).toMatchObject({
      title: "신한카드 RPA 운영 고도화 프로젝트",
      org: "그리드원",
      client: "신한카드",
      period: "2025.04 ~ 2025.06",
      startedAt: "2025-04",
      role: "기존 운영 업무 시간 단축을 위한 모듈 및 파이프라인 개발",
      skills: ["Java", "Cron Scheduler", "RPA", "Spring", "MSA"],
      detail: "rpa-ocr-pipeline",
    });
    expect(rpaProject?.experience).toEqual([
      "BPR 서버의 대규모 이미지를 OCR 처리 대상으로 선별 및 다운로드하는 Java 모듈 개발",
      "다운로드한 이미지를 RPA Cloud의 OCR MSA로 전달하는 연동 흐름 구현",
      "전체 처리 과정을 매일 실행하도록 스케줄링하여 반복 운영 업무 시간 단축",
    ]);
    expect(rpaProject?.previews).toBeUndefined();
    expect(rpaProject?.logo).toMatchObject({
      src: "/images/project-logos/shinhan-card-logo.gif",
      alt: "신한카드 로고",
    });
    expect(projects.indexOf(rpaProject!)).toBe(3);
  });

  it("ChatBot/RAG 프로젝트에 문서 처리 상세 공개 계약을 연결한다", () => {
    const documentProject = projects.find(
      (project) => project.detail === "document-preprocessor-pipeline"
    );

    expect(documentProject).toMatchObject({
      title: "생성형 AI ChatBot & RAG · 문서 처리 솔루션",
      role: "PDF·DOCX·HWP 문서 구조 추출 및 전처리 초기 개발",
      detail: "document-preprocessor-pipeline",
    });
    expect(documentProject?.experience).toEqual([
      "PDF·DOCX·HWP 문서의 제목·본문·표·그림을 구조 단위로 추출·전처리",
      "문서 처리에 활용할 오픈소스와 오픈 모델을 연구·탐색",
      "문서 전처리 초기 개발에 기여",
    ]);
  });

  it("모든 프로젝트에 필수 필드가 있다", () => {
    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.org).toBeTruthy();
      expect(project.period).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(project.experience.length).toBeGreaterThan(0);
      expect(project.skills.length).toBeGreaterThan(0);
      if (project.previews) {
        expect(project.previews).toHaveLength(3);
        for (const preview of project.previews) {
          expect(preview.label).toBeTruthy();
          expect(preview.src).toBeTruthy();
          expect(preview.alt).toBeTruthy();
        }
      }
      if (project.logo) {
        expect(project.logo.src).toMatch(/^\/images\/project-logos\//);
        expect(project.logo.alt.length).toBeGreaterThan(0);
      }
    }
  });

  it("B은행 프로젝트는 client 표기와 무로고 계약을 유지한다", () => {
    const bnkProject = projects.find((project) => project.client === "B은행");

    expect(bnkProject?.title).toBe("B은행 생성형 AI 서비스 실증사업");
    expect(bnkProject?.logo).toBeUndefined();
  });

  it("uses the supplied high-resolution organization-mark metadata", () => {
    const episProject = projects.find((project) => project.client === "농정원");
    const kWaterProject = projects.find(
      (project) => project.client === "한국수자원공사"
    );

    expect(episProject?.logo).toMatchObject({
      src: "/images/project-logos/epis-ci.png",
      width: 783,
      height: 500,
    });
    expect(kWaterProject?.logo).toMatchObject({
      src: "/images/project-logos/k-water-ci.png",
      width: 2508,
      height: 1134,
    });
  });

  it("소개는 세 개의 compact note를 두 개의 의미 단위 문장으로 제공한다", () => {
    expect(profile.about.greeting).toBe(
      "서버 개발 및 LLM & RAG 관련 개발 업무를 진행해온 만 3년차 개발자 이재찬입니다."
    );
    expect(profile.about.summaries).toEqual([
      [
        "FastAPI를 활용한 백엔드 서비스 개발과 MSA 아키텍처 기반 서비스를",
        "실무에서 설계·개발해왔으며, 관련 기술을 익숙하게 다루고 있어요.",
      ],
      [
        "공공기관 및 사규 문서 등 비정형 데이터 중심의 전처리 연구와",
        "개발 업무를 가장 많이 수행하며 관련 경험을 쌓아왔어요.",
      ],
      [
        "RAG 아키텍처와 데이터 파이프라인 전반을 설계하고,",
        "오픈소스·오픈 모델을 실제 서비스에 적용한 경험이 있어요.",
      ],
    ]);
  });

  it("스킬 그룹의 accent가 유효한 토큰이다", () => {
    for (const group of skillGroups) {
      expect(ACCENTS).toContain(group.accent);
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("스킬 그룹 accent는 서로 중복되지 않는다", () => {
    const used = skillGroups.map((g) => g.accent);
    expect(new Set(used).size).toBe(used.length);
  });

  it("모든 프로젝트 기술은 Skills taxonomy와 같은 accent를 가진다", () => {
    const resolve = (
      accent as typeof accent & {
        projectSkillAccent?: (skill: string) => string | undefined;
      }
    ).projectSkillAccent;

    expect(resolve).toBeTypeOf("function");
    if (!resolve) return;

    const expectedAccents = {
      Python: "orange",
      PyQGIS: "sky",
      PyQt6: "green",
      GIS: "sky",
      Docker: "sky",
      "Mongo DB": "pink",
      RAG: "purple",
      FastAPI: "teal",
      Java: "orange",
      "Cron Scheduler": "sky",
      RPA: "teal",
      Spring: "teal",
      MSA: "teal",
      "데이터 전처리": "purple",
      LangChain: "purple",
      LangGraph: "purple",
    } as const;

    expect(
      Object.fromEntries(
        projects.flatMap((project) =>
          project.skills.map((skill) => [skill, resolve(skill)])
        )
      )
    ).toEqual(expectedAccents);
  });

  it("연락처 href가 mailto 또는 https로 시작한다", () => {
    for (const contact of contacts) {
      expect(contact.href).toMatch(/^(mailto:|https:\/\/)/);
    }
  });

  it("renames Email to Contact while preserving the shared mailto destination", () => {
    expect(contacts.map((contact) => contact.label)).toEqual([
      "Contact",
      "GitHub",
      "Instagram",
    ]);
    expect(contacts[0]).toEqual({
      label: "Contact",
      href: "mailto:wocks3254@gmail.com",
    });
  });
});
