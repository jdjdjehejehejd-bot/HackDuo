# HackDuo — 보안을 퀘스트처럼

HackDuo는 초보자가 정보보안 기초를 짧은 퀘스트와 퀴즈로 익히는 한국어 학습 앱입니다. 실제 공격이나 시스템 침해 실습 없이 피싱 식별, 비밀번호·다중 인증, 웹 앱의 안전한 입력 처리 같은 방어 주제를 배웁니다.

## 앱에서 할 수 있는 것

- 단계별 학습 지도에서 피싱, 계정 보호, 웹 보안 퀘스트를 선택합니다.
- 짧은 개념 레슨을 읽고 객관식 퀴즈와 해설로 내용을 확인합니다.
- 완료한 퀘스트, 전체 진도, XP와 레벨 피드백, 연속 학습 스트릭을 확인합니다.
- 학습 기록은 계정이나 서버 없이 현재 브라우저의 `localStorage`에 저장됩니다. 브라우저 데이터가 지워지거나 다른 기기를 사용하면 기록은 공유되지 않습니다.

## 로컬에서 실행하기

```bash
pnpm install
pnpm dev:static
```

기본 개발 주소는 `http://localhost:3000`입니다. 타입 검사는 `pnpm check`, 정적 프로덕션 빌드는 `pnpm build:static`으로 실행합니다.

## 주요 코드 위치

- `client/src/pages/Home.tsx`: 학습 대시보드와 퀘스트 경로
- `client/src/pages/LessonPage.tsx`: 마이크로 레슨, 인터랙티브 퀴즈와 완료 피드백
- `client/src/data/lessons.ts`: 안전한 학습 콘텐츠와 퀴즈 데이터
- `client/src/hooks/useLearningProgress.ts`: 로컬 진도·XP·스트릭 저장
- `client/src/index.css`: 반응형 화면과 시각 스타일
- `client/public/manus-routes.json`: 앱 페이지 경로 목록

새 학습 콘텐츠를 추가할 때도 방어·예방 중심을 유지하고, 허가 없는 실제 시스템 공격이나 침해 절차는 포함하지 않습니다.
