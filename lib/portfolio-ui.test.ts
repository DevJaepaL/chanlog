import { Children, createElement, isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { About } from "@/components/home/about";
import { CareerTimeline } from "@/components/home/career-timeline";
import { ProjectList } from "@/components/home/project-list";
import { ProjectGallery } from "@/components/home/project-gallery";
import * as galleryModule from "@/components/home/project-gallery";
import * as rpaModule from "@/components/home/rpa-pipeline-disclosure";
import { PipelineDiagram } from "@/components/portfolio/pipeline-diagram";
import { AboutTabs } from "@/components/portfolio/about-tabs";
import { ABOUT_CARD } from "@/components/home/about-styles";
import PortfolioPage from "@/app/portfolio/page";
import { SkillGroups } from "@/components/home/skill-groups";
import { profile, projects, careers, skillGroups } from "@/lib/profile";

describe("portfolio UI", () => {
  it("preserves every original project, career, skill and introduction entry", () => {
    const markup = renderToStaticMarkup(createElement("main", null,
      createElement(About), createElement(ProjectList),
      createElement(CareerTimeline), createElement(SkillGroups)));
    const escaped = (value: string) => renderToStaticMarkup(createElement("span", null, value)).slice(6, -7);
    const originalText = [profile.about.greeting, ...profile.about.summaries.flat(),
      ...projects.flatMap(project => [project.title, project.org, project.period, project.role, ...project.experience, ...project.skills]),
      ...careers.flatMap(career => [career.company, career.period, career.summary, ...career.highlights]),
      ...skillGroups.flatMap(group => [group.category, ...group.items])];
    for (const text of originalText) expect(markup).toContain(escaped(text));
    expect(projects).toHaveLength(5);
    expect(markup).toContain('id="rpa-pipeline-panel"');
    expect(markup).toContain('id="document-preprocessor"');
    expect(markup.match(/aria-haspopup="dialog"/g)).toHaveLength(6);
  });
  it("renders About and Career as independent, non-nested sections", () => {
    const aboutMarkup = renderToStaticMarkup(createElement(About));
    const careerMarkup = renderToStaticMarkup(createElement(CareerTimeline));
    const markup = renderToStaticMarkup(
      createElement(
        "main",
        null,
        createElement(About),
        createElement(CareerTimeline)
      )
    );

    expect(aboutMarkup.match(/id="about"/g)).toHaveLength(1);
    expect(aboutMarkup).toContain("About");
    expect(aboutMarkup).toContain("소개");
    expect(aboutMarkup).not.toContain('id="career"');
    expect(aboutMarkup).toContain(
      "서버 개발 및 LLM &amp; RAG 관련 개발 업무를 진행해온 만 3년차 개발자 이재찬입니다."
    );
    expect(aboutMarkup).toContain(
      "안녕하세요.<br/>서버 개발 및 LLM &amp; RAG 관련 개발 업무를 진행해온 만 3년차 개발자 이재찬입니다."
    );
    expect(aboutMarkup.match(/<li/g)).toHaveLength(3);
    expect(aboutMarkup).toMatch(/<ol[^>]*class="[^"]*w-full[^"]*flex-col[^"]*"/);
    expect(
      [...aboutMarkup.matchAll(/<span class="sm:block">([^<]+)<\/span>/g)].map(
        ([, line]) => line
      )
    ).toEqual([
      "FastAPI를 활용한 백엔드 서비스 개발과 MSA 아키텍처 기반 서비스를",
      "실무에서 설계·개발해왔으며, 관련 기술을 익숙하게 다루고 있어요.",
      "공공기관 및 사규 문서 등 비정형 데이터 중심의 전처리 연구와",
      "개발 업무를 가장 많이 수행하며 관련 경험을 쌓아왔어요.",
      "RAG 아키텍처와 데이터 파이프라인 전반을 설계하고,",
      "오픈소스·오픈 모델을 실제 서비스에 적용한 경험이 있어요.",
    ]);
    expect(careerMarkup.match(/id="career"/g)).toHaveLength(1);
    expect(careerMarkup).toContain("Career");
    expect(careerMarkup).toContain("경력");
    expect(careerMarkup).toContain("㈜메타버스");
    expect(careerMarkup).toContain("㈜그리드원");
    expect(careerMarkup).toMatch(
      /<p[^>]*>공간정보 연구소<\/p><p[^>]*>백엔드·서버 개발<br\/><\/p>/
    );
    expect(careerMarkup).toMatch(
      /<p[^>]*>솔루션개발본부<\/p><p[^>]*>생성형 AI\(RAG\) 데이터 전처리 담당 및 개발<br\/><\/p>/
    );
    expect(careerMarkup).toMatch(/<ul[^>]*class="[^"]*list-disc[^"]*"/);
    expect(careerMarkup).not.toContain("before:content");
    expect(markup).toMatch(
      /<section id="about"[\s\S]*?<\/section><section id="career"/
    );
  });

  it("puts all projects after the introduction and before career and skills", () => {
    const page = PortfolioPage();
    const children = Children.toArray(page.props.children);

    expect(children).toHaveLength(5);
    expect(isValidElement(children[1]) && children[1].type).toBe(About);
    expect(isValidElement(children[2]) && children[2].type).toBe(
      ProjectList
    );
    expect(isValidElement(children[3]) && children[3].type).toBe(CareerTimeline);
  });

  it("keeps four local organization marks to the left of project titles and omits B은행's logo", () => {
    const markup = renderToStaticMarkup(createElement(ProjectList));

    expect(
      markup.match(/<img[^>]*src="\/images\/project-logos\//g)
    ).toHaveLength(4);
    expect(markup).toContain(
      'src="/images/project-logos/epis-ci.png" alt="농림수산식품교육문화정보원 로고"'
    );
    expect(markup).toContain(
      'src="/images/project-logos/k-water-ci.png" alt="한국수자원공사 K-water 로고"'
    );
    expect(markup).not.toContain("bnk-busan-bank-ci.jpg");
    expect(markup).not.toContain("BNK부산은행 로고");
    expect(markup).toContain(
      'src="/images/project-logos/gridone-logo.svg" alt="그리드원 로고"'
    );
    expect(markup).toContain(
      'src="/images/project-logos/shinhan-card-logo.gif" alt="신한카드 로고"'
    );
    expect(markup).toContain("농식품 팜맵 서비스 개선");
    expect(markup).toContain(
      "한국수자원공사 생성형 AI 서비스 시범사업 구축 및 운영"
    );
    expect(markup).toContain("B은행 생성형 AI 서비스 실증사업");
    expect(markup).toContain("그리드원 · B은행");
    expect(markup).toContain("생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션");

    const projectTitles = [
      "농식품 팜맵 서비스 개선",
      "한국수자원공사 생성형 AI 서비스 시범사업 구축 및 운영",
      "생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션",
      "신한카드 RPA 운영 고도화 프로젝트",
      "B은행 생성형 AI 서비스 실증사업",
    ];
    expect(projectTitles.map((title) => markup.indexOf(title))).toEqual(
      [...projectTitles.map((title) => markup.indexOf(title))].sort(
        (first, second) => first - second
      )
    );

    for (const [src, title] of [
      ["/images/project-logos/epis-ci.png", "농식품 팜맵 서비스 개선"],
      [
        "/images/project-logos/k-water-ci.png",
        "한국수자원공사 생성형 AI 서비스 시범사업 구축 및 운영",
      ],
      [
        "/images/project-logos/gridone-logo.svg",
        "생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션",
      ],
    ]) {
      expect(markup.indexOf(src)).toBeLessThan(markup.indexOf(title));
    }
    expect(markup).not.toMatch(
      /class="[^"]*border[^"]*bg-surface[^"]*"[^>]*>\s*<img/
    );
    expect(markup).toMatch(/<ul[^>]*class="[^"]*list-disc[^"]*"/);
    const firstProject = markup.slice(
      markup.indexOf("농식품 팜맵 서비스 개선"),
      markup.indexOf("한국수자원공사 생성형 AI 서비스 시범사업 구축 및 운영")
    );

    expect(firstProject).toMatch(
      /<h4[^>]*>역할<\/h4><p[^>]*>전국 단위 GIS 빅데이터 처리 및 프로세스 파이프라인 구성<\/p><h4[^>]*>담당 업무<\/h4><ul[^>]*class="[^"]*list-disc[^"]*"/
    );
    expect(firstProject).not.toContain("주요 역할");
    expect(firstProject).toMatch(
      /<h4[^>]*>사용 기술<\/h4>[\s\S]*?Python[\s\S]*?<h4[^>]*>역할<\/h4>/
    );
    expect(firstProject).toContain('aria-label="구현 화면 예시"');
    expect(firstProject).not.toContain(">구현 화면 예시<");
    expect(firstProject.match(/<figure/g)).toHaveLength(3);

    const documentProject = markup.slice(
      markup.indexOf("생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션"),
      markup.indexOf("신한카드 RPA 운영 고도화 프로젝트")
    );
    expect(documentProject).toContain("Document Extractor · Preprocessor");
    expect(documentProject).not.toContain("문서 전처리 파이프라인");
    expect(documentProject).toContain('id="document-preprocessor-panel"');

    const waterProject = markup.slice(
      markup.indexOf("한국수자원공사 생성형 AI 서비스 시범사업 구축 및 운영"),
      markup.indexOf("생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션")
    );
    expect(waterProject).toContain("문서 전처리 파이프라인");
    expect(waterProject).toContain(
      "url=%2Fimages%2Fproject-previews%2Fk-water-01.webp"
    );
    expect(waterProject).toContain('alt="K-water 생성형 AI 서비스 메인 화면"');
    expect(waterProject).toContain('loading="lazy"');
    expect(waterProject).toContain("data-nimg");
    expect(markup).toContain("신한카드 RPA 운영 고도화 프로젝트");
    expect(markup).toContain("RPA 이미지 처리 파이프라인");
  });

  it("keeps the document demo anchor in the ChatBot card and the pipeline in the K-water card", () => {
    const markup = renderToStaticMarkup(createElement(ProjectList));
    const documentProject = markup.slice(
      markup.indexOf("생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션"),
      markup.indexOf("신한카드 RPA 운영 고도화 프로젝트")
    );

    expect(markup.match(/id="document-preprocessor"/g)).toHaveLength(1);
    expect(documentProject).toContain('id="document-preprocessor"');
    expect(markup).toMatch(
      /<h3[^>]*>생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션<\/h3>[\s\S]*?<h4[^>]*>Document Extractor · Preprocessor<\/h4>[\s\S]*?신한카드 RPA 운영 고도화 프로젝트/
    );
    expect(markup.match(/id="pipeline-heading"/g)).toHaveLength(1);
    expect(markup).toMatch(
      /<h3[^>]*>한국수자원공사 생성형 AI 서비스 시범사업 구축 및 운영<\/h3>[\s\S]*?<h4 id="pipeline-heading"[\s\S]*?<h3[^>]*>생성형 AI ChatBot &amp; RAG/
    );
    expect(markup).not.toContain("주요 구현 성과");
    expect(markup).not.toContain(">Experience<");
  });

  it("keeps the RPA pipeline visible and makes the document action visually compact", () => {
    const markup = renderToStaticMarkup(createElement(ProjectList));
    const rpaProject = markup.slice(
      markup.indexOf("신한카드 RPA 운영 고도화 프로젝트"),
      markup.indexOf("B은행 생성형 AI 서비스 실증사업")
    );
    const documentProject = markup.slice(
      markup.indexOf("생성형 AI ChatBot &amp; RAG · 문서 처리 솔루션"),
      markup.indexOf("신한카드 RPA 운영 고도화 프로젝트")
    );

    expect(rpaProject).not.toContain("파이프라인 보기");
    // Projects now collapse as a whole (About accordion); the pipeline itself has no extra toggle
    // and stays in the server markup while its project is collapsed.
    expect(rpaProject.match(/aria-expanded=/g)).toHaveLength(1);
    expect(rpaProject).toContain('id="rpa-pipeline-panel"');
    expect(rpaProject).toContain('id="rpa-pipeline-heading"');
    expect(rpaProject).toContain("RPA 이미지 처리 파이프라인");
    expect(rpaProject).toMatch(
      /BPR 서버[\s\S]*Java 스케줄러[\s\S]*이미지 다운로드[\s\S]*RPA Cloud 전달[\s\S]*OCR MSA/
    );
    // The document demo is always visible (no 구현 예시 toggle).
    expect(documentProject).not.toContain("구현 예시");
    expect(documentProject).toContain('id="document-preprocessor-panel"');
  });

  it("renders gallery images without visible per-image captions while retaining accessible names", () => {
    const markup = renderToStaticMarkup(
      createElement(ProjectGallery, {
        previews: [
          {
            label: "내부용 이미지 설명",
            src: "/images/example.png",
            alt: "접근 가능한 예시 화면",
          },
          { label: "대기 화면" },
        ],
      })
    );

    expect(markup.match(/<figure/g)).toHaveLength(2);
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain("url=%2Fimages%2Fexample.png");
    expect(markup).toContain('alt="접근 가능한 예시 화면"');
    expect(markup).toContain("data-nimg");
    expect(markup).toContain("aspect-video");
    expect(markup).toContain("대기 화면 · 이미지 추가 예정");
    expect(markup).toContain('aria-label="접근 가능한 예시 화면 확대 보기"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain('aria-label="이미지 미리보기"');
    expect(markup).not.toContain(">내부용 이미지 설명<");
    expect(markup).not.toContain("<figcaption");
  });

  it("renders the enlarged image without a caption and uses an icon-only accessible close control", () => {
    const Dialog = (
      galleryModule as typeof galleryModule & {
        ProjectGalleryDialog?: (props: {
          preview: {
            label: string;
            src: string;
            alt: string;
            width?: number;
            height?: number;
          };
        }) => JSX.Element;
      }
    ).ProjectGalleryDialog;

    expect(Dialog).toBeTypeOf("function");
    if (!Dialog) return;

    const markup = renderToStaticMarkup(
      createElement(Dialog, {
        preview: {
          label: "내부용 이미지 설명",
          src: "/images/example.png",
          alt: "접근 가능한 예시 화면",
        },
      })
    );

    expect(markup).toContain('alt="접근 가능한 예시 화면"');
    expect(markup).toContain('aria-label="이미지 미리보기 닫기"');
    expect(markup).toContain("<svg");
    expect(markup).not.toContain("<figcaption");
    expect(markup).not.toContain(">닫기<");
    expect(markup).not.toContain(">내부용 이미지 설명<");
  });

  it("closes the gallery for the dialog backdrop and padded surface, but not the image", () => {
    const isOutsideImageClick = (
      galleryModule as typeof galleryModule & {
        isProjectGalleryOutsideImageClick?: (
          target: EventTarget | null,
          image: EventTarget | null
        ) => boolean;
      }
    ).isProjectGalleryOutsideImageClick;

    expect(isOutsideImageClick).toBeTypeOf("function");
    if (!isOutsideImageClick) return;

    const dialog = new EventTarget();
    const paddedSurface = new EventTarget();
    const image = new EventTarget();

    expect(isOutsideImageClick(dialog, image)).toBe(true);
    expect(isOutsideImageClick(paddedSurface, image)).toBe(true);
    expect(isOutsideImageClick(image, image)).toBe(false);
  });

  it("opens and closes the gallery selection through a pure reducer contract", () => {
    const reducer = (
      galleryModule as typeof galleryModule & {
        reduceProjectGalleryState?: (
          state: { selectedIndex: number | null },
          event: { type: "open"; index: number } | { type: "close" }
        ) => { selectedIndex: number | null };
      }
    ).reduceProjectGalleryState;

    expect(reducer).toBeTypeOf("function");
    if (!reducer) return;

    const opened = reducer({ selectedIndex: null }, { type: "open", index: 1 });
    expect(opened).toEqual({ selectedIndex: 1 });
    expect(reducer(opened, { type: "close" })).toEqual({ selectedIndex: null });
    const closed = { selectedIndex: null };
    expect(reducer(closed, { type: "close" })).toBe(closed);
  });

  it("collapses each project to its summary while keeping every detail in the markup", () => {
    const markup = renderToStaticMarkup(createElement(ProjectList));
    const toggles = [
      ...markup.matchAll(/<button[^>]*aria-expanded="false"[^>]*aria-controls="(project-\d+-detail)"[^>]*aria-labelledby="(project-\d+-title)"/g),
    ];

    expect(toggles).toHaveLength(projects.length);
    for (const [, detailId, titleId] of toggles) {
      expect(markup).toMatch(new RegExp(`<h3 id="${titleId}"`));
      expect(markup).toMatch(new RegExp(`<div id="${detailId}"[^>]*hidden=""`));
    }
    expect(markup).toContain(">모두 펼치기<");
    // Summary keeps title and skills visible; role and duties live in the collapsed detail.
    expect(markup).toMatch(/<h3 id="project-0-title"[\s\S]*?사용 기술[\s\S]*?<div id="project-0-detail"[^>]*hidden=""[^>]*>[\s\S]*?역할/);
  });

  it("opens only 소개 by default and folds the other About sections behind their heading buttons", () => {
    const about = renderToStaticMarkup(createElement(About));
    expect(about).toMatch(
      /<h2[^>]*><button type="button" aria-expanded="true" aria-controls="about-content"/
    );
    expect(about).not.toMatch(/<div id="about-content"[^>]*hidden/);

    for (const [Component, id] of [
      [ProjectList, "projects"],
      [CareerTimeline, "career"],
      [SkillGroups, "skills"],
    ] as const) {
      const markup = renderToStaticMarkup(createElement(Component));
      expect(markup).toMatch(
        new RegExp(`<h2[^>]*><button type="button" aria-expanded="false" aria-controls="${id}-content"`)
      );
      expect(markup).toMatch(new RegExp(`<div id="${id}-content"[^>]*hidden=""`));
    }
  });

  it("uses one card style and one title size for every About item", () => {
    const markup = renderToStaticMarkup(
      createElement("main", null,
        createElement(About), createElement(ProjectList),
        createElement(CareerTimeline), createElement(SkillGroups))
    );
    const cards = markup.split(`class="${ABOUT_CARD}`).length - 1;
    // 3 소개 lines + 5 projects + 2 careers + 6 skill groups
    expect(cards).toBe(3 + projects.length + careers.length + skillGroups.length);
    const titleTexts = [...projects.map((p) => p.title), ...careers.map((c) => c.company)].map(
      (text) => text.replace(/&/g, "&amp;")
    );
    const itemTitles = [...markup.matchAll(/<h3[^>]*class="([^"]*)"[^>]*>([^<]*)<\/h3>/g)]
      .filter(([, , text]) => titleTexts.includes(text))
      .map(([, cls]) => cls);
    expect(itemTitles).toHaveLength(titleTexts.length);
    expect(new Set(itemTitles).size).toBe(1);
  });

  it("offers sticky jump tabs for each About section", () => {
    const markup = renderToStaticMarkup(createElement(AboutTabs));
    expect(markup).toContain('aria-label="About 섹션 바로가기"');
    expect(
      [...markup.matchAll(/href="#([a-z]+)"/g)].map(([, id]) => id)
    ).toEqual(["about", "projects", "career", "skills"]);
    expect(markup).toContain("sticky");
  });

  it("renders the five-stage RPA run with one connector for each handoff", () => {
    const Flow = (
      rpaModule as typeof rpaModule & {
        RpaPipelineFlow?: () => JSX.Element;
      }
    ).RpaPipelineFlow;

    expect(Flow).toBeTypeOf("function");
    if (!Flow) return;

    const markup = renderToStaticMarkup(createElement(Flow));
    expect(markup).toContain('aria-label="RPA 이미지 처리 흐름"');
    expect(markup).toContain('aria-labelledby="rpa-development-area"');
    expect(markup).toMatch(
      /BPR 서버[\s\S]*Java 스케줄러[\s\S]*이미지 다운로드[\s\S]*RPA Cloud 전달[\s\S]*OCR MSA/
    );
    expectRunScreen(markup, 5);
  });

  it("shows every document stage with its title, extractor and store chips inside the run screen", () => {
    const markup = renderToStaticMarkup(createElement(PipelineDiagram));

    expect(markup).toContain("문서 전처리 파이프라인");
    expect(markup).toContain("<fieldset");
    expect(markup).toContain("개발 영역");
    expect(markup).toMatch(
      /<fieldset[^>]*class="[^"]*border-2[^"]*border-dashed[^"]*border-primary/
    );
    expect(markup).toContain('aria-label="문서 형식별 Extractor"');
    expect(markup).toContain('aria-label="연동 저장소"');
    expect(markup).not.toContain(">담당<");
    expect(markup).not.toContain(">연동<");
    for (const text of [
      "NiFi",
      "문서 데이터 추출",
      "전처리기",
      "지식 DB 색인·저장",
      "LLM 모델의 응답 처리",
      "HWP",
      "PDF",
      "DOCX",
      "BM25",
      "MongoDB",
      // Stage titles are now visible on each card (run-screen redesign).
      "데이터 수집 스케줄링",
      "근거 기반 응답 생성",
    ]) {
      expect(markup).toContain(text);
    }
    expect(markup).not.toContain("Chroma");
    const storeButtons = [
      ...markup.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g),
    ].filter(([, button]) =>
      ["BM25", "MongoDB"].some((store) => button.includes(`<span>${store}</span>`))
    );
    expect(storeButtons).toHaveLength(2);
    for (const [, button] of storeButtons) expect(button).toContain("<svg");
    expect(markup).not.toContain("aria-pressed");
    expectRunScreen(markup, 5);
  });
});

// "실행 화면형": one status per step, connectors between steps, and a step board with controls.
function expectRunScreen(markup: string, steps: number) {
  const statuses = [...markup.matchAll(/data-step-status="(\w+)"/g)].map(([, status]) => status);
  expect(statuses).toEqual(["running", ...Array(steps - 1).fill("waiting")]);
  expect(markup.match(/data-connector="/g)).toHaveLength(steps - 1);
  for (const label of ["이전 단계", "일시정지", "다음 단계"]) {
    expect(markup).toContain(`aria-label="${label}"`);
  }
  expect(markup).toContain(`01/${String(steps).padStart(2, "0")} · 처리 중`);
  expect(markup).not.toContain("pipeline-packet");
  expect(markup).not.toContain("--flow-at");
}
