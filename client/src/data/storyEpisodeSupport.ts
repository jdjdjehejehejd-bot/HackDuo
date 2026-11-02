import type { CartoonStoryboard } from "./animatedStoryboards";
import type { StoryDecision } from "./storyDecisions";
import type { StoryArc } from "./storyArc";
import { expandedStoryLessons } from "./storyEpisodeLessons";

export const expandedStoryboards: Record<string, CartoonStoryboard> = Object.fromEntries(
  expandedStoryLessons.map((lesson) => [lesson.id, {
    badge: `${lesson.episode} · ${lesson.shortTitle}`,
    location: "새빛대학교 축제 보안 동아리",
    propGlyph: "!",
    propName: lesson.category,
    steps: lesson.sections.map((section) => [section.title, "기록과 범위를 확인", section.takeaway]) as [string, string, string][],
  }]),
);

export const expandedStoryDecisions: Record<string, StoryDecision> = Object.fromEntries(
  expandedStoryLessons.map((lesson) => [lesson.id, {
    prompt: `${lesson.title}에서 민지가 가장 먼저 해야 할 일은?`,
    choices: ["자산과 정상 흐름을 확인하고 공식 기록을 비교한다", "의심되는 사람을 공개적으로 지목한다", "실제 운영 시스템에 바로 시험한다"],
    bestIndex: 0,
    outcomes: ["좋아요. 사실과 범위를 먼저 확인하면 안전한 판단을 시작할 수 있어요.", "추측을 사실처럼 공개하면 피해가 커질 수 있어요.", "허가 없는 실제 시험은 학습이 아니라 위험한 행동이 될 수 있어요."],
  }]),
);

export const expandedStoryArcs: Record<string, StoryArc> = Object.fromEntries(
  expandedStoryLessons.map((lesson, index) => [lesson.id, {
    previous: index === 0 ? "앞선 UNIT의 기록을 이어 받아 새빛대학교 축제 현장에 도착했어요." : `${expandedStoryLessons[index - 1].shortTitle}에서 남은 단서를 이어 받았어요.`,
    cliffhanger: `${lesson.shortTitle}의 기록 끝에서 다음 보안 판단이 필요해졌어요. 팀은 사실과 추측을 나눠 다음 단서로 향합니다.`,
  }]),
);
