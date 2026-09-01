"use client";

import { useReducer, useRef } from "react";
import { DocumentPreprocessorPanel } from "@/components/portfolio/document-preprocessor-panel";
import {
  documentPreprocessorDemo,
  getDocumentPreprocessorState,
  reduceDocumentPreprocessorState,
} from "@/lib/document-preprocessor";

export function DocumentPreprocessorDemo() {
  const [state, dispatch] = useReducer(
    reduceDocumentPreprocessorState,
    undefined,
    getDocumentPreprocessorState
  );
  const actionRef = useRef<HTMLButtonElement>(null);

  const toggleOpen = () => {
    if (!state.isOpen) {
      dispatch({ type: "toggle" });
      return;
    }
    dispatch({ type: "close" });
    window.requestAnimationFrame(() => actionRef.current?.focus());
  };

  return (
    <>
      <button
        ref={actionRef}
        type="button"
        aria-expanded={state.isOpen}
        aria-controls={documentPreprocessorDemo.panelId}
        onClick={toggleOpen}
        className="inline-flex min-h-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <span className="inline-flex h-8 items-center rounded-full bg-primary px-3 text-caption text-surface">
          {state.isOpen
            ? documentPreprocessorDemo.actions.expanded
            : documentPreprocessorDemo.actions.collapsed}
        </span>
      </button>
      {state.isOpen && (
        <DocumentPreprocessorPanel state={state} dispatch={dispatch} />
      )}
    </>
  );
}
