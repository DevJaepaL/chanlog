import { describe, expect, it } from "vitest";
import {
  getActiveRpaPipelineItemId,
  getRpaPipelineState,
  reduceRpaPipelineState,
  rpaPipelineGroups,
  rpaPipelineStages,
} from "@/lib/rpa-pipeline";

describe("RPA 이미지 처리 파이프라인 계약", () => {
  it("defines ordered external, owned, and integrated stages", () => {
    expect(rpaPipelineStages.map((stage) => stage.label)).toEqual([
      "BPR 서버",
      "Java 스케줄러",
      "이미지 다운로드",
      "RPA Cloud 전달",
      "OCR MSA",
    ]);
    expect(rpaPipelineGroups.owned.map((stage) => stage.id)).toEqual([
      "java-scheduler",
      "image-download",
      "rpa-cloud",
    ]);
  });

  it("opens details for hover or focus and closes all transient detail", () => {
    let state = reduceRpaPipelineState(getRpaPipelineState(), {
      type: "open",
    });
    expect(state.isOpen).toBe(true);
    state = reduceRpaPipelineState(state, {
      type: "hover",
      id: "java-scheduler",
    });
    expect(getActiveRpaPipelineItemId(state)).toBe("java-scheduler");

    state = reduceRpaPipelineState(state, { type: "focus", id: "ocr-msa" });
    expect(getActiveRpaPipelineItemId(state)).toBe("ocr-msa");
    const closed = reduceRpaPipelineState(state, { type: "close" });
    expect(closed.isOpen).toBe(false);
    expect(getActiveRpaPipelineItemId(closed)).toBeNull();
  });
});
