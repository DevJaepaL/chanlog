"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type RefObject,
} from "react";
import type { ProjectPreview } from "@/lib/profile";

export interface ProjectGalleryState {
  selectedIndex: number | null;
}

export type ProjectGalleryEvent =
  | { type: "open"; index: number }
  | { type: "close" };

export function reduceProjectGalleryState(
  state: ProjectGalleryState,
  event: ProjectGalleryEvent
): ProjectGalleryState {
  if (event.type === "open") return { selectedIndex: event.index };
  if (event.type === "close") {
    return state.selectedIndex === null ? state : { selectedIndex: null };
  }
  return state;
}

function MagnifierPlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M14.5 14.5 20 20" />
      <path d="M10.5 7.5v6m-3-3h6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-4 w-4"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function isProjectGalleryOutsideImageClick(
  target: EventTarget | null,
  image: EventTarget | null
) {
  return target !== image;
}

export function ProjectGalleryDialog({
  preview,
  dialogRef,
  imageRef,
  onClose,
}: {
  preview?: ProjectPreview;
  dialogRef?: RefObject<HTMLDialogElement>;
  imageRef?: RefObject<HTMLImageElement>;
  onClose?: () => void;
}) {
  return (
    <dialog
      ref={dialogRef}
      aria-label="이미지 미리보기"
      aria-modal="true"
      onClick={(event) => {
        if (
          isProjectGalleryOutsideImageClick(
            event.target,
            imageRef?.current ?? null
          )
        ) {
          event.currentTarget.close();
        }
      }}
      onClose={onClose}
      className="w-[min(94vw,72rem)] max-w-none rounded-lg border border-hairline bg-surface p-0 text-ink shadow-elevated backdrop:bg-ink/60"
    >
      {preview?.src && (
        <div className="relative p-3 sm:p-5">
          <button
            type="button"
            aria-label="이미지 미리보기 닫기"
            onClick={(event) => {
              event.stopPropagation();
              dialogRef?.current?.close();
            }}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface text-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-5 sm:top-5"
          >
            <CloseIcon />
          </button>
          <Image
            ref={imageRef}
            src={preview.src}
            alt={preview.alt ?? preview.label}
            width={preview.width ?? 1600}
            height={preview.height ?? 900}
            sizes="94vw"
            className="max-h-[75vh] w-full object-contain"
          />
        </div>
      )}
    </dialog>
  );
}

export function ProjectGallery({ previews }: { previews: ProjectPreview[] }) {
  const [state, dispatch] = useReducer(reduceProjectGalleryState, {
    selectedIndex: null,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedPreview =
    state.selectedIndex === null ? undefined : previews[state.selectedIndex];

  const handleDialogClose = useCallback(() => {
    const selectedIndex = state.selectedIndex;
    if (selectedIndex === null) return;

    dispatch({ type: "close" });
    requestAnimationFrame(() => thumbnailRefs.current[selectedIndex]?.focus());
  }, [state.selectedIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedPreview && !dialog.open) dialog.showModal();
  }, [selectedPreview]);

  return (
    <section className="mt-3" aria-label="구현 화면 예시">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {previews.map((preview, index) => (
          <figure key={preview.label} className="min-w-0">
            {preview.src ? (
              <button
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                aria-label={`${preview.alt ?? preview.label} 확대 보기`}
                aria-haspopup="dialog"
                onClick={() => dispatch({ type: "open", index })}
                className="group relative block aspect-video w-full overflow-hidden rounded-md bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft"
              >
                <Image
                  loading="lazy"
                  src={preview.src}
                  alt={preview.alt ?? preview.label}
                  width={preview.width ?? 640}
                  height={preview.height ?? 360}
                  sizes="(min-width: 640px) 30vw, 45vw"
                  className="h-full w-full object-contain"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/60 text-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                  <MagnifierPlusIcon />
                </span>
              </button>
            ) : (
              <div className="flex aspect-video items-center justify-center border border-dashed border-hairline bg-canvas-soft px-2 text-center text-caption text-ink-muted">
                {preview.label} · 이미지 추가 예정
              </div>
            )}
          </figure>
        ))}
      </div>
      <ProjectGalleryDialog
        preview={selectedPreview}
        dialogRef={dialogRef}
        imageRef={imageRef}
        onClose={handleDialogClose}
      />
    </section>
  );
}
