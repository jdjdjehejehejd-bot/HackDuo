import { useCallback, useEffect, useState } from "react";

// Keep the original key so existing learners retain their saved progress.
const STORAGE_KEY = "hackduo.learning-progress.v1";
export const LEVEL_XP = 50;
export const LAB_XP_REWARD = 10;
export const MAX_LEVEL = 20;
export const DEVELOPER_UNLOCK_CODE = "TEUM-DEV-MAX";
export type DeveloperStats = { xp: number; streak: number; completedLessonCount: number };

export type ProgressSnapshot = {
  displayName: string;
  storyChoices: Record<string, number>;
  lessonPerformance: Record<string, { attempts: number; correct: number; total: number }>;
  questionMistakes: Record<string, number[]>;
  completedLessonIds: string[];
  completedLabIds: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  dailyActivityDate: string | null;
  dailyLessonCount: number;
};

export type LearningProgress = ProgressSnapshot & {
  displayName: string;
  developerMode: boolean;
  developerModeSnapshot: ProgressSnapshot | null;
};

const EMPTY_PROGRESS: LearningProgress = {
  displayName: "학습자",
  developerMode: false,
  developerModeSnapshot: null,
  storyChoices: {},
  lessonPerformance: {},
  questionMistakes: {},
  completedLessonIds: [],
  completedLabIds: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  dailyActivityDate: null,
  dailyLessonCount: 0,
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayNumber(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

function activityStats(current: LearningProgress, today: string) {
  const difference = current.lastActiveDate ? dayNumber(today) - dayNumber(current.lastActiveDate) : null;
  const streak = current.lastActiveDate === today
    ? Math.max(current.streak, 1)
    : difference === 1
      ? current.streak + 1
      : 1;
  const isSameActivityDay = current.dailyActivityDate === today;

  return {
    streak,
    lastActiveDate: today,
    dailyActivityDate: today,
    dailyLessonCount: (isSameActivityDay ? current.dailyLessonCount : 0) + 1,
  };
}

function readProgress(): LearningProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const saved = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      displayName: typeof saved.displayName === "string" && saved.displayName.trim().length > 0
        ? saved.displayName.trim().slice(0, 24)
        : EMPTY_PROGRESS.displayName,
      developerMode: saved.developerMode === true,
      developerModeSnapshot: saved.developerModeSnapshot && typeof saved.developerModeSnapshot === "object"
        ? saved.developerModeSnapshot as ProgressSnapshot
        : null,
      storyChoices: saved.storyChoices && typeof saved.storyChoices === "object"
        ? Object.fromEntries(Object.entries(saved.storyChoices).filter(([id, choice]) => typeof id === "string" && Number.isInteger(choice)).map(([id, choice]) => [id, Number(choice)]))
        : {},
      lessonPerformance: saved.lessonPerformance && typeof saved.lessonPerformance === "object"
        ? Object.fromEntries(Object.entries(saved.lessonPerformance).flatMap(([id, value]) => {
          if (!value || typeof value !== "object") return [];
          const item = value as { attempts?: unknown; correct?: unknown; total?: unknown };
          if (![item.attempts, item.correct, item.total].every((number) => Number.isFinite(number))) return [];
          return [[id, { attempts: Math.max(0, Number(item.attempts)), correct: Math.max(0, Number(item.correct)), total: Math.max(1, Number(item.total)) }]];
        }))
        : {},
      questionMistakes: saved.questionMistakes && typeof saved.questionMistakes === "object"
        ? Object.fromEntries(Object.entries(saved.questionMistakes).flatMap(([id, indexes]) => Array.isArray(indexes) ? [[id, indexes.filter((index): index is number => Number.isInteger(index) && index >= 0)]] : []))
        : {},
      completedLessonIds: Array.isArray(saved.completedLessonIds)
        ? saved.completedLessonIds.filter((id): id is string => typeof id === "string")
        : [],
      completedLabIds: Array.isArray(saved.completedLabIds)
        ? saved.completedLabIds.filter((id): id is string => typeof id === "string")
        : [],
      xp: Number.isFinite(saved.xp) ? Math.max(0, Number(saved.xp)) : 0,
      streak: Number.isFinite(saved.streak) ? Math.max(0, Number(saved.streak)) : 0,
      lastActiveDate: typeof saved.lastActiveDate === "string" ? saved.lastActiveDate : null,
      dailyActivityDate: typeof saved.dailyActivityDate === "string" ? saved.dailyActivityDate : null,
      dailyLessonCount: Number.isFinite(saved.dailyLessonCount) ? Math.max(0, Number(saved.dailyLessonCount)) : 0,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function getLevelNumber(xp: number) {
  return Math.floor(Math.max(0, xp) / LEVEL_XP) + 1;
}

export function getLevelProgress(xp: number) {
  return Math.max(0, xp) % LEVEL_XP;
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(readProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Progress remains available in the current session if browser storage is unavailable.
    }
  }, [progress]);

  const completeLesson = useCallback((lessonId: string, xpReward: number, performance?: { correct: number; total: number; wrongQuestionIndexes?: number[] }) => {
    setProgress((current) => {
      const isNewLesson = !current.completedLessonIds.includes(lessonId);
      const previousPerformance = current.lessonPerformance[lessonId] ?? { attempts: 0, correct: 0, total: performance?.total ?? 1 };
      const nextPerformance = performance ? {
        attempts: previousPerformance.attempts + 1,
        correct: previousPerformance.correct + Math.max(0, Math.min(performance.correct, performance.total)),
        total: performance.total,
      } : previousPerformance;
      const withPerformance = { ...current, ...activityStats(current, dateKey(new Date())), lessonPerformance: { ...current.lessonPerformance, [lessonId]: nextPerformance }, questionMistakes: { ...current.questionMistakes, [lessonId]: Array.from(new Set([...(current.questionMistakes[lessonId] ?? []), ...(performance?.wrongQuestionIndexes ?? [])])) } };
      if (!isNewLesson) return withPerformance;
      return {
        ...withPerformance,
        completedLessonIds: [...current.completedLessonIds, lessonId],
        xp: current.xp + Math.max(0, xpReward),
      };
    });
  }, []);

  const completeLab = useCallback((labId: string) => {
    setProgress((current) => {
      if (current.completedLabIds.includes(labId)) return current;
      return {
        ...current,
        ...activityStats(current, dateKey(new Date())),
        completedLabIds: [...current.completedLabIds, labId],
        xp: current.xp + LAB_XP_REWARD,
      };
    });
  }, []);

  const setDisplayName = useCallback((displayName: string) => {
    setProgress((current) => ({
      ...current,
      displayName: displayName.trim().slice(0, 24) || EMPTY_PROGRESS.displayName,
    }));
  }, []);

  const activateDeveloperMode = useCallback((code: string, lessonIds: string[], labIds: string[]) => {
    if (code.trim().toUpperCase() !== DEVELOPER_UNLOCK_CODE) return false;
    setProgress((current) => ({
      ...current,
      developerMode: true,
      developerModeSnapshot: current.developerModeSnapshot ?? {
        displayName: current.displayName,
        storyChoices: current.storyChoices,
        lessonPerformance: current.lessonPerformance,
        questionMistakes: current.questionMistakes,
        completedLessonIds: current.completedLessonIds,
        completedLabIds: current.completedLabIds,
        xp: current.xp,
        streak: current.streak,
        lastActiveDate: current.lastActiveDate,
        dailyActivityDate: current.dailyActivityDate,
        dailyLessonCount: current.dailyLessonCount,
      },
      completedLessonIds: Array.from(new Set([...current.completedLessonIds, ...lessonIds])),
      completedLabIds: Array.from(new Set([...current.completedLabIds, ...labIds])),
      xp: Math.max(current.xp, MAX_LEVEL * LEVEL_XP - 1),
    }));
    return true;
  }, []);

  const deactivateDeveloperMode = useCallback(() => {
    setProgress((current) => {
      if (!current.developerMode) return current;
      if (!current.developerModeSnapshot) return { ...EMPTY_PROGRESS, displayName: current.displayName };
      return { ...current.developerModeSnapshot, developerMode: false, developerModeSnapshot: null };
    });
  }, []);

  const adjustDeveloperStats = useCallback((stats: DeveloperStats, lessonIds: string[]) => {
    setProgress((current) => {
      if (!current.developerMode) return current;
      const completedLessonCount = Math.max(0, Math.min(lessonIds.length, Math.floor(stats.completedLessonCount)));
      return { ...current, xp: Math.max(0, Math.floor(stats.xp)), streak: Math.max(0, Math.floor(stats.streak)), completedLessonIds: lessonIds.slice(0, completedLessonCount) };
    });
  }, []);

  const resetDeveloperStats = useCallback(() => {
    setProgress((current) => current.developerMode ? { ...current, storyChoices: {}, lessonPerformance: {}, questionMistakes: {}, completedLessonIds: [], completedLabIds: [], xp: 0, streak: 0, lastActiveDate: null, dailyActivityDate: null, dailyLessonCount: 0 } : current);
  }, []);

  const recordStoryChoice = useCallback((lessonId: string, choiceIndex: number) => {
    setProgress((current) => ({
      ...current,
      storyChoices: { ...current.storyChoices, [lessonId]: choiceIndex },
    }));
  }, []);

  return { progress, completeLesson, completeLab, setDisplayName, activateDeveloperMode, deactivateDeveloperMode, adjustDeveloperStats, resetDeveloperStats, recordStoryChoice };
}

