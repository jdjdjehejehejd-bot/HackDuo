import {
  ArrowRight, BadgeCheck, BookOpen, Check, ChevronRight, Clock3, Code2, Flame,
  KeyRound, LockKeyhole, MailWarning, Network, ShieldCheck, Sparkles, Star,
  Target, Trophy, UserRound, Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { storyUnits } from "@/data/storyUnits";
import { getCurrentStreak, getLevelNumber, getLevelProgress, getRecommendedReview, getWeekStreakDates, useLearningProgress } from "@/hooks/useLearningProgress";

const lessonIcons = {
  phishing: MailWarning, account: KeyRound, privacy: UserRound,
  web: Code2, network: Network, incident: ShieldCheck,
  "security-basics": ShieldCheck, "threat-model": Target, cryptography: LockKeyhole,
  "white-hat": ShieldCheck,
} as const;
const weekdayNames = ["월", "화", "수", "목", "금", "토", "일"];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeek() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return weekdayNames.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { label, key: getDateKey(date), isToday: getDateKey(date) === getDateKey(today) };
  });
}

function getUnitLessons(unitId: string) {
  const storyLessons = lessons.filter((lesson) => lesson.storyUnitId === unitId);
  if (storyLessons.length > 0) return storyLessons;
  const unitNumber = Number(unitId.replace("unit-", ""));
  return lessons.slice((unitNumber - 1) * 5, unitNumber * 5);
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { progress } = useLearningProgress();
  const completedIds = new Set(progress.completedLessonIds);
  const completedCount = lessons.filter((lesson) => completedIds.has(lesson.id)).length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id));
  const nextLessonIndex = nextLesson ? lessons.findIndex((lesson) => lesson.id === nextLesson.id) : -1;
  const level = getLevelNumber(progress.xp);
  const xpWithinLevel = getLevelProgress(progress.xp);
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const activeDates = currentStreak > 0 ? getWeekStreakDates(progress.lastActiveDate, progress.streak) : new Set<string>();
  const week = getWeek();
  const todayLessonCount = progress.dailyActivityDate === getDateKey(new Date()) ? progress.dailyLessonCount : 0;
  const dailyGoalComplete = todayLessonCount > 0;
  const currentLesson = nextLesson ?? lessons[0];
  const currentUnitId = currentLesson.storyUnitId ?? `unit-${String(Math.floor(lessons.findIndex((lesson) => lesson.id === currentLesson.id) / 5) + 1).padStart(2, "0")}`;
  const currentUnit = storyUnits.find((unit) => unit.id === currentUnitId) ?? storyUnits[0];
  const currentUnitLessons = getUnitLessons(currentUnit.id);
  const hasLabAccess = level >= 3;
  const recommendedReview = getRecommendedReview(lessons, progress);
  const reviewPerformance = recommendedReview ? progress.lessonPerformance[recommendedReview.id] : undefined;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            <a className="nav-link nav-link-active" href="/">학습 피드</a>
            <button className="nav-link" onClick={() => setLocation("/lab")}>안전 실습</button>
            <button className="nav-link" onClick={() => setLocation("/my")}>내 노트</button>
          </nav>
          <div className="topbar-right">
            <div className="top-stat streak-chip" aria-label={`연속 학습 ${currentStreak}일`}><Flame size={16} fill="currentColor" /><span>{currentStreak}</span><small>일</small></div>
            <div className="top-stat xp-chip" aria-label={`누적 ${progress.xp} XP`}><Zap size={15} fill="currentColor" /><span>{progress.xp.toLocaleString("ko-KR")}</span><small>XP</small></div>
            <button className="profile-avatar" aria-label={`${progress.displayName}의 레벨 ${level} 내 노트 열기`} onClick={() => setLocation("/my")}>{progress.displayName.slice(0, 1)}</button>
          </div>
        </div>
      </header>

      <main className="home-container">
        <section className="home-welcome" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <span className="eyebrow"><span className="live-dot" /> 매일 조금씩, 보안 감각 ON</span>
            <h1 id="welcome-title">{progress.displayName}님,<br /><span>위험 신호를 알아봐요.</span></h1>
            <p>짧은 이야기로 배우고, 직접 판단하며 내 것으로 만들어요.</p>
            <button className="button-primary welcome-cta" onClick={() => setLocation(`/lesson/${currentLesson.id}`)}>{nextLesson ? "이어서 배우기" : "오늘의 복습 시작"}<ArrowRight size={17} /></button>
            <div className="welcome-proof"><ShieldCheck size={14} /> 모든 연습은 안전한 가상 시나리오 안에서</div>
          </div>
          <div className="welcome-stats" aria-label={`레벨 ${level}, ${progress.xp} XP`}>
            <div className="welcome-avatar"><span>TEUM</span><strong>LV.{String(level).padStart(2, "0")}</strong></div>
            <div className="avatar-orbit orbit-a" /><div className="avatar-orbit orbit-b" />
            <div className="avatar-note"><Flame size={14} fill="currentColor" /> {currentStreak}일 연속</div>
            <div className="avatar-xp"><Zap size={14} fill="currentColor" /> {progress.xp} XP</div>
            <Sparkles className="avatar-spark" size={19} />
          </div>
        </section>

        <section className="quick-summary" aria-label="내 학습 요약">
          <div className="quick-summary-label"><span className="section-kicker">YOUR DASHBOARD</span><strong>지금 내 학습 상태</strong></div>
          <button className="quick-summary-item quick-summary-action" onClick={() => setLocation(`/lesson/${currentLesson.id}`)}>
            <span className="quick-summary-icon"><BookOpen size={15} /></span><span><small>다음 행동</small><strong>{nextLesson ? "다음 스토리 이어가기" : "완료한 스토리 복습하기"}</strong><em>{currentLesson.shortTitle}</em></span><ChevronRight size={15} />
          </button>
          <div className="quick-summary-item"><span className="quick-summary-icon quick-summary-icon-progress"><BadgeCheck size={15} /></span><span><small>전체 진도</small><strong>{completedCount}/{lessons.length} 레슨</strong><em>{percent}% 완료</em></span></div>
          <div className="quick-summary-item"><span className="quick-summary-icon quick-summary-icon-streak"><Flame size={15} /></span><span><small>학습 리듬</small><strong>{currentStreak}일 연속</strong><em>{dailyGoalComplete ? "오늘 목표 완료" : "오늘 1회 시작하기"}</em></span></div>
          <button className={`quick-summary-item quick-summary-action${hasLabAccess ? " quick-summary-lab-open" : ""}`} onClick={() => setLocation("/lab")}>
            <span className="quick-summary-icon quick-summary-icon-lab"><Code2 size={15} /></span><span><small>안전 실습</small><strong>{hasLabAccess ? "실습실 열림" : `레벨 ${Math.max(3 - level, 0)}단계 남음`}</strong><em>{hasLabAccess ? "가상 시나리오 시작" : "기초 레슨을 이어가세요"}</em></span><ChevronRight size={15} />
          </button>
        </section>

        <section className="story-section" aria-labelledby="story-title">
          <div className="section-heading story-heading"><div><span className="section-kicker">UNIT {String(currentUnit.number).padStart(2, "0")} · IN PROGRESS</span><h2 id="story-title">오늘의 보안 스토리</h2><p>{currentUnit.title} · {currentUnit.promise}</p></div><span className="story-count">{currentUnitLessons.filter((lesson) => completedIds.has(lesson.id)).length}<i>/</i>{currentUnitLessons.length}</span></div>
          <div className="today-unit-banner"><div><strong>{currentUnit.title}</strong><span>{currentUnit.arc}</span></div><button className="button-light" onClick={() => setLocation(`/unit/${currentUnit.id}`)}>단원 열기 <ArrowRight size={15} /></button></div>
          <div className="story-strip today-story-strip" role="list" aria-label="현재 단원 레슨">
            {currentUnitLessons.map((lesson, index) => {
              const completed = completedIds.has(lesson.id);
              const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
              const unlocked = completed || lessonIndex === 0 || completedIds.has(lessons[lessonIndex - 1]?.id);
              const current = !completed && lesson.id === nextLesson?.id;
              const Icon = lessonIcons[lesson.id as keyof typeof lessonIcons] ?? ShieldCheck;
              return <button className="today-story-item" key={lesson.id} onClick={() => unlocked && setLocation(`/lesson/${lesson.id}`)} disabled={!unlocked} aria-label={`${lesson.shortTitle} ${completed ? "완료" : current ? "이어 학습" : !unlocked ? "잠김" : "시작 가능"}`} title={lesson.shortTitle}><span className={`today-story-index${completed ? " is-done" : current ? " is-current" : ""}`}>{completed ? <Check size={17} /> : <Icon size={19} />}</span><span className="today-story-number">{String(index + 1).padStart(2, "0")}</span></button>;
            })}
          </div>
        </section>

        <div className="home-columns">
          <div className="feed-column">
            <section className="spotlight-card" aria-labelledby="spotlight-title">
              <div className="spotlight-top"><span className="spotlight-label"><Sparkles size={13} /> {nextLesson ? "NEXT UP FOR YOU" : "TODAY'S REPLAY"}</span><span className="spotlight-duration"><Clock3 size={13} /> {currentLesson.duration}</span></div>
              <div className="spotlight-content">
                <div className="spotlight-copy"><span className="spotlight-category">{currentLesson.category} · EP.{String((nextLesson ? nextLessonIndex : 0) + 1).padStart(2, "0")}</span><h2 id="spotlight-title">{currentLesson.title}</h2><p>{currentLesson.summary}</p><button className="button-light" onClick={() => setLocation(`/lesson/${currentLesson.id}`)}>{nextLesson ? "스토리 열기" : "다시 보기"}<ArrowRight size={16} /></button></div>
                <div className="spotlight-art" aria-hidden="true"><div className="spotlight-halo" /><div className="spotlight-icon"><ShieldCheck size={41} strokeWidth={1.6} /></div><span className="spotlight-sparkle sparkle-one">✦</span><span className="spotlight-sparkle sparkle-two">✳</span></div>
              </div>
              <div className="spotlight-foot"><span><BookOpen size={13} /> 개념 3개</span><span><Target size={13} /> 문제 {currentLesson.questions.length}개</span><span><Zap size={13} fill="currentColor" /> 최대 {currentLesson.xp + 5} XP</span></div>
            </section>

            <section className="unit-directory" aria-labelledby="unit-directory-title">
              <div className="section-heading course-heading"><div><span className="section-kicker">THE STORY UNIVERSE · {storyUnits.length} UNITS</span><h2 id="unit-directory-title">단원별 보안 스토리</h2><p>큰 사건을 선택하면 그 단원의 레슨과 진행 상황을 볼 수 있어요.</p></div><span className="course-progress-pill"><BadgeCheck size={14} /> {completedCount}/{lessons.length}</span></div>
              <div className="unit-directory-list">{storyUnits.map((unit) => { const unitLessons = getUnitLessons(unit.id); const done = unitLessons.filter((lesson) => completedIds.has(lesson.id)).length; const active = unit.id === currentUnit.id; return <button className={`unit-directory-row${active ? " is-active" : ""}`} key={unit.id} onClick={() => setLocation(`/unit/${unit.id}`)}><span className="unit-directory-number">{String(unit.number).padStart(2, "0")}</span><span className="unit-directory-copy"><strong>{unit.title}</strong><small>{unit.promise}</small></span><span className="unit-directory-progress">{done}/{unitLessons.length || 5}<small>레슨</small></span><ChevronRight size={17} /></button>; })}</div>
            </section>

            <section className={`lab-teaser${hasLabAccess ? " lab-teaser-open" : ""}`} aria-labelledby="lab-teaser-title">
              <div className="lab-teaser-icon"><Code2 size={22} /></div><div className="lab-teaser-copy"><span className="section-kicker">LEVEL 03 · SAFE PRACTICE</span><h2 id="lab-teaser-title">실습실에서 단서를 직접 찾아봐요.</h2><p>{hasLabAccess ? "모의 메시지와 가상 웹 사례에서 방어의 첫걸음을 연습해요." : `레벨 3에서 열려요 · 현재 레벨 ${level}. 기본 강좌를 끝내면 실습이 시작돼요.`}</p></div><button className="lab-teaser-action" onClick={() => setLocation("/lab")} aria-label="안전한 실습실 열기"><ChevronRight size={20} /></button>
            </section>
          </div>

          <aside className="insights-column" id="my-progress" aria-label="내 학습 기록">
            <section className="daily-goal-card"><div className="daily-goal-top"><div className="goal-icon"><Target size={18} /></div><div><span>오늘의 작은 목표</span><strong>학습 한 번 하기</strong></div><span className={`goal-status${dailyGoalComplete ? " goal-status-done" : ""}`}>{dailyGoalComplete ? "완료" : "5분"}</span></div><div className="daily-goal-line"><span>오늘의 기록</span><strong>{dailyGoalComplete ? `${todayLessonCount}회 완료` : "시작 전"}</strong></div><div className="daily-goal-track" role="progressbar" aria-label="오늘의 학습 목표" aria-valuemin={0} aria-valuemax={1} aria-valuenow={dailyGoalComplete ? 1 : 0}><i style={{ width: dailyGoalComplete ? "100%" : "0%" }} /></div><p>{dailyGoalComplete ? "좋아요. 오늘의 작은 보안 습관을 만들었어요." : "짧은 스토리 하나로 오늘의 리듬을 시작해요."}</p></section>
            {recommendedReview && reviewPerformance && <section className="review-recommendation" aria-labelledby="review-title"><div className="review-recommendation-icon"><Target size={16} /></div><div><span className="section-kicker">SMART REPLAY</span><h2 id="review-title">헷갈렸던 문제만 다시 풀어요.</h2><p><strong>{recommendedReview.shortTitle}</strong>에서 틀린 문제를 모아 짧게 복습해요.</p><small>최근 정답률 {Math.round((reviewPerformance.correct / (reviewPerformance.attempts * reviewPerformance.total)) * 100)}%</small></div><button onClick={() => setLocation("/replay")} aria-label="틀린 문제만 Smart Replay"><ArrowRight size={17} /></button></section>}

            <section className="progress-card">
              <div className="card-heading"><div><span className="section-kicker">YOUR SIGNAL</span><h2>쌓이는 보안 감각</h2></div><Trophy size={19} className="trophy-icon" /></div>
              <div className="progress-ring-row"><div className="progress-ring" role="progressbar" aria-label="전체 강좌 진도" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={`${completedCount}개 단원 완료, ${percent}%`} style={{ background: `conic-gradient(#c651ef ${percent * 3.6}deg, #eeeaf2 0deg)` }}><div><strong>{percent}<small>%</small></strong><span>필드 가이드</span></div></div><div className="progress-ring-copy"><strong>레벨 {level} · {progress.xp} XP</strong><span>{completedCount === lessons.length ? "기초 필드 가이드를 모두 마쳤어요." : `${lessons.length - completedCount}개 스토리가 남아 있어요.`}</span><div className="mini-progress" role="progressbar" aria-label="다음 레벨 경험치 진도" aria-valuemin={0} aria-valuemax={50} aria-valuenow={xpWithinLevel}><i style={{ width: `${(xpWithinLevel / 50) * 100}%` }} /></div><small>다음 레벨까지 {50 - xpWithinLevel} XP</small></div></div>
              <div className="stat-divider" /><div className="week-header"><strong>이번 주의 리듬</strong><span>하루씩 쌓아봐요</span></div><div className="week-strip" aria-label="이번 주 학습 스트릭">{week.map((day) => { const active = activeDates.has(day.key); return <div className={`week-day${active ? " week-day-active" : ""}${day.isToday ? " week-day-today" : ""}`} key={day.key}><span>{day.label}</span><i>{active ? <Check size={11} strokeWidth={3} /> : day.isToday ? <span className="today-dot" /> : null}</i></div>; })}</div><div className="week-foot"><Flame size={14} fill="currentColor" /><span>{currentStreak > 0 ? `지금 ${currentStreak}일째, 흐름이 좋아요.` : "오늘의 학습으로 첫 기록을 남겨요."}</span></div>
            </section>

            <section className="level-card"><div className="level-topline"><span className="level-badge"><Sparkles size={12} /> LEVEL {String(level).padStart(2, "0")}</span><span className="level-xp">{progress.xp} <small>XP</small></span></div><h3>{level >= 3 ? "가상 실습이 열렸어요" : level === 2 ? "단서가 눈에 들어오기 시작해요" : "첫 번째 보안 습관을 시작해요"}</h3><p>{level >= 3 ? "안전한 모의 환경에서 판단을 연습해 보세요." : "배울수록 실습실의 새로운 시나리오가 열려요."}</p><div className="level-progress-track" role="progressbar" aria-label="다음 레벨까지 경험치 진도" aria-valuemin={0} aria-valuemax={50} aria-valuenow={xpWithinLevel}><i style={{ width: `${(xpWithinLevel / 50) * 100}%` }} /></div><div className="level-progress-caption"><span>다음 레벨까지</span><span>{xpWithinLevel}/50 XP</span></div></section>

            <section className="tip-card"><div className="tip-header"><span className="tip-icon"><Star size={14} /></span><span>오늘의 안전 한 줄</span></div><p>“급한 메시지일수록,<br /><strong>링크보다 공식 경로를 확인하기.”</strong></p><div className="tip-footer"><span>작은 확인이 큰 사고를 막아요.</span><MailWarning size={16} /></div></section>
            <div className="safety-note"><ShieldCheck size={16} /><span>배운 만큼 안전해지는<br /><strong>나만의 보안 루틴</strong></span><ArrowRight size={14} /></div>
          </aside>
        </div>
      </main>

      <nav className="mobile-dock" aria-label="모바일 메뉴"><a className="dock-active" href="/"><BookOpen size={18} /><span>학습</span></a><button onClick={() => setLocation("/lab")}><Code2 size={18} /><span>실습</span></button><button onClick={() => setLocation("/my")}><UserRound size={18} /><span>내 노트</span></button></nav>
      <footer className="site-footer"><BrandMark compact /><span>TEUM · 안전하게 알고, 작게 실천하기.</span><button type="button" onClick={() => setLocation("/my")}>My 노트 <ArrowRight size={12} /></button></footer>
    </div>
  );
}
