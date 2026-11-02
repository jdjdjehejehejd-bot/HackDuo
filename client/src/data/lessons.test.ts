import { describe, expect, it } from "vitest";
import { lessonStoryboards } from "./animatedStoryboards";
import { getCompletedLessonNotes, lessonStages, lessons } from "./lessons";

describe("TEUM beginner security curriculum", () => {
  it("orders foundation, design, and response topics from prerequisites to application", () => {
    expect(lessonStages.map((stage) => stage.id)).toEqual([
      "foundations",
      "design",
      "response",
    ]);
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "security-basics",
      "threat-model",
      "account",
      "cryptography",
      "network",
      "web",
      "privacy",
      "phishing",
      "incident",
      "white-hat",
    ]);
    expect(lessons.map((lesson) => lesson.stageId)).toEqual([
      "foundations",
      "foundations",
      "design",
      "design",
      "design",
      "design",
      "response",
      "response",
      "response",
      "response",
    ]);
  });

  it("preserves IDs used by learners' existing local progress", () => {
    const previousIds = ["phishing", "account", "privacy", "web", "network", "incident"];
    expect(lessons.map((lesson) => lesson.id)).toEqual(expect.arrayContaining(previousIds));
  });

  it("organizes the curriculum into broad units with multiple connected lessons", () => {
    for (const stage of lessonStages) {
      const stageLessons = lessons.filter((lesson) => lesson.stageId === stage.id);
      expect(stage.unitLabel, stage.id).toMatch(/^UNIT 0[1-3]$/);
      expect(stage.objective.length, stage.id).toBeGreaterThan(15);
      expect(stageLessons.length, stage.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("provides a recurring cartoon story and three acted beats for every lesson concept", () => {
    expect(Object.keys(lessonStoryboards).sort()).toEqual(lessons.map((lesson) => lesson.id).sort());

    for (const lesson of lessons) {
      const storyboard = lessonStoryboards[lesson.id];
      expect(storyboard.location.length, lesson.id).toBeGreaterThan(2);
      expect(storyboard.propName.length, lesson.id).toBeGreaterThan(2);
      expect(storyboard.steps, lesson.id).toHaveLength(lesson.sections.length);
      for (const scene of storyboard.steps) {
        expect(scene, lesson.id).toHaveLength(3);
        expect(scene.every((line) => line.trim().length > 2), lesson.id).toBe(true);
      }
    }
  });

  it("builds newest-first notebook entries from saved completions and ignores stale or duplicate IDs", () => {
    const notes = getCompletedLessonNotes([
      "phishing",
      "account",
      "security-basics",
      "legacy-deleted-lesson",
      "account",
    ]);

    expect(notes.map((lesson) => lesson.id)).toEqual([
      "account",
      "security-basics",
      "phishing",
    ]);
    expect(notes[0]?.sections.map((section) => section.takeaway)).toEqual(
      lessons.find((lesson) => lesson.id === "account")?.sections.map((section) => section.takeaway),
    );
    expect(getCompletedLessonNotes([])).toEqual([]);
  });

  it("gives every episode a scene, a mission, three concept clues, four questions, and references", () => {
    for (const lesson of lessons) {
      expect(lesson.episode, lesson.id).toContain("새빛대학교 축제");
      expect(lesson.mission.length, lesson.id).toBeGreaterThan(8);
      expect(lesson.sections, lesson.id).toHaveLength(3);
      expect(lesson.questions, lesson.id).toHaveLength(4);
      expect(lesson.references.length, lesson.id).toBeGreaterThan(0);

      for (const section of lesson.sections) {
        expect(section.scene.length, lesson.id).toBeGreaterThan(12);
        expect(section.concept.length, lesson.id).toBeGreaterThan(2);
        expect(section.body.length, lesson.id).toBeGreaterThan(80);
        expect(section.takeaway.length, lesson.id).toBeGreaterThan(8);
      }

      for (const question of lesson.questions) {
        expect(question.choices.length, `${lesson.id}: ${question.question}`).toBeGreaterThanOrEqual(3);
        expect(question.answerIndex, `${lesson.id}: ${question.question}`).toBeGreaterThanOrEqual(0);
        expect(question.answerIndex, `${lesson.id}: ${question.question}`).toBeLessThan(question.choices.length);
        expect(question.explanation.length, `${lesson.id}: ${question.question}`).toBeGreaterThan(20);
      }

      for (const reference of lesson.references) {
        expect(reference.url, lesson.id).toMatch(/^https:\/\//);
      }
    }
  });
});
