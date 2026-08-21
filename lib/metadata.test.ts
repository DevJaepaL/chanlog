import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  ])(
    "preserves the complete Open Graph contract for $name",
    ({ title, description, url }) => {
      const metadata = createLandingMetadata({ title, description, url });

      expect(metadata.alternates).toEqual({ canonical: url });
      expect(metadata.openGraph).toEqual({
        title,
        description,
        url,
        locale: "ko_KR",
        type: "website",
        siteName: "Chanlog",
      });
    }
  );

  it("keeps portfolio canonical metadata and removes pipeline landing metadata", () => {
    const portfolioPage = readFileSync(
      resolve("app/portfolio/page.tsx"),
      "utf8"
    );
    expect(portfolioPage).toContain('url: "https://chanlog.blog/portfolio"');
    expect(portfolioPage).not.toContain("chanlog.blog/pipeline");
    expect(existsSync(resolve("app/pipeline/page.tsx"))).toBe(false);
  });
});
