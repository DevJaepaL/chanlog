import { describe, expect, it } from "vitest";
import { createLandingMetadata } from "@/lib/metadata";

describe("landing page metadata", () => {
  it.each([
    {
      name: "archive",
      title: "아카이브",
      description: "백엔드·AI·데이터 파이프라인에 관한 이재찬의 기술 아카이브.",
      url: "https://chanlog.blog/",
    },
    {
      name: "portfolio",
      title: "포트폴리오",
      description: "이재찬의 백엔드·AI 엔지니어 경력, 프로젝트, 기술 역량",
      url: "https://chanlog.blog/portfolio",
    },
    {
      name: "pipeline",
      title: "문서 전처리 파이프라인",
      description:
        "공개 자료를 이용한 문서 구조 파싱·계층 인식 청킹·이중 색인 사례 연구",
      url: "https://chanlog.blog/pipeline",
    },
  ])("preserves the complete Open Graph contract for $name", ({
    title,
    description,
    url,
  }) => {
    const metadata = createLandingMetadata({ title, description, url });

    expect(metadata.openGraph).toEqual({
      title,
      description,
      url,
      locale: "ko_KR",
      type: "website",
      siteName: "Chanlog",
    });
  });
});
