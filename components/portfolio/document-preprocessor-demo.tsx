"use client";

import Image from "next/image";
import { useReducer, useRef } from "react";
import {
  documentPreprocessorDemo,
  getActiveDocumentRegion,
  getDocumentPreprocessorState,
  reduceDocumentPreprocessorState,
  type DocumentRegion,
  type DocumentRegionId,
} from "@/lib/document-preprocessor";

const accentStyles = {
  orange: "border-accent-orange bg-accent-orange/10",
  teal: "border-accent-teal bg-accent-teal/10",
  purple: "border-accent-purple bg-accent-purple/10",
  sky: "border-accent-sky bg-accent-sky/10",
};

const accentBorderStyles = {
  orange: "border-accent-orange",
  teal: "border-accent-teal",
  purple: "border-accent-purple",
  sky: "border-accent-sky",
};

function ResultContent({ region }: { region: DocumentRegion }) {
  const { result } = region;
  if (result.kind === "text") {
    return (
      <h4 className="mt-2 text-body-md font-semibold text-ink">
        {result.lines[0]}
      </h4>
    );
  }
  if (result.kind === "list") {
    return (
      <ul className="mt-2 space-y-1 text-body-sm text-ink-secondary">
        {result.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    );
  }
  if (result.kind === "table") {
    return (
      <div className="mt-2 overflow-hidden rounded-md border border-hairline">
        <table className="w-full table-fixed text-left text-caption text-ink-secondary">
          <thead className="bg-canvas-soft text-ink">
            <tr>
              {result.columns.map((column) => (
                <th key={column} scope="col" className="p-2">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.label} className="border-t border-hairline">
                <th scope="row" className="p-2 text-ink">
                  {row.label}
                </th>
                {row.cells.map((cell) => (
                  <td key={cell} className="break-words p-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if ("label" in result) {
    return (
      <figure className="mt-2 text-body-sm text-ink-secondary">
        <p className="font-medium text-ink">{result.label}</p>
        <figcaption>{result.caption}</figcaption>
      </figure>
    );
  }
  return null;
}

export function DocumentPreprocessorDemo() {
  const [state, dispatch] = useReducer(
    reduceDocumentPreprocessorState,
    undefined,
    getDocumentPreprocessorState
  );
  const actionRef = useRef<HTMLButtonElement>(null);
  const activeRegion = getActiveDocumentRegion(state);

  const hover = (region: DocumentRegionId) =>
    dispatch({ type: "hover", region });
  const clearHover = () => dispatch({ type: "clear-hover" });
  const focus = (region: DocumentRegionId) =>
    dispatch({ type: "focus", region });
  const clearFocus = () => dispatch({ type: "clear-focus" });
  const togglePin = (region: DocumentRegionId) =>
    dispatch({ type: "toggle-pin", region });
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
        className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-button text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {state.isOpen
          ? documentPreprocessorDemo.actions.expanded
          : documentPreprocessorDemo.actions.collapsed}
      </button>

      {state.isOpen && (
        <div id={documentPreprocessorDemo.panelId} className="basis-full pt-6">
          <div className="grid gap-6 rounded-lg border border-hairline bg-surface p-4 sm:grid-cols-2 sm:p-6">
            <div>
              <h3 className="mb-3 text-title text-ink">원본 1쪽</h3>
              <div className="relative overflow-hidden rounded-md border border-hairline bg-canvas-soft">
                <Image
                  src={documentPreprocessorDemo.image.src}
                  width={documentPreprocessorDemo.image.width}
                  height={documentPreprocessorDemo.image.height}
                  alt={documentPreprocessorDemo.image.alt}
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="h-auto w-full"
                />
                {documentPreprocessorDemo.regions.map((region) => {
                  const active = activeRegion === region.id;
                  return (
                    <div
                      key={`${region.id}-outline`}
                      aria-hidden="true"
                      style={{
                        left: `${region.rect.x * 100}%`,
                        top: `${region.rect.y * 100}%`,
                        width: `${region.rect.width * 100}%`,
                        height: `${region.rect.height * 100}%`,
                      }}
                      className={`pointer-events-none absolute rounded-xs border-2 transition-colors motion-reduce:transition-none ${
                        accentStyles[region.accent]
                      } ${
                        active
                          ? "outline outline-2 outline-offset-2 outline-primary"
                          : ""
                      }`}
                    >
                      <span className="absolute left-0 top-0 bg-surface px-1 text-eyebrow text-ink">
                        {region.label}
                      </span>
                    </div>
                  );
                })}
                {documentPreprocessorDemo.regions.map((region) => {
                  const active = activeRegion === region.id;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      aria-label={region.accessibleName}
                      aria-pressed={state.pinnedRegion === region.id}
                      onMouseEnter={() => hover(region.id)}
                      onMouseLeave={clearHover}
                      onFocus={() => focus(region.id)}
                      onBlur={clearFocus}
                      onClick={() => togglePin(region.id)}
                      style={{
                        left: `${region.marker.point.x * 100}%`,
                        top: `${region.marker.point.y * 100}%`,
                      }}
                      className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-surface text-button text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none ${
                        accentBorderStyles[region.accent]
                      } ${active ? "outline outline-2 outline-primary" : ""}`}
                    >
                      <span aria-hidden="true">{region.marker.number}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-title text-ink">구조 결과</h3>
              <div className="space-y-3">
                {documentPreprocessorDemo.regions.map((region) => {
                  const active = activeRegion === region.id;
                  return (
                    <div
                      key={region.id}
                      className="rounded-md border border-hairline p-3"
                    >
                      <button
                        type="button"
                        aria-label={region.accessibleName}
                        aria-pressed={state.pinnedRegion === region.id}
                        onMouseEnter={() => hover(region.id)}
                        onMouseLeave={clearHover}
                        onFocus={() => focus(region.id)}
                        onBlur={clearFocus}
                        onClick={() => togglePin(region.id)}
                        className={`flex min-h-11 w-full items-center gap-2 rounded-md text-left text-button text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none ${
                          active ? "outline outline-2 outline-primary" : ""
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-caption ${
                            accentStyles[region.accent]
                          }`}
                        >
                          {region.marker.number}
                        </span>
                        <span>{region.label}</span>
                      </button>
                      <ResultContent region={region} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-3 text-caption text-ink-muted">
            {documentPreprocessorDemo.source}
          </p>
        </div>
      )}
    </>
  );
}
