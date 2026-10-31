import {
  ArrowRight, BadgeCheck, BookOpen, Check, ChevronRight, Clock3, Code2, Flame,
  KeyRound, LockKeyhole, MailWarning, Network, ShieldCheck, Sparkles, Star,
  Target, Trophy, UserRound, Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { getCurrentStreak, getLevelNumber, getLevelProgress, getWeekStreakDates, useLearningProgress } from "@/hooks/useLearningProgress";

const lessonIcons = {
  phishing: MailWarning, account: KeyRound, privacy: UserRound,
  web: Code2, network: Network, incident: ShieldCheck,
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
  const hasLabAccess = level >= 3;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            <a className="nav-link nav-link-active" href="/">피드</a>
            <button className="nav-link" onClick={() => setLocation("/lab")}>실습실</button>
            <a className="nav-link" href="#my-progress">내 기록</a>
          </nav>
          <div className="topbar-right">
            <div className="top-stat streak-chip" aria-label={`연속 학습 ${currentStreak}일`}><Flame size={16} fill="currentColor" /><span>{currentStreak}</span><small>일</small></div>
            <div className="top-stat xp-chip" aria-label={`누적 ${progress.xp} XP`}><Zap size={15} fill="currentColor" /><span>{progress.xp.toLocaleString("ko-KR")}</span><small>XP</small></div>
            <button className="profile-avatar" aria-label={`레벨 ${level} 내 학습 기록`} onClick={() => document.getElementById("my-progress")?.scrollIntoView({ behavior: "smooth" })}>T</button>
          </div>
        </div>
      </header>

      <main className="home-container">
        <section className="home-welcome" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <span className="eyebrow"><span className="live-dot" /> 매일 조금씩, 보안 감각 ON</span>
            <h1 id="welcome-title">위험 신호를 알아보는<br /><span>눈을 키워요.</span></h1>
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

        <section className="story-section" aria-labelledby="story-title">
          <div className="section-heading story-heading"><div><span className="section-kicker">YOUR LEARNING STORIES</span><h2 id="story-title">오늘의 보안 스토리</h2></div><span className="story-count">{completedCount}<i>/</i>{lessons.length}</span></div>
          <div className="story-strip" role="list" aria-label="단원 바로가기">
            {lessons.map((lesson, index) => {
              const completed = completedIds.has(lesson.id);
              const unlocked = completed || index === 0 || completedIds.has(lessons[index - 1].id);
              const current = !completed && index === nextLessonIndex;
              const Icon = lessonIcons[lesson.id as keyof typeof lessonIcons] ?? ShieldCheck;
              return (
                <button className="story-item" key={lesson.id} onClick={() => unlocked && setLocation(`/lesson/${lesson.id}`)} disabled={!unlocked} aria-label={`${lesson.shortTitle}${completed ? " 완료" : current ? " 시작 가능" : unlocked ? " 시작 가능" : " 잠김"}`}>
                  <span className={`story-ring${completed ? " story-ring-complete" : current ? " story-ring-current" : !unlocked ? " story-ring-locked" : ""}`}><span className={`story-inner story-${lesson.id}`}><Icon size={20} /></span>{completed && <i className="story-check"><Check size={9} strokeWidth={3} /></i>}</span>
                  <span className="story-label">{lesson.shortTitle}</span>
                </button>
              );
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

            <section className="course-section" aria-labelledby="course-title">
              <div className="section-heading course-heading"><div><span className="section-kicker">THE FIELD GUIDE</span><h2 id="course-title">보안 감각 필드 가이드</h2><p>단서를 모으고, 내 판단으로 마무리해요.</p></div><span className="course-progress-pill"><BadgeCheck size={14} /> {completedCount}/{lessons.length}</span></div>
              <div className="course-grid">
                {lessons.map((lesson, index) => {
                  const completed = completedIds.has(lesson.id);
                  const unlocked = completed || index === 0 || completedIds.has(lessons[index - 1].id);
                  const current = !completed && index === nextLessonIndex;
                  const Icon = lessonIcons[lesson.id as keyof typeof lessonIcons] ?? ShieldCheck;
                  return (
                    <article className={`course-card${completed ? " course-card-done" : ""}${current ? " course-card-current" : ""}${!unlocked ? " course-card-locked" : ""}`} key={lesson.id}>
                      <button className={`course-cover cover-${lesson.id}`} onClick={() => unlocked && setLocation(`/lesson/${lesson.id}`)} disabled={!unlocked} aria-label={`${lesson.title} ${unlocked ? "열기" : "잠김"}`}>
                        <span className="cover-episode">FIELD NOTE {String(index + 1).padStart(2, "0")}</span><Icon size={32} strokeWidth={1.7} /><span className="cover-open">{completed ? <Check size={15} /> : !unlocked ? <LockKeyhole size={14} /> : <ArrowRight size={15} />}</span>
                      </button>
                      <div className="course-card-body"><div className="course-card-meta"><span>{lesson.category}</span>{completed ? <span className="meta-state state-done">완료</span> : current ? <span className="meta-state state-current">이어 학습</span> : !unlocked ? <span className="meta-state">잠김</span> : null}</div><h3>{lesson.shortTitle}</h3><p>{lesson.summary}</p><div className="course-card-foot"><span><Clock3 size={12} />{lesson.duration}</span><span><Zap size={12} />{lesson.xp + 5} XP</span></div></div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className={`lab-teaser${hasLabAccess ? " lab-teaser-open" : ""}`} aria-labelledby="lab-teaser-title">
              <div className="lab-teaser-icon"><Code2 size={22} /></div><div className="lab-teaser-copy"><span className="section-kicker">LEVEL 03 · SAFE PRACTICE</span><h2 id="lab-teaser-title">실습실에서 단서를 직접 찾아봐요.</h2><p>{hasLabAccess ? "모의 메시지와 가상 웹 사례에서 방어의 첫걸음을 연습해요." : `레벨 3에서 열려요 · 현재 레벨 ${level}. 기본 강좌를 끝내면 실습이 시작돼요.`}</p></div><button className="lab-teaser-action" onClick={() => setLocation("/lab")} aria-label="안전한 실습실 열기"><ChevronRight size={20} /></button>
            </section>
          </div>

          <aside className="insights-column" id="my-progress" aria-label="내 학습 기록">
            <section className="daily-goal-card"><div className="daily-goal-top"><div className="goal-icon"><Target size={18} /></div><div><span>오늘의 작은 목표</span><strong>학습 한 번 하기</strong></div><span className={`goal-status${dailyGoalComplete ? " goal-status-done" : ""}`}>{dailyGoalComplete ? "완료" : "5분"}</span></div><div className="daily-goal-line"><span>오늘의 기록</span><strong>{dailyGoalComplete ? `${todayLessonCount}회 완료` : "시작 전"}</strong></div><div className="daily-goal-track" role="progressbar" aria-label="오늘의 학습 목표" aria-valuemin={0} aria-valuemax={1} aria-valuenow={dailyGoalComplete ? 1 : 0}><i style={{ width: dailyGoalComplete ? "100%" : "0%" }} /></div><p>{dailyGoalComplete ? "좋아요. 오늘의 작은 보안 습관을 만들었어요." : "짧은 스토리 하나로 오늘의 리듬을 시작해요."}</p></section>

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

      <nav className="mobile-dock" aria-label="모바일 메뉴"><a className="dock-active" href="/"><BookOpen size={18} /><span>피드</span></a><button onClick={() => setLocation("/lab")}><Code2 size={18} /><span>실습</span></button><a href="#my-progress"><UserRound size={18} /><span>내 기록</span></a></nav>
      <footer className="site-footer"><BrandMark compact /><span>TEUM · 안전하게 알고, 작게 실천하기.</span><a href="#my-progress">내 기록 <ArrowRight size={12} /></a></footer>
    </div>
  );
}
