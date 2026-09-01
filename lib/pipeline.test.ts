import { describe, expect, it } from "vitest";
import {
  getActivePipelineItemId,
  getPipelineState,
  pipelineStageGroups,
  pipelineStages,
  getPipelineDetailPosition,
  reducePipelineState,
} from "@/lib/pipeline";

describe("document parsing pipeline contract", () => {
  it("defines the five-stage desktop and mobile flow with extractor targets", () => {
    expect(pipelineStages.map((stage) => stage.label)).toEqual([
      "NiFi",
      "문서 데이터 추출",
      "전처리기",
      "지식 DB 색인·저장",
      "LLM 모델의 응답 처리",
    ]);
    expect(
      pipelineStages.map((stage) =>
        "group" in stage ? stage.group : undefined
      )
    ).toEqual(["owned", "owned", "owned", "integrated", "integrated"]);
    expect(pipelineStages.every((stage) => !("badge" in stage))).toBe(true);
    expect(pipelineStageGroups.owned.map((stage) => stage.id)).toEqual([
      "nifi",
      "document-extractor",
      "preprocessor",
    ]);
    expect(pipelineStageGroups.integrated.map((stage) => stage.id)).toEqual([
      "index-store",
      "llm-response",
    ]);
    expect(
      pipelineStages[1].extractors?.map((extractor) => extractor.label)
    ).toEqual(["HWP", "PDF", "DOCX"]);
    expect(pipelineStages[3].stores?.map((store) => store.id)).toEqual([
      "bm25",
      "mongodb",
    ]);
  });

  it("keeps concise visible titles and explanatory detail for every target", () => {
    const entries = pipelineStages.flatMap((stage) => [
      stage,
      ...("extractors" in stage ? stage.extractors ?? [] : []),
      ...("stores" in stage ? stage.stores ?? [] : []),
    ]);

    expect(entries.map((entry) => [entry.title, entry.description])).toEqual([
      [
        "데이터 수집 스케줄링",
        "지정한 시간(Cron)에 따라 최신 문서를 수집하고 전처리 작업 지시합니다.",
      ],
      [
        "문서 추출 오케스트레이터",
        "문서 형식에 맞는 Extractor를 호출하고 내용을 추출합니다.",
      ],
      [
        "HWP Extractor",
        "공식 문서와 오픈소스를 조합해 한글 문서 구조를 추출했습니다.",
      ],
      [
        "PDF Extractor",
        "AI 모델을 탑재하고 오픈소스 모델 튜닝·학습을 담당했습니다.",
      ],
      ["DOCX Extractor", "오픈소스를 활용하여 문단과 표 구조를 추출했습니다."],
      [
        "텍스트 청킹·전처리",
        "Extractor와 상호작용하며 청킹·정제 과정을 오케스트레이션",
      ],
      [
        "검색·원문 데이터 적재",
        "BM25·MongoDB에 검색 데이터와 원문을 적재합니다.",
      ],
      [
        "BM25 키워드 색인",
        "조문 번호와 고유 표기를 찾을 수 있도록 키워드 기반 색인을 구성합니다.",
      ],
      ["MongoDB 원문 관리", "원문과 파싱 결과, 처리 메타데이터를 저장합니다."],
      ["근거 기반 응답 생성", "검색된 근거를 조합해 LLM 응답을 생성합니다."],
    ]);
  });
});

describe("document parsing pipeline state", () => {
  it("gives keyboard focus priority over pointer hover", () => {
    let state = getPipelineState();
    state = reducePipelineState(state, { type: "hover", id: "pdf" });
    state = reducePipelineState(state, { type: "focus", id: "docx" });

    expect(getActivePipelineItemId(state)).toBe("docx");
    expect(
      getActivePipelineItemId(
        reducePipelineState(state, { type: "clear-focus" })
      )
    ).toBe("pdf");
    expect(
      getActivePipelineItemId(
        reducePipelineState(
          reducePipelineState(state, { type: "clear-focus" }),
          { type: "clear-hover" }
        )
      )
    ).toBeNull();
  });

  it("does not retain a detail after its pointer hover leaves", () => {
    const hovered = reducePipelineState(getPipelineState(), {
      type: "hover",
      id: "document-extractor",
    });

    expect(getActivePipelineItemId(hovered)).toBe("document-extractor");
    expect(
      getActivePipelineItemId(
        reducePipelineState(hovered, { type: "clear-hover" })
      )
    ).toBeNull();
    expect(getPipelineState()).toEqual({ hoveredId: null, focusedId: null });
  });

  it("supports storage-target detail state", () => {
    const hovered = reducePipelineState(getPipelineState(), {
      type: "hover",
      id: "bm25",
    });

    expect(getActivePipelineItemId(hovered)).toBe("bm25");
    expect(pipelineStages[3].stores?.[0]).toMatchObject({
      title: "BM25 키워드 색인",
      description:
        "조문 번호와 고유 표기를 찾을 수 있도록 키워드 기반 색인을 구성합니다.",
    });
  });

  it("anchors edge store details inward for the active two-store row", () => {
    expect(getPipelineDetailPosition(0, 2)).toBe("left");
    expect(getPipelineDetailPosition(1, 2)).toBe("right");
    expect(getPipelineDetailPosition(0, 3)).toBe("left");
    expect(getPipelineDetailPosition(1, 3)).toBe("center");
    expect(getPipelineDetailPosition(2, 3)).toBe("right");
  });

  it("clears transient hover without closing a focused target", () => {
    const focused = reducePipelineState(
      reducePipelineState(getPipelineState(), {
        type: "hover",
        id: "llm-response",
      }),
      {
        type: "focus",
        id: "pdf",
      }
    );
    const focusedAfterLeave = reducePipelineState(focused, {
      type: "clear-hover",
    });

    expect(focusedAfterLeave.focusedId).toBe("pdf");
    expect(getActivePipelineItemId(focusedAfterLeave)).toBe("pdf");
  });

  it("does not create state work when transient hover is already clear", () => {
    const state = getPipelineState();

    expect(reducePipelineState(state, { type: "clear-hover" })).toBe(state);
  });
});
