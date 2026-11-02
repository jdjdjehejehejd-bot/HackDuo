import { advancedLabScenarios } from "./labs/advanced";
import { applicationLabScenarios } from "./labs/application";
import { foundationalLabScenarios } from "./labs/foundations";
import { operationsLabScenarios } from "./labs/operations";

export type LabScenarioStep = {
  stepTitle: string;
  prompt: string;
  evidence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LabScenario = {
  id: string;
  title: string;
  label: string;
  summary: string;
  iconKey: string;
  minLevel: number;
  duration: string;
  mission: string;
  briefing: string;
  artifactTitle: string;
  artifactText: string;
  steps: LabScenarioStep[];
  references: { title: string; url: string }[];
};

export const originalLabScenarios: LabScenario[] = [
  {
    id: "mail-room",
    title: "메시지 속 빨간 깃발",
    label: "CASE 01 · 가상 받은 편지함",
    summary: "합성 안내 메일의 단서를 읽고 피해를 막는 순서를 연습해요.",
    iconKey: "Search",
    minLevel: 3,
    duration: "3분",
    mission: "링크를 누르지 않고 안내의 진위를 확인해요.",
    briefing: "축제 운영 계정으로 ‘오늘 안에 확인하지 않으면 예매 권한이 닫힌다’는 메일이 도착했어요. 팀원들은 급히 링크를 열어 보자고 하지만, 먼저 메시지가 믿을 만한지 살펴야 해요.",
    artifactTitle: "가상 받은 편지함 · 예시 메일",
    artifactText: "보낸 사람: 보안팀 안내 <notice@teum-secure.example.test>\n제목: 오늘 18:00까지 계정 확인이 필요합니다\n본문: 확인하지 않으면 접근이 중단될 수 있습니다. 아래 버튼으로 바로 확인해 주세요.\n버튼 목적지: 알 수 없는 외부 주소 (화면에만 표시)",
    steps: [
      {
        stepTitle: "발신 정보를 살펴봐요",
        prompt: "가장 먼저 확인할 단서는 무엇일까요?",
        evidence: "발신 표시 이름은 ‘보안팀 안내’지만 주소는 teum-secure.example.test예요.",
        options: [
          "표시 이름이 그럴듯하니 공식 메일로 믿는다",
          "학교가 사용하는 공식 발신 주소와 실제 주소를 비교한다",
          "개인 이름이 보이지 않으니 바로 삭제한다",
          "메일의 버튼을 눌러 계정 화면을 먼저 확인한다",
        ],
        correctIndex: 1,
        explanation: "표시 이름은 쉽게 흉내 낼 수 있어요. 주소의 실제 도메인을 공식 안내와 비교하고, 링크를 누르지 않은 채 출처를 확인하는 게 먼저예요.",
      },
      {
        stepTitle: "급한 문구에 멈춰요",
        prompt: "메일이 오늘 안에 계정이 닫힌다고 압박해요. 어떻게 확인하면 안전할까요?",
        evidence: "‘18:00까지’라는 짧은 기한과 계정 중단 경고가 있지만, 공식 공지 링크는 없어요.",
        options: [
          "메일의 링크 대신 이미 알고 있는 공식 앱이나 주소를 직접 열어 알림을 확인한다",
          "메일에 적힌 번호로 전화해 비밀번호를 알려 준다",
          "동료에게 버튼을 대신 눌러 달라고 부탁한다",
          "급한 일이므로 링크를 열고 로그인한다",
        ],
        correctIndex: 0,
        explanation: "긴급함은 생각할 시간을 빼앗는 흔한 압박 방식이에요. 메시지 밖의 독립된 공식 경로로 확인하면 가짜 링크를 피할 수 있어요.",
      },
      {
        stepTitle: "안전하게 마무리해요",
        prompt: "공식 앱에는 그런 알림이 없어요. 다음으로 할 일은 무엇일까요?",
        evidence: "공식 앱 확인 결과 계정 알림은 없고, 팀 받은 편지함에는 같은 메시지가 남아 있어요.",
        options: [
          "다른 팀원에게도 링크를 전달해 진위를 물어본다",
          "메일을 신고해 담당자가 확인하도록 하고, 안내에 따라 격리한다",
          "발신자에게 답장해 내부 정보를 더 요청한다",
          "메일을 지운 뒤 아무에게도 알리지 않는다",
        ],
        correctIndex: 1,
        explanation: "신고하면 담당자가 유사 메시지를 확인하고 다른 구성원의 피해도 줄일 수 있어요. 의심 메시지를 그대로 전달하기보다 조직의 신고 기능을 이용하세요.",
      },
    ],
    references: [{ title: "CISA · Recognize and Report Phishing", url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing" }],
  },
  {
    id: "web-check",
    title: "댓글 미리보기 안전하게",
    label: "CASE 02 · 모의 게시판",
    summary: "사용자가 쓴 내용을 검토해 브라우저에 안전하게 보여줘요.",
    iconKey: "FileCode",
    minLevel: 3,
    duration: "3분",
    mission: "댓글이 실행 코드가 아니라 글자로 처리되게 만들어요.",
    briefing: "축제 게시판에 저장한 댓글이 미리보기 카드에 나타나요. 개발팀은 화면을 예쁘게 꾸미고 싶지만, 먼저 사용자 입력이 페이지의 동작을 바꾸지 않도록 표시 흐름을 점검해야 해요.",
    artifactTitle: "모의 게시판 · 렌더링 흐름",
    artifactText: "사용자 댓글 → 가상 API → 댓글 저장소 → 미리보기 카드\n현재 메모: 입력값을 화면 템플릿에 직접 넣음\n테스트 데이터: 일반 문장과 특수기호가 포함된 합성 문자열\n실행 코드·외부 요청: 없음",
    steps: [
      {
        stepTitle: "입력의 출처를 확인해요",
        prompt: "게시판 댓글을 다룰 때 어떤 전제를 세워야 할까요?",
        evidence: "댓글은 로그인한 사용자뿐 아니라 외부 링크를 통해서도 제출될 수 있어요.",
        options: [
          "브라우저에서 작성됐으니 이미 안전하다고 본다",
          "사용자 입력은 신뢰할 수 없는 데이터로 취급한다",
          "특수문자를 모두 지우면 어디서나 안전하다고 본다",
          "로그인 사용자 글만 검증 없이 허용한다",
        ],
        correctIndex: 1,
        explanation: "사용자 입력은 브라우저나 계정과 무관하게 신뢰하지 않는 편이 안전해요. 입력 제한과 출력 문맥에 맞는 처리를 함께 적용해야 합니다.",
      },
      {
        stepTitle: "출력 방식을 고르세요",
        prompt: "댓글을 화면에 표시할 때 더 안전한 기본값은 무엇일까요?",
        evidence: "메모에 ‘문자열을 HTML 템플릿에 직접 연결’이라고 적혀 있어요.",
        options: [
          "프레임워크의 텍스트 출력 기능으로 댓글을 글자로 표시한다",
          "댓글을 HTML 문자열에 직접 이어 붙인다",
          "브라우저에서 입력 형식을 확인했으니 서버 검증을 생략한다",
          "오류가 나면 템플릿 내부 설정도 사용자에게 표시한다",
        ],
        correctIndex: 0,
        explanation: "프레임워크의 기본 텍스트 렌더링은 내용을 마크업으로 실행하지 않고 글자로 표시하도록 도와요. HTML을 허용해야 하는 특별한 경우에는 안전한 정화 절차가 필요해요.",
      },
      {
        stepTitle: "서버에서도 확인해요",
        prompt: "브라우저 화면을 고친 뒤 서버에서 추가로 확인할 일은 무엇일까요?",
        evidence: "게시판 API는 댓글을 저장하기 전에 길이·형식 제한을 아직 확인하지 않아요.",
        options: [
          "클라이언트에서 막았으니 API는 모든 요청을 그대로 저장한다",
          "서버에서 크기와 허용 형식을 검증하고, 오류에 내부 정보를 노출하지 않는다",
          "요청을 거절한 이유로 환경 변수와 스택 추적을 응답한다",
          "모든 댓글을 특별한 신뢰 표시가 있는 HTML로 처리한다",
        ],
        correctIndex: 1,
        explanation: "브라우저 검사는 우회될 수 있으므로 서버에서도 입력 크기와 형식을 검증해야 해요. 상세 내부 오류는 로그에 남기고 사용자에게는 필요한 안내만 보여줘요.",
      },
    ],
    references: [{ title: "OWASP · Cross Site Scripting Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" }],
  },
  {
    id: "access-audit",
    title: "필요한 권한만 남기기",
    label: "CASE 03 · 권한 점검표",
    summary: "가상 협력자의 업무 범위에 맞게 권한을 정하고 회수해요.",
    iconKey: "KeyRound",
    minLevel: 3,
    duration: "3분",
    mission: "업무에 필요한 접근만 주고 계약이 끝나면 닫아요.",
    briefing: "축제 디자인을 돕는 외부 협력자가 완성 이미지 파일을 받아야 해요. 팀 저장소에는 참가자 명단과 예산 자료도 함께 있어요. 필요한 자료만 열리도록 초대를 검토해 주세요.",
    artifactTitle: "가상 협력자 초대 요청",
    artifactText: "역할: 외부 포스터 디자이너\n요청 업무: 최종 승인된 이미지 내려받기\n계약 종료: 11월 30일\n현재 제안 권한: 전체 프로젝트 관리자",
    steps: [
      {
        stepTitle: "업무 범위를 확인해요",
        prompt: "초대를 승인하기 전에 가장 먼저 확인할 것은 무엇일까요?",
        evidence: "협력자는 최종 이미지가 필요하지만 참가자 개인정보나 예산 자료는 다루지 않아요.",
        options: [
          "협력자에게 관리자 권한을 주고 필요한 자료를 찾게 한다",
          "요청한 업무와 접근이 필요한 자료를 담당자와 확인한다",
          "팀 전체 공유 계정을 전달해 편하게 사용하게 한다",
          "모든 폴더에 임시 공개 링크를 만든다",
        ],
        correctIndex: 1,
        explanation: "권한은 사람의 직함보다 실제 업무에 필요한 자료와 기능을 기준으로 정해야 해요. 필요한 범위를 먼저 확인하면 과한 접근을 막을 수 있어요.",
      },
      {
        stepTitle: "작은 범위로 열어요",
        prompt: "협력자가 최종 이미지만 받도록 하려면 어떤 설정이 알맞을까요?",
        evidence: "최종 이미지 폴더에는 승인본만 있고, 원본·예산·참가자 자료는 다른 위치에 분리돼 있어요.",
        options: [
          "모든 프로젝트의 관리자 권한을 계속 부여한다",
          "완성 이미지 폴더만 읽기 가능하게 하고 계약 종료일을 설정한다",
          "다른 팀원의 암호를 함께 알려 준다",
          "사용 편의를 위해 참가자 연락처 편집 권한도 추가한다",
        ],
        correctIndex: 1,
        explanation: "최소 권한 원칙에 따라 필요한 폴더만 읽을 수 있게 하고, 접근에 끝나는 시점을 둡니다. 여러 사람이 한 계정을 공유하지 않도록 개인별 계정을 쓰세요.",
      },
      {
        stepTitle: "계약 종료 뒤 정리해요",
        prompt: "계약이 끝났을 때 해야 할 조치는 무엇일까요?",
        evidence: "계약 종료일이 지났고, 협력자는 새 업무를 맡지 않았어요.",
        options: [
          "요청이 오기 전까지 권한을 그대로 둔다",
          "개인별 접근 권한을 회수하고 변경 기록을 확인한다",
          "계정을 동료에게 양도한다",
          "계약 기록이 귀찮으니 로그와 승인 이력을 지운다",
        ],
        correctIndex: 1,
        explanation: "접근 권한은 업무 기간에 맞춰 부여하고 필요가 끝나면 회수해야 해요. 승인과 변경 기록을 보존하면 점검에 도움이 됩니다.",
      },
    ],
    references: [{ title: "NIST · Identity and Access Management", url: "https://www.nist.gov/identity-and-access-management" }],
  },
];

// 신규 시나리오는 검증된 콘텐츠 배치에서 추가합니다.
export const additionalLabScenarios: LabScenario[] = [
  ...foundationalLabScenarios,
  ...applicationLabScenarios,
  ...operationsLabScenarios,
  ...advancedLabScenarios,
];
export const labScenarios: LabScenario[] = [...originalLabScenarios, ...additionalLabScenarios];
export const LAB_SIMULATION_IDS = labScenarios.map((scenario) => scenario.id);

export function getUnlockedLabCount(level: number) {
  return labScenarios.filter((scenario) => level >= scenario.minLevel).length;
}
