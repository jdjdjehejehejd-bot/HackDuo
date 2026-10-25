import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hackduo.learning-progress.v1";

type LearningProgress = {
  completedLessonIds: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
};

const EMPTY_PROGRESS: LearningProgress = {
  completedLessonIds: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
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

function readProgress(): LearningProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const saved = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      completedLessonIds: Array.isArray(saved.completedLessonIds)
        ? saved.completedLessonIds.filter((id): id is string => typeof id === "string")
        : [],
      xp: Number.isFinite(saved.xp) ? Math.max(0, Number(saved.xp)) : 0,
      streak: Number.isFinite(saved.streak) ? Math.max(0, Number(saved.streak)) : 0,
      lastActiveDate: typeof saved.lastActiveDate === "string" ? saved.lastActiveDate : null,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
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
      if (current.completedLessonIds.includes(lessonId)) return current;

      const today = dateKey(new Date());
      const previous = current.lastActiveDate;
      const difference = previous ? dayNumber(today) - dayNumber(previous) : null;
      const streak = previous === today
        ? Math.max(current.streak, 1)
        : difference === 1
          ? current.streak + 1
          : 1;

      return {
        completedLessonIds: [...current.completedLessonIds, lessonId],
        xp: current.xp + xpReward,
        streak,
        lastActiveDate: today,
      };
    });
  }, []);

  return { progress, completeLesson };
}

export function getCurrentStreak(lastActiveDate: string | null, streak: number) {
  if (!lastActiveDate || streak <= 0) return 0;
  const daysSinceActivity = dayNumber(dateKey(new Date())) - dayNumber(lastActiveDate);
  return daysSinceActivity <= 1 ? streak : 0;
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
