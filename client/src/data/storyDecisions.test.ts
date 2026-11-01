import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";
import { storyDecisions } from "./storyDecisions";
import { storyArc } from "./storyArc";
import { storyDialogues } from "./storyDialogues";

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

  it("connects every lesson to a previous clue and next-episode hook", () => {
    for (const lesson of lessons) {
      expect(storyArc[lesson.id]?.previous, lesson.id).toBeTruthy();
      expect(storyArc[lesson.id]?.cliffhanger, lesson.id).toBeTruthy();
    }
  });

  it("gives every episode a complete five-scene dialogue", () => {
    for (const lesson of lessons) {
      expect(storyDialogues[lesson.id], lesson.id).toHaveLength(5);
      expect(storyDialogues[lesson.id].every((scene) => scene.line.length > 10 && scene.speaker.length > 0), lesson.id).toBe(true);
    }
  });

  it("starts the first episode in-scene without a narrator", () => {
    expect(storyDialogues["security-basics"][0].speaker).toContain("민지");
    expect(storyDialogues["security-basics"][0].line).toContain("축제");
    expect(storyDialogues["security-basics"][3].speaker).toContain("틈이");
  });
});
