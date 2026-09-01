import { describe, expect, it } from "vitest";
import { extractToc } from "@/lib/toc";

describe("extractToc", () => {
  it("h2와 h3만 추출하고 레벨을 기록한다", () => {
    const raw = ["# 제목", "## 설치", "### 요구사항", "#### 무시됨"].join("\n");

    expect(extractToc(raw)).toEqual([
      { id: "설치", text: "설치", level: 2 },
      { id: "요구사항", text: "요구사항", level: 3 },
    ]);
  });

  it("코드블록 안의 주석을 헤딩으로 오인하지 않는다", () => {
    const raw = ["## 진짜 헤딩", "```bash", "## 가짜 헤딩", "```"].join("\n");

    expect(extractToc(raw)).toHaveLength(1);
    expect(extractToc(raw)[0].text).toBe("진짜 헤딩");
  });

  it("중복 헤딩에 서로 다른 id를 부여한다", () => {
    const raw = ["## 설정", "## 설정"].join("\n");
    const toc = extractToc(raw);

    expect(toc[0].id).not.toBe(toc[1].id);
  });

  it("마크다운 문법을 제거한 텍스트를 쓴다", () => {
    const raw = "## `코드` 와 **굵게** 와 [링크](https://example.com)";

    expect(extractToc(raw)[0].text).toBe("코드 와 굵게 와 링크");
  });

  it("헤딩이 없으면 빈 배열을 반환한다", () => {
    expect(extractToc("본문만 있습니다.")).toEqual([]);
  });
});
