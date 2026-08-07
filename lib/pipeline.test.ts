import { describe, expect, it } from "vitest";
import {
  CHUNK_MAX_CHARS,
  CHUNK_MIN_CHARS,
  demoDocuments,
  extractionComparison,
  indexTargets,
  pipelineStages,
} from "@/lib/pipeline";

describe("pipelineStages", () => {
  it("5단계로 구성된다", () => {
    expect(pipelineStages).toHaveLength(5);
  });

  it("모든 단계에 id가 유일하다", () => {
    const ids = pipelineStages.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 단계에 상세 설명이 있다", () => {
    for (const stage of pipelineStages) {
      expect(stage.label).toBeTruthy();
      expect(stage.caption).toBeTruthy();
      expect(stage.detail.length).toBeGreaterThan(10);
    }
  });
});

describe("demoDocuments", () => {
  it("최소 2종의 문서 유형을 제공한다", () => {
    expect(demoDocuments.length).toBeGreaterThanOrEqual(2);
  });

  it("모든 문서에 출처가 명시되어 있다", () => {
    for (const doc of demoDocuments) {
      expect(doc.source).toBeTruthy();
    }
  });

  it("모든 문서에 경계 규칙이 있다", () => {
    for (const doc of demoDocuments) {
      expect(doc.boundaryRules.length).toBeGreaterThan(0);
    }
  });

  it("청크 id가 문서 안에서 유일하다", () => {
    for (const doc of demoDocuments) {
      const ids = doc.chunks.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("청크 문자 수가 선언된 범위 안에 있다", () => {
    for (const doc of demoDocuments) {
      for (const chunk of doc.chunks) {
        expect(chunk.charCount).toBeGreaterThan(0);
        expect(chunk.charCount).toBeLessThanOrEqual(CHUNK_MAX_CHARS);
      }
    }
  });

  it("헤더가 반복된 청크는 직전 청크와 같은 계층 경로를 갖는다", () => {
    for (const doc of demoDocuments) {
      doc.chunks.forEach((chunk, i) => {
        if (!chunk.headerRepeated) return;
        expect(i).toBeGreaterThan(0);
        expect(doc.chunks[i - 1].path).toBe(chunk.path);
      });
    }
  });

  it("계층 트리가 참조하는 청크는 실제로 존재한다", () => {
    for (const doc of demoDocuments) {
      const chunkIds = new Set(doc.chunks.map((c) => c.id));
      for (const node of doc.hierarchy) {
        if (node.chunkId) expect(chunkIds.has(node.chunkId)).toBe(true);
      }
    }
  });

  it("청크 상한이 하한보다 크다", () => {
    expect(CHUNK_MAX_CHARS).toBeGreaterThan(CHUNK_MIN_CHARS);
  });
});

describe("indexTargets", () => {
  it("담당 범위와 연동 범위를 구분한다", () => {
    expect(indexTargets.some((t) => t.owned)).toBe(true);
    expect(indexTargets.some((t) => !t.owned)).toBe(true);
  });

  it("어떤 항목에도 수치 스코어를 담지 않는다", () => {
    for (const target of indexTargets) {
      expect(target.description).not.toMatch(/\d+\.\d{2}/);
    }
  });
});

describe("extractionComparison", () => {
  it("naive와 structured 두 결과를 모두 갖는다", () => {
    expect(extractionComparison.naive.output).toBeTruthy();
    expect(extractionComparison.structured.output).toBeTruthy();
  });
});
