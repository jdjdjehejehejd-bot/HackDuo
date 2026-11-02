import { storyUnits } from "./storyUnits";
import type { StoryDialogue } from "./storyDialogues";

export const expandedStoryDialogues: Record<string, StoryDialogue[]> = Object.fromEntries(
  storyUnits.filter((unit) => unit.number >= 3).flatMap((unit) => unit.episodes.map((episode, index) => {
    const id = `${unit.id}-episode-${String(index + 1).padStart(2, "0")}`;
    const previous = index === 0 ? "앞선 기록" : unit.episodes[index - 1];
    return [id, [
      { label: "현장 도착", speaker: "민지", line: `“${episode}… 제목만 봐도 평범한 하루는 아닌 것 같네.”`, focus: unit.title },
      { label: "남은 기록", speaker: "틈이", line: `“${previous}에서 남은 기록과 지금 보이는 단서를 같이 놓아 보자. 먼저 사실부터.”`, focus: "이전 사건과 현재 단서" },
      { label: "작은 이상", speaker: "민지", line: `“이상한 건 맞지만, 아직 누군가를 의심할 단계는 아니야. 무엇이 정상인지부터 정리하자.”`, focus: "정상 흐름 확인" },
      { label: "안전한 판단", speaker: "틈이", line: `“실제 시스템은 건드리지 않아. 허가된 가상 기록 안에서 확인하고, 발견한 영향과 다음 조치를 남기자.”`, focus: "허가된 방어 행동" },
      { label: "다음 단서", speaker: "민지", line: `“좋아. 이번 사건의 답을 서둘러 정하지 말고, ${unit.promise.replace(/해요\.$/, "하자.")}”`, focus: episode },
      { label: "기록 저장", speaker: "틈이", line: "“확인한 사실과 아직 모르는 점을 기록했어. 다음 사람이 이어서 판단할 수 있게.”", focus: "다음 레슨으로 이어지는 기록" },
    ] satisfies StoryDialogue[]];
  })),
);
