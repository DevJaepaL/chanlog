import type { Metadata } from "next";
import { PipelineSection } from "@/components/pipeline/pipeline-section";

export const metadata: Metadata = {
  title: "문서 전처리 파이프라인",
  description:
    "공개 자료를 이용한 문서 구조 파싱·계층 인식 청킹·이중 색인 사례 연구",
  alternates: {
    canonical: "https://chanlog.blog/pipeline",
  },
  openGraph: {
    url: "https://chanlog.blog/pipeline",
  },
};

export default function PipelinePage() {
  return <PipelineSection />;
}
