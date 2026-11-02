import { expandedStoryArcs } from "./storyEpisodeSupport";

export type StoryArc = { previous: string; cliffhanger: string };

export const storyArc: Record<string, StoryArc> = {
  "security-basics": {
    previous: "새빛대 신입 민지가 축제 준비를 하다 봉인된 장비를 켜고, 비밀 프로젝트 틈이를 처음 만났어요.",
    cliffhanger: "예매자 명단을 연 사람은 민지가 아니었어요. 새벽 2시 13분, 손님 계정 하나가 먼저 들어와 있었습니다.",
  },
  "threat-model": {
    previous: "틈이와 민지는 새벽 접속을 따라가며 예매자·운영팀·결제 서비스 사이의 연결을 그렸어요.",
    cliffhanger: "guest_07은 손님처럼 보이지만 운영자 문까지 열 수 있어요. 그 계정의 주인은 누구일까요?",
  },
  account: {
    previous: "guest_07은 작년 축제 때 만들어진 뒤 아무도 회수하지 않은 대여 계정이었어요.",
    cliffhanger: "권한을 닫는 순간, 재호 선배가 틈이에게 남긴 암호화된 파일이 나타났어요.",
  },
  cryptography: {
    previous: "재호의 쪽지는 진짜 서명이었지만, 어젯밤 누군가가 마지막으로 내용을 바꾼 흔적이 남아 있었어요.",
    cliffhanger: "쪽지 끝의 주소는 운영실이 아니라 무대 뒤 테스트 장비를 가리키고 있습니다.",
  },
  network: {
    previous: "방문객 와이파이와 운영실 네트워크를 따라가자, 무대 뒤 장비가 중간 다리처럼 놓여 있었어요.",
    cliffhanger: "경계를 나눈 뒤에도 게시판 댓글 하나가 안쪽까지 도착했어요. 누군가 길이 막혔는지 시험하고 있습니다.",
  },
  web: {
    previous: "평범한 축제 응원 댓글은 입력창·서버·화면을 거치며 세 번이나 확인 없이 통과했어요.",
    cliffhanger: "댓글에 첨부된 사진의 QR 스티커가 운영실 출입구를 가리켜요. 사진 파일의 뒷면을 확인해야 합니다.",
  },
  privacy: {
    previous: "사진 메타데이터의 촬영 시간은 guest_07 접속 시간과 정확히 겹쳤어요. 하지만 시간만으로 사람을 지목할 수는 없었죠.",
    cliffhanger: "누군가 틈이 프로젝트를 알고 민지에게만 가짜 계정 확인 메일을 보냈어요.",
  },
  phishing: {
    previous: "가짜 메일을 공식 경로로 확인하는 동안, 운영팀 계정 하나가 낯선 기기에서 이미 로그인한 흔적이 발견됐어요.",
    cliffhanger: "민지가 몰래 틈이를 깨웠다는 사실까지 보고해야 합니다. 이제 사건 대응이 시작됩니다.",
  },
  incident: {
    previous: "민지는 자신의 실수까지 포함해 사실을 보고하고, 팀은 기기를 지우지 않은 채 로그와 증거를 보존했어요.",
    cliffhanger: "새벽 접속은 두 번이었고, 마지막 로그에는 졸업생 재호의 이름이 남아 있었습니다.",
  },
  "white-hat": {
    previous: "팀은 재호를 범인으로 몰지 않고, 허가서와 가짜 데이터로 테스트 서버를 점검하기로 했어요.",
    cliffhanger: "진짜 원인은 틈이의 테스트 모드가 운영 서버에 복사된 것이었어요. 축제 전에 마지막 안전 점검이 필요합니다.",
  },
  ...expandedStoryArcs,
};
