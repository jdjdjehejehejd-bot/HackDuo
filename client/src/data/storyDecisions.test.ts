import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";
import { storyDecisions } from "./storyDecisions";

describe("story decision checkpoints", () => {
  it("provides a safe decision checkpoint for every lesson", () => {
    for (const lesson of lessons) {
      const decision = storyDecisions[lesson.id];
      expect(decision, lesson.id).toBeDefined();
      expect(decision.choices.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(decision.bestIndex, lesson.id).toBeGreaterThanOrEqual(0);
      expect(decision.bestIndex, lesson.id).toBeLessThan(decision.choices.length);
      expect(decision.outcomes.length, lesson.id).toBe(decision.choices.length);
    }
  });
});
