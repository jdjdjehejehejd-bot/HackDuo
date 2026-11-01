export type CartoonStoryboard = {
  badge: string;
  location: string;
  propGlyph: string;
  propName: string;
  steps: [string, string, string][];
};

/** Scene props and beats for the cartoon stories; these are not flowchart nodes. */
export const lessonStoryboards: Record<string, CartoonStoryboard> = {
  "security-basics": {
    badge: "제1화 · 축제 예매소",
    location: "새빛대학교 축제 현장",
    propGlyph: "표",
    propName: "예매 명단",
    steps: [
      ["예매자 명단", "권한을 확인", "허가된 사람만 보기"],
      ["공연 시간표", "승인 내역을 비교", "정확한 시간으로 안내"],
      ["입장 직전 요청", "여유·복구를 준비", "끊김 없이 입장"],
    ],
  },
  "threat-model": {
    badge: "제2화 · 캠퍼스 지도",
    location: "축제 시스템 관제실",
    propGlyph: "지도",
    propName: "시스템 지도",
    steps: [
      ["예매 데이터", "중요도를 따져", "먼저 지킬 자산"],
      ["사용자와 연결", "경계·입력 지점을 살펴", "위협 모델을 그려"],
      ["가능성과 영향", "상황을 함께 검토해", "위험 대응 순서를 정해"],
    ],
  },
  account: {
    badge: "제3화 · 운영실 출입문",
    location: "학생회 운영실",
    propGlyph: "ID",
    propName: "출입 카드",
    steps: [
      ["민지의 로그인", "증거로 신원을 확인해", "본인 계정으로 접속"],
      ["확인된 사용자", "역할과 권한을 살펴", "필요한 기능만 허용"],
      ["봉사 업무 종료", "남은 권한을 회수해", "안전하게 출입 종료"],
    ],
  },
  cryptography: {
    badge: "제4화 · 비밀 쪽지",
    location: "축제 홍보실",
    propGlyph: "키",
    propName: "비밀 쪽지",
    steps: [
      ["공연 취소 쪽지", "키로 내용을 잠가", "허가자만 읽기"],
      ["포스터 파일", "해시·서명을 확인해", "변경과 출처 확인"],
      ["로그인 비밀번호", "salt와 전용 해시로", "복원 없이 안전하게 검증"],
    ],
  },
  network: {
    badge: "제5화 · 네트워크 문지기",
    location: "축제 네트워크실",
    propGlyph: "망",
    propName: "연결 지도",
    steps: [
      ["웹사이트 이름", "DNS가 주소를 찾아", "서버와 연결"],
      ["방문객 와이파이", "방화벽으로 구역을 나눠", "회계망은 접근 차단"],
      ["대시보드 요청", "TLS가 연결을 감싸", "전송 정보를 보호"],
    ],
  },
  web: {
    badge: "제6화 · 축제 게시판",
    location: "새빛대학교 게시판 개발실",
    propGlyph: "웹",
    propName: "댓글 미리보기",
    steps: [
      ["새 댓글 입력", "서버가 허용 범위를 확인해", "올바른 댓글만 접수"],
      ["댓글과 데이터베이스", "질의와 입력을 분리해", "문자열은 명령이 아닌 데이터"],
      ["저장한 글 다시 보기", "문맥에 맞게 표시해", "글자가 코드처럼 실행되지 않게"],
    ],
  },
  privacy: {
    badge: "제7화 · 공유하기 전",
    location: "축제 기록 보관실",
    propGlyph: "자료",
    propName: "사진과 참가자 정보",
    steps: [
      ["사진과 연락처", "민감도와 목적을 구분해", "필요한 자료만 선택"],
      ["공유 요청", "동의와 범위를 확인해", "허용된 항목만 공유"],
      ["보관 기한이 지난 파일", "필요 여부를 다시 살펴", "불필요한 정보는 삭제"],
    ],
  },
  phishing: {
    badge: "제8화 · 수상한 메일",
    location: "민지의 학생회 받은 편지함",
    propGlyph: "메일",
    propName: "계정 경고 메일",
    steps: [
      ["급한 계정 경고", "주소와 표현을 살펴", "링크 클릭을 잠깐 보류"],
      ["낯선 발신자", "공식 사이트와 대조해", "확인된 경로로 로그인"],
      ["의심스러운 메시지", "신고하고 공유를 멈춰", "친구들의 피해도 예방"],
    ],
  },
  incident: {
    badge: "제9화 · 이상 징후 발견",
    location: "학생회 보안 대응실",
    propGlyph: "경보",
    propName: "로그인 알림",
    steps: [
      ["이상 로그인 알림", "공식 기록을 확인해", "확인된 사실부터 기록"],
      ["의심 계정", "담당자에게 알리고 세션을 끝내", "확산을 먼저 제한"],
      ["검증한 백업", "안전성을 확인한 뒤 복구해", "배운 점을 다음 대응에 반영"],
    ],
  },
  "white-hat": {
    badge: "번외편 · 점검 요청서",
    location: "새빛대학교 보안 실습실",
    propGlyph: "허가",
    propName: "점검 범위표",
    steps: [
      ["점검 요청서", "대상·시간·중단 조건을 확인해", "허가된 범위만 시작"],
      ["가상 로그인 화면", "합성 데이터로 최소 검증해", "실제 계정은 건드리지 않기"],
      ["보안 보고서", "영향과 완화책을 정리해", "안전하게 수정·재확인"],
    ],
  },
};
