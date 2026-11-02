import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";
import { storyDialogues } from "./storyDialogues";
import { storyUnits } from "./storyUnits";

describe("long-form story curriculum", () => {
  it("provides five playable episodes for every new story unit", () => {
    expect(storyUnits).toHaveLength(20);
    for (const unit of storyUnits) {
      const unitLessons = lessons.filter((lesson) => lesson.storyUnitId === unit.id);
      if (unit.number >= 3) {
        expect(unitLessons).toHaveLength(5);
        expect(unitLessons.every((lesson) => lesson.sections.length === 3)).toBe(true);
        expect(unitLessons.every((lesson) => lesson.questions.length === 4)).toBe(true);
      }
    }
  });

  it("keeps every generated lesson connected to a six-scene cutscene", () => {
    const generated = lessons.filter((lesson) => lesson.storyUnitId);
    expect(generated).toHaveLength(90);
    expect(generated.every((lesson) => storyDialogues[lesson.id]?.length === 6)).toBe(true);
    expect(generated.every((lesson) => lesson.references.length >= 2)).toBe(true);
  });
});
