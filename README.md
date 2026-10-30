# HackDuo — 보안을 퀘스트처럼

HackDuo는 초보자가 정보보안 기초를 짧은 퀘스트와 연속 퀴즈로 익히는 한국어 학습 앱입니다. 듀오링고에서 익숙한 학습 지도·연속 학습·XP 같은 패턴을 오리지널 HackDuo 방패 친구와 방어 중심 콘텐츠로 풀어냅니다. 실제 공격이나 시스템 침해 실습 없이 피싱 식별, 계정 보호, 안전한 웹 개발 습관을 배웁니다.

## 앱에서 할 수 있는 것

- 순서가 있는 퀘스트 경로를 따라 개념 카드 두 장과 다섯 문항을 풀고, 매 문제의 정답 피드백과 해설을 확인합니다.
- 틀린 답은 하트를 소모하지만 레슨은 막히지 않아 누구나 끝까지 배울 수 있습니다.
- 첫 시도 정답에 따라 XP를 얻고, 레벨·진도·완벽 보너스와 성취 배지를 확인합니다.
- 매일 퀘스트 목표와 주간 연속 학습 스트릭으로 학습 습관을 이어갑니다. 완료 기록은 다시 학습할 때도 스트릭에 반영됩니다.
- 학습 기록은 로그인이나 서버 없이 현재 브라우저의 `localStorage`에 저장됩니다. 브라우저 데이터가 지워지거나 다른 기기를 사용하면 기록은 공유되지 않습니다.

## 로컬 실행

```bash
pnpm install
pnpm dev:static
```

개발 주소는 기본적으로 `http://localhost:3000`입니다. 타입 검사는 `pnpm check`, 정적 빌드는 `pnpm build:static`으로 실행합니다. 전체 검사 모음은 `pnpm test`입니다.

## Vercel 배포

저장소를 Vercel 프로젝트로 가져오면 `vercel.json`이 `pnpm install --frozen-lockfile`, `pnpm build:static`, `dist/public` 출력 경로를 지정합니다. 레슨 URL을 새로고침해도 앱 셸로 연결되도록 SPA 경로 규칙도 포함합니다. GitHub 저장소는 비공개로 유지하며, 비공개 저장소 접근을 위해 Vercel에서 해당 저장소에 대한 Git 연결 권한을 부여해야 합니다.

## 주요 코드 위치

- `client/src/pages/Home.tsx`: 퀘스트 학습 지도, 매일 목표, XP·스트릭·배지 대시보드
- `client/src/pages/LessonPage.tsx`: 개념 카드, 하트가 있는 순차 퀴즈, 해설과 완료 보상
- `client/src/data/lessons.ts`: 피싱, 계정 보호, 웹 보안 기초 콘텐츠
- `client/src/hooks/useLearningProgress.ts`: 로컬 진도·XP·스트릭·일일 활동 기록
- `client/src/components/ShieldBuddy.tsx`: HackDuo 오리지널 방패 마스코트
- `client/src/index.css`: 반응형 학습 경험과 시각 스타일

새 콘텐츠도 방어·예방 중심을 유지하고, 허가 없는 실제 시스템 공격이나 침해 절차는 포함하지 않습니다.
