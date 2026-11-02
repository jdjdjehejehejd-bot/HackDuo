import type { Lesson } from "./lessons";
import { storyUnits } from "./storyUnits";

const NIST = "https://www.nist.gov/cyberframework";
const STANFORD = "https://online.stanford.edu/courses/xacs101-foundations-information-security";
const OWASP = "https://top10.owasp.org/2025/en/";
const CISA = "https://www.cisa.gov/topics/cyber-threats-and-advisories";

const focusByUnit: Record<number, { category: string; concept: string; action: string; source: { label: string; url: string } }> = {
  3: { category: "위협 모델링", concept: "자산·경계·위협", action: "사건의 공격면을 지도에 표시해.", source: { label: "MIT · Threat Models", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-1-introduction-threat-models/" } },
  4: { category: "인증과 계정", concept: "인증·세션·복구", action: "계정의 실제 주인을 확인해.", source: { label: "NIST · Identity and Access Management", url: "https://www.nist.gov/identity-and-access-management" } },
  5: { category: "접근 제어", concept: "최소 권한·역할·승인", action: "필요한 권한만 남겨라.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  6: { category: "암호학", concept: "암호화·해시·서명", action: "메시지의 비밀성과 진위를 구분해.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
  7: { category: "네트워크 보안", concept: "분리·통신·인증서", action: "신뢰 경계를 안전하게 나눠.", source: { label: "IUP · Cybersecurity Courses", url: "https://www.iup.edu/cybersecurity/courses/index.html" } },
  8: { category: "웹 보안", concept: "입력 검증·출력 처리·세션", action: "웹 입력이 지나가는 문을 점검해.", source: { label: "OWASP Top 10", url: OWASP } },
  9: { category: "가용성과 복구", concept: "백업·복구·연속성", action: "멈춰도 다시 일어나는 경로를 만들어.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  10: { category: "개인정보 보호", concept: "최소 수집·보관·삭제", action: "필요한 정보만 남겨라.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
  11: { category: "피싱 대응", concept: "긴급성·발신자·독립 검증", action: "메시지 밖의 공식 경로로 확인해.", source: { label: "CISA · Recognize and Report Phishing", url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing" } },
  12: { category: "사회공학", concept: "신뢰·요청·검증", action: "요청자의 정체와 목적을 확인해.", source: { label: "CISA · Cybersecurity Advisories", url: CISA } },
  13: { category: "사고 탐지", concept: "알림·로그·사실", action: "경보를 사실과 추측으로 나눠.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  14: { category: "사고 대응", concept: "격리·보고·연속성", action: "확산을 줄이고 담당자에게 알려.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  15: { category: "포렌식 기초", concept: "증거·시간·보존", action: "사건의 순서를 안전하게 복원해.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
  16: { category: "화이트해커 입문", concept: "허가·범위·책임", action: "점검 전 허가와 중단 조건을 확인해.", source: { label: "IUP · Cybersecurity Courses", url: "https://www.iup.edu/cybersecurity/courses/index.html" } },
  17: { category: "보안 보고서", concept: "영향·재현·완화", action: "발견을 고칠 수 있는 보고서로 바꿔.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  18: { category: "보안 설계", concept: "원칙·사람·시스템", action: "처음부터 안전한 선택을 설계해.", source: { label: "MIT · Computer Systems Security", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/" } },
  19: { category: "보안 의사결정", concept: "우선순위·영향·합의", action: "가장 먼저 지켜야 할 것을 선택해.", source: { label: "NIST CSF 2.0", url: NIST } },
  20: { category: "종합 보안 미션", concept: "적용·회고·개선", action: "새로운 사건에 배운 원칙을 적용해.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
};

const sectionKinds = ["발견", "확인", "판단"] as const;

function makeEpisode(unit: (typeof storyUnits)[number], episodeNumber: number): Lesson {
  const focus = focusByUnit[unit.number];
  const episodeTitle = unit.episodes[episodeNumber - 1];
  const id = `${unit.id}-episode-${String(episodeNumber).padStart(2, "0")}`;
  const previous = episodeNumber === 1 ? "앞선 사건의 기록" : unit.episodes[episodeNumber - 2];
  const stageNumber = unit.number <= 7 ? 2 : unit.number <= 15 ? 3 : 4;
  const stageId = stageNumber === 2 ? "design" : stageNumber === 3 ? "response" : "mastery";
  const scenes = [
    `${episodeTitle} 현장에서 민지와 틈이는 ${focus.concept}와 관련된 작은 이상 징후를 발견했어.`,
    `팀은 ${previous}에서 남은 기록과 이번 단서를 나란히 놓고 확인해.`,
    `결정할 시간이야. 실제 시스템에 손대지 않고 ${focus.action.toLowerCase()}`,
  ];
  const titles = ["현장의 단서", "기록을 맞춰 보기", "안전한 다음 행동"];
  const bodies = [
    `${focus.concept}은 어려운 도구의 이름보다 무엇을 지키고 어떤 경계를 믿을지 정하는 데서 시작해. 사건을 만났다면 먼저 자산, 사용자, 정상적인 흐름을 적어 봐. 그래야 우연한 오류와 중요한 위험을 구분할 수 있어.`,
    `한 조각의 기록만으로 사람이나 원인을 단정하지 않아. 시간, 대상, 권한, 변경 내용처럼 확인 가능한 사실을 분리하고 공식 기록과 비교해. 모르는 부분은 모른다고 남기는 것이 안전한 분석의 시작이야.`,
    `학습 환경에서는 합성 데이터와 가상 사례만 사용하고, 실제 계정·서비스·네트워크를 시험하지 않아. 담당자에게 알리고, 허가된 범위 안에서 최소한의 확인과 방어 조치를 선택해야 해.`,
  ];
  const takeaways = [
    `${focus.concept}을 판단하기 전에 지킬 자산과 정상 흐름을 먼저 적어.`,
    "사실·추측·확인할 질문을 나눠 기록해.",
    "안전한 학습은 허가된 가상 환경과 방어적 행동에서 시작해.",
  ];
  const correct = [
    "자산과 정상 흐름을 먼저 확인하고 공식 기록을 비교한다",
    "확인된 사실과 추측을 나눠 기록한다",
    "허가된 가상 환경에서 최소한으로 확인하고 담당자에게 알린다",
    "눈에 띄는 사람을 바로 범인으로 단정한다",
  ];
  return {
    id,
    stageId,
    stageNumber,
    storyUnitId: unit.id,
    episodeNumber,
    title: episodeTitle,
    shortTitle: episodeTitle,
    category: focus.category,
    episode: `새빛대학교 축제 · UNIT ${String(unit.number).padStart(2, "0")} · ${episodeNumber}화`,
    duration: "6분",
    xp: 30 + (unit.number > 15 ? 5 : 0),
    summary: `${unit.arc} 이번 편에서는 ${focus.concept}의 첫 판단을 연습해.`,
    mission: focus.action,
    hook: `${unit.arc} ${episodeTitle}의 현장에서 민지와 틈이는 ${focus.concept}에 관한 단서를 발견했어. 이전 기록을 확인하고, 실제 피해를 만들지 않는 안전한 다음 행동을 골라야 해.`,
    sections: sectionKinds.map((kind, index) => ({ title: `${kind}: ${titles[index]}`, scene: scenes[index], concept: focus.concept, body: bodies[index], takeaway: takeaways[index] })),
    questions: [
      { question: `${episodeTitle}에서 가장 먼저 확인할 것은 뭘까?`, choices: [correct[0], "감으로 의심되는 사람부터 공개한다", "도구를 실행하고 결과를 나중에 해석한다"], answerIndex: 0, explanation: "자산과 정상 흐름을 먼저 알아야 무엇이 이상한지 안전하게 구분할 수 있어." },
      { question: "기록을 읽을 때 가장 안전한 태도는?", choices: ["가장 의심되는 설명 하나만 남긴다", correct[1], "기록을 모두 삭제하고 새로 시작한다"], answerIndex: 1, explanation: "확인된 사실과 추측을 나누면 성급한 결론을 피할 수 있어." },
      { question: "가상 보안 학습에서 지켜야 할 원칙은?", choices: ["실제 계정으로 시험한다", "허가 없이 범위를 넓힌다", correct[2]], answerIndex: 2, explanation: "허가된 가상 환경에서 최소한으로 확인하고 방어에 집중해야 해." },
      { question: "팀에 보고할 때 가장 도움이 되는 내용은?", choices: ["영향과 확인된 근거, 다음 안전한 조치", "불확실한 소문을 사실처럼 전달하기", "민감한 값을 채팅방에 복사하기"], answerIndex: 0, explanation: "근거와 영향, 다음 조치를 함께 전달하면 팀이 안전하게 판단할 수 있어." },
    ],
    references: [focus.source, { label: "NIST CSF 2.0", url: NIST }],
  };
}

export const expandedStoryLessons: Lesson[] = storyUnits
  .filter((unit) => unit.number >= 3)
  .flatMap((unit) => unit.episodes.map((_, index) => makeEpisode(unit, index + 1)));
