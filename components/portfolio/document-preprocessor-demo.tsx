"use client";

import { useReducer } from "react";
import { DocumentPreprocessorPanel } from "@/components/portfolio/document-preprocessor-panel";
import {
  getDocumentPreprocessorState,
  reduceDocumentPreprocessorState,
} from "@/lib/document-preprocessor";

// The demo is always shown, so it starts in the open state with no toggle.
function getOpenState() {
  return reduceDocumentPreprocessorState(getDocumentPreprocessorState(), {
    type: "toggle",
  });
}

export function DocumentPreprocessorDemo() {
  const [state, dispatch] = useReducer(
    reduceDocumentPreprocessorState,
    undefined,
    getOpenState
  );

  return <DocumentPreprocessorPanel state={state} dispatch={dispatch} />;
}
