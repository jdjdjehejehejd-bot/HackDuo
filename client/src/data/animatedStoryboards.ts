export type LessonStoryboard = {
  badge: string;
  sourceGlyph: string;
  mechanismGlyph: string;
  resultGlyph: string;
  flows: [string, string, string][];
};

/** The instructional diagrams for all nine animated lessons, three concepts each. */
export const lessonStoryboards: Record<string, LessonStoryboard> = {
  "security-basics": {
    badge: "축제 앱",
    sourceGlyph: "표",
    mechanismGlyph: "CIA",
    resultGlyph: "OK",
    flows: [
      ["예매자 명단", "권한을 확인", "허가된 사람만 보기"],
      ["공연 시간", "승인·변경 기록", "정확한 시간표"],
      ["입장 직전 요청", "여유·복구 준비", "끊김 없는 접속"],
    ],
  },
  "threat-model": {
    badge: "위험 지도",
    sourceGlyph: "자산",
    mechanismGlyph: "경로",
    resultGlyph: "우선",
    flows: [
      ["예매 데이터", "중요도 살피기", "먼저 지킬 자산"],
      ["사용자·연결", "경계·입력 찾기", "위협 모델"],
      ["가능성·영향", "맥락과 함께 비교", "위험 우선순위"],
    ],
  },
  account: {
    badge: "계정 관문",
    sourceGlyph: "민서",
    mechanismGlyph: "ID?",
    resultGlyph: "허용",
    flows: [
      ["민서의 로그인", "증거로 확인", "확인된 신원"],
      ["확인된 사용자", "역할·권한 검사", "필요한 기능만"],
      ["봉사 업무 종료", "권한을 회수", "접근 종료"],
    ],
  },
  cryptography: {
    badge: "암호 도구",
    sourceGlyph: "원문",
    mechanismGlyph: "키 + 해시",
    resultGlyph: "검증",
    flows: [
      ["비밀 쪽지", "키로 암호화", "허가자만 읽기"],
      ["포스터 파일", "해시·전자서명", "변경·출처 확인"],
      ["비밀번호", "salt + 전용 해시", "복원 없이 검증"],
    ],
  },
  network: {
    badge: "연결 경계",
    sourceGlyph: "기기",
    mechanismGlyph: "경계",
    resultGlyph: "서버",
    flows: [
      ["사이트 이름", "DNS가 주소 조회", "서버를 찾아 연결"],
      ["방문객 와이파이", "방화벽·구역 분리", "회계망은 차단"],
      ["대시보드 요청", "TLS로 보호", "전송 중 기밀성"],
    ],
  },
  web: {
    badge: "게시판 요청",
    sourceGlyph: "입력",
    mechanismGlyph: "검사",
    resultGlyph: "출력",
    flows: [
      ["댓글 입력", "서버가 검증", "허용된 형식"],
      ["댓글 데이터", "질의와 분리", "명령 아닌 데이터"],
      ["게시글 표시", "문맥에 맞게 인코딩", "문자 그대로 표시"],
    ],
  },
  privacy: {
    badge: "데이터 흐름",
    sourceGlyph: "자료",
    mechanismGlyph: "목적",
    resultGlyph: "최소",
    flows: [
      ["사진·연락처", "민감도 분류", "필요한 만큼만"],
      ["공유 요청", "목적·동의 확인", "허용된 범위만"],
      ["보관 중 자료", "기한을 점검", "불필요한 정보 삭제"],
    ],
  },
  phishing: {
    badge: "받은 편지함",
    sourceGlyph: "메일",
    mechanismGlyph: "단서",
    resultGlyph: "신고",
    flows: [
      ["긴급 계정 알림", "주소·표현 점검", "링크 클릭 보류"],
      ["낯선 발신자", "공식 경로 대조", "안전하게 확인"],
      ["의심 메시지", "신고·공유 중단", "다른 피해 예방"],
    ],
  },
  incident: {
    badge: "대응 타임라인",
    sourceGlyph: "경보",
    mechanismGlyph: "대응",
    resultGlyph: "복구",
    flows: [
      ["로그인 경보", "공식 기록 확인", "사실부터 기록"],
      ["의심 계정", "보고·세션 억제", "확산 범위 축소"],
      ["안전한 백업", "검증 후 복구", "배운 점 반영"],
    ],
  },
};
