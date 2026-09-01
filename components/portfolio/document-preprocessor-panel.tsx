"use client";

import type { Dispatch } from "react";
import Image from "next/image";
import {
  DOCUMENT_REGION_MARKER_TARGET_SIZE,
  DOCUMENT_REGION_MARKER_VISUAL_SIZE,
  documentPreprocessorDemo,
  getActiveDocumentRegion,
  type DocumentPreprocessorEvent,
  type DocumentPreprocessorState,
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
      <h4 className="mt-1 text-body-sm font-semibold text-ink">
        {result.lines[0]}
      </h4>
    );
  }
  if (result.kind === "list") {
    return (
      <ul className="mt-1 space-y-0.5 text-caption text-ink-secondary">
        {result.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    );
  }
  if (result.kind === "table") {
    return (
      <div className="mt-1 overflow-hidden rounded-md border border-hairline">
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
      <figure className="mt-1 text-caption text-ink-secondary">
        <p className="font-medium text-ink">{result.label}</p>
        <figcaption>{result.caption}</figcaption>
      </figure>
    );
  }
  return null;
}

function DocumentRegionOutline({
  region,
  rect,
  active,
  onHover,
  onLeave,
  onSelect,
}: {
  region: DocumentRegion;
  rect: DocumentRegion["rect"];
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      tabIndex={-1}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
      onClick={onSelect}
      style={{
        left: `${rect.x * 100}%`,
        top: `${rect.y * 100}%`,
        width: `${rect.width * 100}%`,
        height: `${rect.height * 100}%`,
      }}
      className={`absolute z-[1] cursor-pointer rounded-xs ${
        active ? "border-[3px]" : "border-2"
      } transition-colors motion-reduce:transition-none ${
        accentStyles[region.accent]
      }`}
    />
  );
}

function DocumentMarkerVisual({
  number,
  accent,
  active,
}: {
  number: DocumentRegion["marker"]["number"];
  accent: DocumentRegion["accent"];
  active: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: DOCUMENT_REGION_MARKER_VISUAL_SIZE,
        height: DOCUMENT_REGION_MARKER_VISUAL_SIZE,
      }}
      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 bg-surface text-[10px] text-ink ${
        accentBorderStyles[accent]
      } ${active ? "outline outline-2 outline-primary" : ""}`}
    >
      {number}
    </span>
  );
}

function DocumentPreprocessorPreview() {
  return (
    <div className="mt-3 border border-hairline bg-canvas-soft px-3 py-2">
      <p className="text-eyebrow uppercase text-ink-muted">
        {documentPreprocessorDemo.preview.label}
      </p>
      <p className="mt-1 break-keep text-body-sm text-ink-secondary">
        <span aria-hidden="true">
          {documentPreprocessorDemo.preview.marker} ·
        </span>{" "}
        {documentPreprocessorDemo.preview.field} —{" "}
        {documentPreprocessorDemo.preview.text}
      </p>
    </div>
  );
}

export function DocumentPreprocessorPanel({
  state,
  dispatch,
}: {
  state: DocumentPreprocessorState;
  dispatch: Dispatch<DocumentPreprocessorEvent>;
}) {
  const activeRegion = getActiveDocumentRegion(state);
  const regions: readonly DocumentRegion[] = documentPreprocessorDemo.regions;

  const hover = (region: DocumentRegionId) =>
    dispatch({ type: "hover", region });
  const clearHover = () => dispatch({ type: "clear-hover" });
  const focus = (region: DocumentRegionId) =>
    dispatch({ type: "focus", region });
  const clearFocus = () => dispatch({ type: "clear-focus" });
  const togglePin = (region: DocumentRegionId) =>
    dispatch({ type: "toggle-pin", region });

  return (
    <div id={documentPreprocessorDemo.panelId} className="basis-full pt-6">
      <div className="grid gap-4 rounded-lg border border-hairline bg-surface p-3 sm:grid-cols-2 sm:p-4">
        <div>
          <h3 className="mb-2 text-body-sm text-ink">원본 1쪽</h3>
          <div className="relative overflow-hidden rounded-md border border-hairline bg-canvas-soft">
            <Image
              src={documentPreprocessorDemo.image.src}
              width={documentPreprocessorDemo.image.width}
              height={documentPreprocessorDemo.image.height}
              alt={documentPreprocessorDemo.image.alt}
              sizes="(min-width: 768px) 42vw, 100vw"
              className="h-auto w-full"
            />
            {regions.flatMap((region) => {
              const active = activeRegion === region.id;
              return [
                <DocumentRegionOutline
                  key={`${region.id}-outline`}
                  region={region}
                  rect={region.rect}
                  active={active}
                  onHover={() => hover(region.id)}
                  onLeave={clearHover}
                  onSelect={() => togglePin(region.id)}
                />,
                ...(region.detectedRects ?? []).map((rect, index) => (
                  <DocumentRegionOutline
                    key={`${region.id}-detected-${index}`}
                    region={region}
                    rect={rect}
                    active={active}
                    onHover={() => hover(region.id)}
                    onLeave={clearHover}
                    onSelect={() => togglePin(region.id)}
                  />
                )),
              ];
            })}
            {regions.map((region) => {
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
                    width: DOCUMENT_REGION_MARKER_TARGET_SIZE,
                    height: DOCUMENT_REGION_MARKER_TARGET_SIZE,
                  }}
                  className="absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none"
                >
                  <DocumentMarkerVisual
                    number={region.marker.number}
                    accent={region.accent}
                    active={active}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-body-sm text-ink">구조 결과</h3>
          <div className="space-y-2">
            {regions.map((region) => {
              const active = activeRegion === region.id;
              return (
                <div
                  key={region.id}
                  className={`rounded-md border-2 ${
                    active ? "border-primary" : "border-hairline"
                  } p-2 transition-colors motion-reduce:transition-none`}
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
                    className="flex min-h-11 w-full items-center gap-2 rounded-md text-left text-body-sm font-medium text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none"
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
                  {region.supplementalDetections && (
                    <p className="mt-2 break-keep text-caption text-ink-secondary">
                      {region.supplementalDetections.join(" ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 text-caption text-ink-muted">
        {documentPreprocessorDemo.source}
      </p>
      {/* <DocumentPreprocessorPreview /> */}
    </div>
  );
}
