import { describe, expect, it } from "vitest";
import {
  getConnectorStatus,
  getPipelineRunState,
  getStepStatus,
  reducePipelineRun,
} from "@/lib/pipeline-run";

describe("pipeline run", () => {
  it("starts playing at the first step", () => {
    expect(getPipelineRunState()).toEqual({ index: 0, playing: true });
  });

  it("advances one step per tick, holds an all-done frame, then restarts", () => {
    let state = getPipelineRunState();
    const seen: number[] = [];
    for (let tick = 0; tick < 5; tick += 1) {
      state = reducePipelineRun(state, { type: "tick", count: 3 });
      seen.push(state.index);
    }
    expect(seen).toEqual([1, 2, 3, 0, 1]);
  });

  it("does not advance while paused", () => {
    const paused = reducePipelineRun(getPipelineRunState(), { type: "toggle" });
    expect(paused.playing).toBe(false);
    expect(reducePipelineRun(paused, { type: "tick", count: 3 })).toBe(paused);
    expect(reducePipelineRun(paused, { type: "toggle" }).playing).toBe(true);
  });

  it("steps manually with wrap-around and pauses playback", () => {
    const start = getPipelineRunState();
    expect(reducePipelineRun(start, { type: "next", count: 3 })).toEqual({ index: 1, playing: false });
    expect(reducePipelineRun(start, { type: "prev", count: 3 })).toEqual({ index: 2, playing: false });
    const done = { index: 3, playing: true };
    expect(reducePipelineRun(done, { type: "next", count: 3 })).toEqual({ index: 0, playing: false });
    expect(reducePipelineRun(done, { type: "prev", count: 3 })).toEqual({ index: 2, playing: false });
  });

  it("restarts from the first step and keeps playing", () => {
    expect(reducePipelineRun({ index: 2, playing: false }, { type: "restart" })).toEqual({
      index: 0,
      playing: true,
    });
  });

  it("marks earlier steps done, the current one running, and later ones waiting", () => {
    expect([0, 1, 2].map((step) => getStepStatus(1, step))).toEqual(["done", "running", "waiting"]);
    expect([0, 1, 2].map((step) => getStepStatus(3, step))).toEqual(["done", "done", "done"]);
  });

  it("fills connectors the data has crossed and animates the one it is crossing", () => {
    expect([0, 1].map((connector) => getConnectorStatus(1, connector))).toEqual(["entering", "idle"]);
    expect([0, 1].map((connector) => getConnectorStatus(2, connector))).toEqual(["filled", "entering"]);
    expect([0, 1].map((connector) => getConnectorStatus(3, connector))).toEqual(["filled", "filled"]);
  });
});
