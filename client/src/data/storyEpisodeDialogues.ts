import { storyUnits } from "./storyUnits";
import type { StoryDialogue } from "./storyDialogues";

const nextClueLines = [
  "“음, 아직 빈칸이 많네. 그래도 괜찮아. 확인된 단서부터 하나씩 맞춰 보자.”",
  "“그럼 지난 기록이랑 지금 단서를 나란히 놓자. 어디까지가 사실인지 같이 찾아보면 돼.”",
  "“조금 마음에 걸리긴 하지만, 급하게 결론 내리진 말자. 빠진 기록부터 한 번 더 보자.”",
  "“좋아, 이제 조금씩 보이기 시작했어! 남은 의문은 적어 두고 다음 단서도 찾아보자.”",
  "“아직 모르는 건 솔직하게 남겨 두자. 다음 사람도 이어서 볼 수 있게 말이야.”",
] as const;

export const expandedStoryDialogues: Record<string, StoryDialogue[]> = Object.fromEntries(
  storyUnits.filter((unit) => unit.number >= 3).flatMap((unit) => unit.episodes.map((episode, index) => {
    const id = `${unit.id}-episode-${String(index + 1).padStart(2, "0")}`;
    const previous = index === 0 ? "지난 사건" : unit.episodes[index - 1];
    return [id, [
      { label: "현장 도착", speaker: "민지", line: `“${episode}라… 오늘도 뭔가 놓치면 안 될 단서가 있을 것 같아. 천천히 살펴보자!”`, focus: unit.title },
      { label: "남은 기록", speaker: "틈이", line: `“${previous}에서 나온 기록이랑 지금 단서를 나란히 놓자. 먼저 확인된 사실부터 보자.”`, focus: "이전 사건과 현재 단서" },
      { label: "작은 이상", speaker: "민지", line: "“이상하긴 해. 조금 불안하지만, 아직 누구 잘못이라고 할 순 없어. 평소엔 어땠는지부터 확인해 보자.”", focus: "정상 흐름 확인" },
      { label: "안전한 판단", speaker: "틈이", line: "“실제 시스템은 건드리지 말자. 승인된 가상 환경에서만 확인하고, 영향이랑 다음 조치도 적어 두자.”", focus: "허가된 방어 행동" },
      { label: "다음 단서", speaker: "민지", line: nextClueLines[index % nextClueLines.length], focus: episode },
      { label: "기록 저장", speaker: "틈이", line: "“확인한 사실이랑 아직 모르는 점은 따로 적어 뒀어. 다음 사람도 바로 이어서 볼 수 있게.”", focus: "다음 레슨으로 이어지는 기록" },
    ] satisfies StoryDialogue[]];
  })),
);
