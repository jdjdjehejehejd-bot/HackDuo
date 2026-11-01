import type { LearningProgress } from "@/hooks/useLearningProgress";

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isEarned: (progress: LearningProgress, lessonCount: number, labCount: number) => boolean;
};

export const badges: BadgeDefinition[] = [
  {
    id: "first-clue",
    title: "첫 단서",
    description: "첫 번째 스토리를 클리어했어요.",
    icon: "✦",
    isEarned: (progress) => progress.completedLessonIds.length >= 1,
  },
  {
    id: "story-runner",
    title: "스토리 러너",
    description: "스토리 3편을 이어서 완료했어요.",
    icon: "↗",
    isEarned: (progress) => progress.completedLessonIds.length >= 3,
  },
  {
    id: "white-hat",
    title: "화이트해커의 약속",
    description: "허가된 점검과 책임 있는 보고를 배웠어요.",
    icon: "◇",
    isEarned: (progress) => progress.completedLessonIds.includes("white-hat"),
  },
  {
    id: "safe-practice",
    title: "안전한 실습자",
    description: "가상 실습 시나리오를 모두 완료했어요.",
    icon: "⌁",
    isEarned: (progress, _lessonCount, labCount) => labCount > 0 && progress.completedLabIds.length >= labCount,
  },
  {
    id: "steady-signal",
    title: "꾸준한 신호",
    description: "3일 연속으로 학습 흐름을 만들었어요.",
    icon: "♨",
    isEarned: (progress) => progress.streak >= 3,
  },
  {
    id: "field-guide",
    title: "나만의 필드 가이드",
    description: "모든 스토리를 클리어했어요.",
    icon: "◎",
    isEarned: (progress, lessonCount) => lessonCount > 0 && progress.completedLessonIds.length >= lessonCount,
  },
];
