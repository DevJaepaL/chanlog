// Step-by-step playback for the "실행 화면형" pipeline diagrams.
// `index` is the running step; `index === count` is the all-done frame
// shown once before the run restarts from the first step.

export interface PipelineRunState {
  index: number;
  playing: boolean;
}

export type PipelineRunEvent =
  | { type: "tick"; count: number }
  | { type: "next"; count: number }
  | { type: "prev"; count: number }
  | { type: "toggle" }
  | { type: "restart" };

export type StepStatus = "done" | "running" | "waiting";
export type ConnectorStatus = "filled" | "entering" | "idle";

export function getPipelineRunState(): PipelineRunState {
  return { index: 0, playing: true };
}

export function reducePipelineRun(
  state: PipelineRunState,
  event: PipelineRunEvent
): PipelineRunState {
  switch (event.type) {
    case "tick":
      if (!state.playing) return state;
      return { ...state, index: state.index >= event.count ? 0 : state.index + 1 };
    case "next":
      return { index: state.index >= event.count - 1 ? 0 : state.index + 1, playing: false };
    case "prev":
      return {
        index: state.index <= 0 || state.index >= event.count ? event.count - 1 : state.index - 1,
        playing: false,
      };
    case "toggle":
      return { ...state, playing: !state.playing };
    case "restart":
      return getPipelineRunState();
  }
}

export function getStepStatus(index: number, step: number): StepStatus {
  if (step < index) return "done";
  return step === index ? "running" : "waiting";
}

// Connector k joins step k and step k + 1.
export function getConnectorStatus(index: number, connector: number): ConnectorStatus {
  if (index > connector + 1) return "filled";
  return index === connector + 1 ? "entering" : "idle";
}
