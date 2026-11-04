import { storyUnits } from "./storyUnits";
import type { StoryDialogue } from "./storyDialogues";

const nextClueLines = [
  "“좋아. 아직 빈칸이 많아. 확인된 단서부터 하나씩 맞춰 보자.”",
  "“그럼 지난 기록이랑 지금 단서를 나란히 놓자. 어디까지가 사실인지 먼저 가려 보자.”",
  "“급하게 결론 내릴 필요 없어. 빠진 기록이 있는지 한 번 더 확인하자.”",
  "“좋아, 이제 범위를 좁힐 수 있겠네. 남은 의문은 기록으로 남겨 두자.”",
  "“아직 모르는 건 모른다고 적어 두자. 다음 사람도 바로 이어서 볼 수 있게.”",
] as const;

export const expandedStoryDialogues: Record<string, StoryDialogue[]> = Object.fromEntries(
  storyUnits.filter((unit) => unit.number >= 3).flatMap((unit) => unit.episodes.map((episode, index) => {
    const id = `${unit.id}-episode-${String(index + 1).padStart(2, "0")}`;
    const previous = index === 0 ? "지난 사건" : unit.episodes[index - 1];
    return [id, [
      { label: "현장 도착", speaker: "민지", line: `“${episode}… 제목만 봐도 평범한 하루는 아닌 것 같네.”`, focus: unit.title },
      { label: "남은 기록", speaker: "틈이", line: `“${previous}에서 나온 기록이랑 지금 단서를 나란히 놓자. 먼저 확인된 사실부터 보자.”`, focus: "이전 사건과 현재 단서" },
      { label: "작은 이상", speaker: "민지", line: "“이상한 건 맞아. 그래도 아직 누구를 의심할 단계는 아니야. 평소엔 어떻게 흘러갔는지부터 보자.”", focus: "정상 흐름 확인" },
      { label: "안전한 판단", speaker: "틈이", line: "“실제 시스템은 건드리지 말자. 승인된 가상 환경에서만 확인하고, 영향이랑 다음 조치도 적어 두자.”", focus: "허가된 방어 행동" },
      { label: "다음 단서", speaker: "민지", line: nextClueLines[index % nextClueLines.length], focus: episode },
      { label: "기록 저장", speaker: "틈이", line: "“확인한 사실이랑 아직 모르는 점은 따로 적어 뒀어. 다음 사람도 바로 이어서 볼 수 있게.”", focus: "다음 레슨으로 이어지는 기록" },
    ] satisfies StoryDialogue[]];
  })),
);
