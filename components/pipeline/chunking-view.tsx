"use client";

import { useState } from "react";
import {
  CHUNK_MAX_CHARS,
  CHUNK_MIN_CHARS,
  type DemoDocument,
} from "@/lib/pipeline";

export function ChunkingView({ documents }: { documents: DemoDocument[] }) {
  const [activeId, setActiveId] = useState(documents[0]?.id ?? "");
  const doc = documents.find((item) => item.id === activeId) ?? documents[0];

  if (!doc) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {documents.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            aria-pressed={item.id === doc.id}
            className={`rounded-full px-4 py-1.5 text-caption transition-colors ${
              item.id === doc.id
                ? "bg-secondary text-surface"
                : "border border-hairline bg-surface text-ink-muted hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-hairline bg-surface p-6">
        <p className="mb-3 text-eyebrow uppercase text-ink-faint">적용 경계 규칙</p>
        <div className="flex flex-wrap gap-2">
          {doc.boundaryRules.map((rule) => (
            <code
              key={rule}
              className="rounded-xs bg-canvas-soft px-2 py-1 text-caption text-ink-secondary"
            >
              {rule}
            </code>
          ))}
        </div>
        <p className="mt-4 break-keep text-caption text-ink-faint">
          고정 길이로 자르면 조문 중간이 끊깁니다. 계층 경계를 먼저 확정한 뒤 그 안에서만
          분할하고, 상한({CHUNK_MIN_CHARS.toLocaleString()}–
          {CHUNK_MAX_CHARS.toLocaleString()}자)을 넘으면 헤더를 유지한 채 분리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-hairline bg-surface p-6">
          <p className="mb-3 text-eyebrow uppercase text-ink-faint">인식된 계층</p>
          <ul className="flex flex-col gap-1">
            {doc.hierarchy.map((node) => (
              <li
                key={node.id}
                className={
                  node.level === 1
                    ? "text-body-sm font-semibold text-ink"
                    : node.level === 2
                      ? "ml-3 border-l border-hairline pl-3 text-body-sm text-ink-secondary"
                      : "ml-6 border-l border-hairline pl-3 text-caption text-ink-faint"
                }
              >
                {node.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-6">
          <p className="mb-3 text-eyebrow uppercase text-ink-faint">생성된 청크</p>
          <ul className="flex flex-col gap-3">
            {doc.chunks.map((chunk) => (
              <li
                key={chunk.id}
                className="rounded-r-md border-l-[3px] border-accent-teal bg-canvas-soft px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-semibold text-accent-teal">
                    {chunk.id}
                  </span>
                  <span className="text-caption text-ink-faint">
                    {chunk.charCount.toLocaleString()}자
                  </span>
                </div>
                <p className="mt-1 text-caption text-ink-faint">
                  {chunk.path}
                  {chunk.headerRepeated && (
                    <span className="ml-2 text-accent-orange">(헤더 유지)</span>
                  )}
                </p>
                <p className="mt-2 break-keep text-body-sm text-ink-secondary">
                  {chunk.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-caption text-ink-faint">
        출처: {doc.source}
        {doc.disclaimer ? ` — ${doc.disclaimer}` : ""}
      </p>
    </div>
  );
}
