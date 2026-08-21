import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const nextConfig = require(resolve("next.config.js")) as {
  redirects(): Promise<
    Array<{ source: string; destination: string; permanent: boolean }>
  >;
};

describe("legacy redirects and route removal", () => {
  it("preserves posts and adds the exact pipeline fragment redirect", async () => {
    expect(await nextConfig.redirects()).toEqual([
      { source: "/posts", destination: "/", permanent: true },
      {
        source: "/pipeline",
        destination: "/portfolio#document-preprocessor",
        permanent: true,
      },
    ]);
  });

  it("has no App Router pipeline landing page", () => {
    expect(existsSync(resolve("app/pipeline/page.tsx"))).toBe(false);
  });
});
