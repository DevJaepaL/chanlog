import { describe, expect, it } from "vitest";
import { careers, contacts, profile, projects, skillGroups } from "@/lib/profile";

const ACCENTS = ["sky", "purple", "pink", "orange", "teal", "green"];

describe("profile 데이터", () => {
  it("기본 프로필 필드가 비어있지 않다", () => {
    expect(profile.name.length).toBeGreaterThan(0);
    expect(profile.role.length).toBeGreaterThan(0);
    expect(profile.tagline.length).toBeGreaterThan(0);
    expect(profile.about.length).toBeGreaterThan(0);
  });

  it("경력은 최신순으로 정렬되어 있다", () => {
    const starts = careers.map((c) => c.startedAt);
    const sorted = [...starts].sort().reverse();
    expect(starts).toEqual(sorted);
  });

  it("모든 경력에 필수 필드가 있다", () => {
    for (const career of careers) {
      expect(career.company).toBeTruthy();
      expect(career.period).toBeTruthy();
      expect(career.role).toBeTruthy();
      expect(career.highlights.length).toBeGreaterThan(0);
    }
  });

  it("프로젝트는 최신순으로 정렬되어 있다", () => {
    const starts = projects.map((p) => p.startedAt);
    const sorted = [...starts].sort().reverse();
    expect(starts).toEqual(sorted);
  });

  it("모든 프로젝트에 필수 필드가 있다", () => {
    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.org).toBeTruthy();
      expect(project.period).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(project.experience.length).toBeGreaterThan(0);
    }
  });

  it("스킬 그룹의 accent가 유효한 토큰이다", () => {
    for (const group of skillGroups) {
      expect(ACCENTS).toContain(group.accent);
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("스킬 그룹 accent는 서로 중복되지 않는다", () => {
    const used = skillGroups.map((g) => g.accent);
    expect(new Set(used).size).toBe(used.length);
  });

  it("연락처 href가 mailto 또는 https로 시작한다", () => {
    for (const contact of contacts) {
      expect(contact.href).toMatch(/^(mailto:|https:\/\/)/);
    }
  });
});