export function getCurrentStreak(lastActiveDate: string | null, streak: number) {
  if (!lastActiveDate || streak <= 0) return 0;
  const daysSinceActivity = dayNumber(dateKey(new Date())) - dayNumber(lastActiveDate);
  return daysSinceActivity >= 0 && daysSinceActivity <= 1 ? streak : 0;
}

export function getWeekStreakDates(lastActiveDate: string | null, streak: number) {
  const activeDates = new Set<string>();
  if (!lastActiveDate || streak <= 0) return activeDates;

  const lastActive = new Date(`${lastActiveDate}T12:00:00`);
  for (let offset = 0; offset < Math.min(streak, 7); offset += 1) {
    const activeDay = new Date(lastActive);
    activeDay.setDate(activeDay.getDate() - offset);
    activeDates.add(dateKey(activeDay));
  }
  return activeDates;
}

export function getRecommendedReview<T extends { id: string; shortTitle: string }>(lessons: T[], progress: LearningProgress): T | undefined {
  return lessons
    .map((lesson, index) => ({ lesson, index, performance: progress.lessonPerformance[lesson.id] }))
    .filter((item) => item.performance && item.performance.attempts > 0 && item.performance.correct / (item.performance.attempts * item.performance.total) < 0.75)
    .sort((a, b) => {
      const aAccuracy = a.performance!.correct / (a.performance!.attempts * a.performance!.total);
      const bAccuracy = b.performance!.correct / (b.performance!.attempts * b.performance!.total);
      return aAccuracy - bAccuracy || a.index - b.index;
    })[0]?.lesson;
}
