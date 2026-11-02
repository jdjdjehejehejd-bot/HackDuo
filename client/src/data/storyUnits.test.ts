import { describe, expect, it } from "vitest";
import { storyUnits } from "./storyUnits";

describe("story unit roadmap", () => {
  it("has twenty connected story units", () => {
    expect(storyUnits).toHaveLength(20);
    expect(storyUnits.map((unit) => unit.number)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
  });

  it("splits every big story into five smaller episodes", () => {
    for (const unit of storyUnits) {
      expect(unit.title.length).toBeGreaterThan(3);
      expect(unit.arc.length).toBeGreaterThan(10);
      expect(unit.episodes).toHaveLength(5);
      expect(new Set(unit.episodes).size).toBe(5);
    }
  });
});
