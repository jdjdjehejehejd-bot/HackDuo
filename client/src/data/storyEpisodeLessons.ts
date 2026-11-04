import type { Lesson } from "./lessons";
import { storyUnits } from "./storyUnits";

const NIST = "https://www.nist.gov/cyberframework";
const STANFORD = "https://online.stanford.edu/courses/xacs101-foundations-information-security";
const OWASP = "https://top10.owasp.org/2025/en/";
const CISA = "https://www.cisa.gov/topics/cyber-threats-and-advisories";

const focusByUnit: Record<number, { category: string; concept: string; action: string; source: { label: string; url: string } }> = {
  3: { category: "위협 모델링", concept: "자산·경계·위협", action: "사건의 공격면을 지도에 표시한다.", source: { label: "MIT · Threat Models", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-1-introduction-threat-models/" } },
  4: { category: "인증과 계정", concept: "인증·세션·복구", action: "계정의 실제 주인을 확인한다.", source: { label: "NIST · Identity and Access Management", url: "https://www.nist.gov/identity-and-access-management" } },
  5: { category: "접근 제어", concept: "최소 권한·역할·승인", action: "업무에 필요한 권한만 남긴다.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  6: { category: "암호학", concept: "암호화·해시·서명", action: "메시지의 비밀성과 진위를 구분한다.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
  7: { category: "네트워크 보안", concept: "분리·통신·인증서", action: "신뢰 경계를 나누고 연결을 통제한다.", source: { label: "IUP · Cybersecurity Courses", url: "https://www.iup.edu/cybersecurity/courses/index.html" } },
  8: { category: "웹 보안", concept: "입력 검증·출력 처리·세션", action: "웹 입력이 지나가는 처리 단계를 점검한다.", source: { label: "OWASP Top 10", url: OWASP } },
  9: { category: "가용성과 복구", concept: "백업·복구·연속성", action: "서비스를 복구할 경로를 마련한다.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  10: { category: "개인정보 보호", concept: "최소 수집·보관·삭제", action: "필요한 개인정보만 수집하고 보관한다.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
  11: { category: "피싱 대응", concept: "긴급성·발신자·독립 검증", action: "메시지를 공식 경로로 검증한다.", source: { label: "CISA · Recognize and Report Phishing", url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing" } },
  12: { category: "사회공학", concept: "신뢰·요청·검증", action: "요청자의 정체와 목적을 확인한다.", source: { label: "CISA · Cybersecurity Advisories", url: CISA } },
  13: { category: "사고 탐지", concept: "알림·로그·사실", action: "경보를 사실과 추측으로 구분한다.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  14: { category: "사고 대응", concept: "격리·보고·연속성", action: "피해 확산을 줄이고 담당자에게 보고한다.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  15: { category: "포렌식 기초", concept: "증거·시간·보존", action: "증거를 보존하며 사건의 순서를 복원한다.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
  16: { category: "화이트해커 입문", concept: "허가·범위·책임", action: "점검 전에 허가와 중단 조건을 확인한다.", source: { label: "IUP · Cybersecurity Courses", url: "https://www.iup.edu/cybersecurity/courses/index.html" } },
  17: { category: "보안 보고서", concept: "영향·재현·완화", action: "발견 사항을 개선 가능한 보고서로 작성한다.", source: { label: "NIST 사이버보안 프레임워크", url: NIST } },
  18: { category: "보안 설계", concept: "원칙·사람·시스템", action: "처음부터 안전한 설계를 적용한다.", source: { label: "MIT · Computer Systems Security", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/" } },
  19: { category: "보안 의사결정", concept: "우선순위·영향·합의", action: "위험과 영향에 따라 우선순위를 결정한다.", source: { label: "NIST CSF 2.0", url: NIST } },
  20: { category: "종합 보안 미션", concept: "적용·회고·개선", action: "배운 원칙을 새로운 사건에 적용한다.", source: { label: "Stanford · Foundations of Information Security", url: STANFORD } },
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
    `${episodeTitle} 현장에서 민지와 틈이가 ${focus.concept}와 관련된 낯선 흔적을 발견했어. 그렇다고 바로 원인을 단정하진 않아. 사건이 벌어진 맥락과 평소 흐름을 비교하면서, 먼저 확인할 사실부터 추려 보자.`,
    `팀은 ${previous} 때 남은 기록과 새 단서를 나란히 놓고 살펴봐. 시각과 대상, 권한 범위가 서로 맞는지 확인하면 사실과 아직 검증되지 않은 추측을 가를 수 있어. 판단 근거도 함께 남겨 두자.`,
    `이제 피해를 만들지 않을 다음 행동을 골라야 해. 실제 계정이나 운영 시스템에는 손대지 말고, 승인된 가상 환경에서 꼭 필요한 범위만 확인하자. 조직 절차와 중단 조건도 먼저 챙겨야 해.`,
  ];
  const titles = ["현장의 단서", "기록을 맞춰 보기", "안전한 다음 행동"];
  const bodies = [
    `낯선 흔적을 봤다고 바로 원인을 정할 순 없어. ${focus.concept}를 제대로 이해하려면 우선 무엇을 보호해야 하는지, 사용자는 어떤 역할인지, 어디까지 접근이 허용됐는지부터 확인해 보자. 자산끼리 어떻게 연결돼 있고 평소엔 어떻게 움직이는지도 적어 두면 우연한 오류와 실제 위험을 비교하기 쉬워져. 예를 들어 업무상 정상 변경인지 권한 밖의 접근인지 보려면 시각과 승인 내역을 함께 살펴야 해. 그래야 서두른 조치를 줄이고 담당자에게도 정확히 설명할 수 있어.`,
    `기록 하나만 보고 특정 사람이나 시스템을 원인으로 지목하면 안 돼. 발생 시각, 대상 계정, 사용 권한, 변경 내용처럼 항목을 나눠 보고 믿을 수 있는 공식 기록과 맞춰 보자. 기록이 비어 있거나 서로 맞지 않는 부분은 짐작으로 채우지 말고 ‘아직 확인되지 않음’이라고 남겨 두면 돼. 확인된 사실과 가설, 더 필요한 자료를 구분해 적으면 팀도 같은 근거로 판단할 수 있어. 민감한 비밀번호나 개인정보를 기록에 복사하지 않는 것도 꼭 기억해 줘.`,
    `학습한다고 실제 계정이나 운영 서비스, 네트워크를 시험하면 안 돼. 합성 데이터와 격리된 가상 사례만 쓰고, 시작하기 전에 담당자 승인과 허용 범위, 중단 조건을 확인하자. 확인은 꼭 필요한 만큼만 하고, 예상 못 한 영향이 보이면 바로 멈춘 뒤 정해진 경로로 알려야 해. 접근에 성공하는 게 목표가 아니라 위험을 이해하고 피해를 막는 방어 역량을 키우는 게 목표야.`,
  ];
  const takeaways = [
    `먼저 보호 대상과 평소 흐름부터 확인해 보자. 그래야 ${focus.concept}가 이 상황에서 어떤 뜻인지 제대로 볼 수 있고, 근거를 남겨 두면 다음 검토도 흔들리지 않아.`,
    "사실과 추측, 더 확인할 질문은 따로 적어 두면 돼. 모르는 부분을 솔직히 표시하는 것만으로도 성급한 결론이나 불필요한 조치를 꽤 줄일 수 있어.",
    "허가된 가상 환경에서 필요한 만큼만 확인하고, 방어에 집중하자. 승인이나 범위가 분명하지 않다면 시작하지 않는 게 맞아.",
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
    summary: [
      `이번 레슨은 ${focus.concept}의 기본 원리에서 출발한다. ‘${episodeTitle}’에서 발견한 단서가 어떤 기준과 연결되는지 살피고, 판단에 필요한 질문을 정리한다. 개념을 사건에 적용하는 순서도 확인한다. 보호할 대상과 위험이 생길 지점을 기록하면 다음 판단의 근거가 더 분명해진다.`,
      `‘${episodeTitle}’의 기록을 ${focus.concept}의 관점으로 해석한다. 표면적인 인상과 확인된 근거를 나누고, 남은 의문을 풀려면 무엇을 더 살펴야 하는지 판단한다. 성급한 결론이 왜 위험한지도 짚는다. 확인하지 않은 부분은 추측으로 채우지 않고, 다음에 모아야 할 자료를 구체적으로 정리한다.`,
      `이 편의 핵심은 ${focus.concept}의 용어를 외우는 데 그치지 않는 것이다. 단서가 실제 위험을 뜻하는지 살피고, 보호 대상과 예상되는 영향을 연결해 안전한 대응을 고른다. 민지와 틈이의 판단을 따라가며 기준을 적용한다. 단순한 경고와 실제로 대응해야 하는 위험을 구분하는 기준도 갖춘다.`,
      `이번 사건은 ${focus.concept}의 원리와 한계를 함께 살펴볼 기회다. ${focus.action} 실제 상황에서 예상되는 영향과 승인 범위를 확인하고, 필요한 조치와 피해야 할 행동을 구분한다. 적용 후 무엇을 기록할지도 다룬다. 이유와 결정 과정을 남기면 다음 담당자도 같은 근거로 상황을 이어서 살필 수 있다.`,
      `마지막 단서를 통해 ${focus.concept}의 핵심 기준을 다시 묶는다. ‘${episodeTitle}’에서 확인한 사실을 다른 상황에도 적용해 보고, 놓친 정보와 다음에 취할 방어 행동을 정리한다. 이번 편의 결론을 안전한 실천으로 연결한다. 마지막에는 누구에게 무엇을 알리고 어떤 기록을 남길지까지 정리한다.`,
    ][(episodeNumber - 1) % 5],
    mission: focus.action,
    hook: [
      `${unit.arc} 민지와 틈이는 ‘${episodeTitle}’에 남은 기록을 따라간다. 단서가 가리키는 곳은 ${focus.concept}의 문제일까, 아니면 더 깊은 원인일까?`,
      `“‘${episodeTitle}’라는 흔적, 그냥 실수라고 보기엔 좀 이상하지 않아?” 민지와 틈이는 현장과 기록을 대조한다. ${unit.arc} 확인되지 않은 단서만으로 결론을 내려도 될까?`,
      `문제의 시작은 ‘${episodeTitle}’에서 발견된 작은 흔적이었다. ${unit.arc} 민지와 틈이는 그 흔적이 ${focus.concept}와 어떻게 이어지는지 추적한다. 가장 먼저 확인해야 할 사실은 무엇일까?`,
      `축제 준비는 평소처럼 진행되는 듯했지만 ‘${episodeTitle}’에서 예상하지 못한 단서가 나타난다. ${unit.arc} 피해가 번지기 전에 무엇을 확인해야 할까?`,
      `“${episodeTitle}의 의미를 놓치면 안 돼.” 민지와 틈이는 서로 다른 기록을 맞춰 본다. ${unit.arc} 그 안에 숨은 ${focus.concept}의 위험을 어떻게 밝혀낼까?`,
    ][(episodeNumber - 1) % 5],
    sections: sectionKinds.map((kind, index) => ({ title: `${kind}: ${titles[index]}`, scene: scenes[index], concept: focus.concept, body: bodies[index], takeaway: takeaways[index] })),
    questions: [
      { question: `${episodeTitle}에서 가장 먼저 확인할 것은 뭘까?`, choices: [correct[0], "감으로 의심되는 사람부터 공개한다", "도구를 실행하고 결과를 나중에 해석한다"], answerIndex: 0, explanation: "자산과 평소 흐름을 먼저 알아야 지금 본 변화가 정말 이상한 건지 판단할 기준이 생겨." },
      { question: "기록을 읽을 때 가장 안전한 태도는?", choices: ["가장 의심되는 설명 하나만 남긴다", correct[1], "기록을 모두 삭제하고 새로 시작한다"], answerIndex: 1, explanation: "확인한 사실과 추측을 나눠 두면 근거가 부족한 단정도, 그 때문에 생기는 잘못된 조치도 줄일 수 있어." },
      { question: "가상 보안 학습에서 지켜야 할 원칙은?", choices: ["실제 계정으로 시험한다", "허가 없이 범위를 넓힌다", correct[2]], answerIndex: 2, explanation: "승인된 가상 환경, 그리고 정해 둔 범위 안에서만 필요한 만큼 확인하자. 그래야 실제 시스템에 피해를 주지 않으면서 방어 원칙을 익힐 수 있어." },
      { question: "팀에 보고할 때 가장 도움이 되는 내용은?", choices: ["영향과 확인된 근거, 다음 안전한 조치", "불확실한 소문을 사실처럼 전달하기", "민감한 값을 채팅방에 복사하기"], answerIndex: 0, explanation: "확인한 근거와 영향, 이미 한 조치와 다음 단계를 함께 알려 주면 담당자가 상황을 파악하고 안전하게 대응하기 쉬워져." },
    ],
    references: [focus.source, { label: "NIST CSF 2.0", url: NIST }],
  };
}

export const expandedStoryLessons: Lesson[] = storyUnits
  .filter((unit) => unit.number >= 3)
  .flatMap((unit) => unit.episodes.map((_, index) => makeEpisode(unit, index + 1)));
