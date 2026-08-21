import type { Metadata } from "next";

interface LandingMetadataInput {
  title: string;
  description: string;
  url: string;
}

export function createLandingMetadata({
  title,
  description,
  url,
}: LandingMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      locale: "ko_KR",
      type: "website",
      siteName: "Chanlog",
    },
  };
}
