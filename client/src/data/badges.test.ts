import { describe, expect, it } from "vitest";
import { badges } from "./badges";
import { LAB_SIMULATION_IDS } from "./labScenarios";
import type { LearningProgress } from "@/hooks/useLearningProgress";

const emptyProgress: LearningProgress = {
  displayName: "학습자",
  developerMode: false,
  completedLessonIds: [],
  completedLabIds: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  dailyActivityDate: null,
  dailyLessonCount: 0,
};

describe("achievement badges", () => {
  it("awards the first clue and white-hat badges from completed lessons", () => {
    const progress = { ...emptyProgress, completedLessonIds: ["security-basics", "white-hat"] };
    expect(badges.find((badge) => badge.id === "first-clue")?.isEarned(progress, 10, 3)).toBe(true);
    expect(badges.find((badge) => badge.id === "white-hat")?.isEarned(progress, 10, 3)).toBe(true);
  });

  it("awards the full collection only when every story is complete", () => {
    const progress = { ...emptyProgress, completedLessonIds: ["a", "b"] };
    const fullProgress = { ...emptyProgress, completedLessonIds: Array.from({ length: 10 }, (_, index) => `lesson-${index}`) };
    const badge = badges.find((item) => item.id === "field-guide");
    expect(badge?.isEarned(progress, 10, 3)).toBe(false);
    expect(badge?.isEarned(fullProgress, 10, 3)).toBe(true);
  });

  it("awards safe practice when every lab is complete", () => {
    const badge = badges.find((item) => item.id === "safe-practice");
    const allButOne = LAB_SIMULATION_IDS.slice(0, -1);
    expect(badge?.isEarned({ ...emptyProgress, completedLabIds: allButOne }, 10, LAB_SIMULATION_IDS.length)).toBe(false);
    expect(badge?.isEarned({ ...emptyProgress, completedLabIds: LAB_SIMULATION_IDS }, 10, LAB_SIMULATION_IDS.length)).toBe(true);
  });
});
