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

  it("gives every episode a complete dialogue", () => {
    for (const lesson of lessons) {
      expect(storyDialogues[lesson.id].length, lesson.id).toBe(lesson.id === "security-basics" ? 8 : 6);
      expect(storyDialogues[lesson.id].every((scene) => scene.line.length > 10 && scene.speaker.length > 0), lesson.id).toBe(true);
    }
  });

  it("starts the first episode in-scene without a narrator", () => {
    expect(storyDialogues["security-basics"][0].speaker).toContain("민지");
    expect(storyDialogues["security-basics"][0].line).toContain("새빛대");
    expect(storyDialogues["security-basics"][1].line).toContain("예매");
    expect(storyDialogues["security-basics"][5].speaker).toContain("틈이");
  });

  it("carries a concrete clue from each episode into the next one", () => {
    expect(storyDialogues["security-basics"].at(-1)?.line).toContain("사건");
    expect(storyDialogues["threat-model"].some((scene) => scene.line.includes("guest_07"))).toBe(true);
    expect(storyDialogues.account.some((scene) => scene.line.includes("재호"))).toBe(true);
    expect(storyDialogues.cryptography.some((scene) => scene.line.includes("어젯밤"))).toBe(true);
    expect(storyDialogues.network.some((scene) => scene.line.includes("댓글"))).toBe(true);
    expect(storyDialogues.phishing.some((scene) => scene.line.includes("로그인"))).toBe(true);
    expect(storyDialogues.incident.some((scene) => scene.line.includes("재호"))).toBe(true);
    expect(storyDialogues["white-hat"].at(-1)?.line).toContain("축제");
  });
});
