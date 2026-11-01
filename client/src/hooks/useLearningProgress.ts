import { useCallback, useEffect, useState } from "react";

// Keep the original key so existing learners retain their saved progress.
const STORAGE_KEY = "hackduo.learning-progress.v1";
export const LEVEL_XP = 50;
export const LAB_XP_REWARD = 10;

type LearningProgress = {
  displayName: string;
  completedLessonIds: string[];
  completedLabIds: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  dailyActivityDate: string | null;
  dailyLessonCount: number;
};

const EMPTY_PROGRESS: LearningProgress = {
  displayName: "학습자",
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

  const completeLesson = useCallback((lessonId: string, xpReward: number) => {
    setProgress((current) => {
      const isNewLesson = !current.completedLessonIds.includes(lessonId);
      if (!isNewLesson) return { ...current, ...activityStats(current, dateKey(new Date())) };
      return {
        ...current,
        ...activityStats(current, dateKey(new Date())),
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

  return { progress, completeLesson, completeLab, setDisplayName };
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
