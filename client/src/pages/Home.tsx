import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Code2,
  Flame,
  KeyRound,
  MailWarning,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { getCurrentStreak, getWeekStreakDates, useLearningProgress } from "@/hooks/useLearningProgress";

const lessonIcons = {
  phishing: MailWarning,
  account: KeyRound,
  web: Code2,
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
  const level = Math.floor(progress.xp / 100) + 1;
  const xpWithinLevel = progress.xp % 100;
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const activeDates = getWeekStreakDates(progress.lastActiveDate, progress.streak);
  const week = getWeek();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="/" aria-label="HackDuo 홈">
            <BrandMark />
          </a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            <a className="nav-link nav-link-active" href="#learn">학습 지도</a>
            <a className="nav-link" href="#safety">안전 원칙</a>
          </nav>
          <div className="topbar-right">
            <div className="top-stat streak-chip" aria-label={`연속 학습 ${currentStreak}일`}>
              <Flame size={17} fill="currentColor" />
              <span>{currentStreak}</span>
              <small>일</small>
            </div>
            <div className="top-stat xp-chip" aria-label={`누적 ${progress.xp} XP`}>
              <Zap size={16} fill="currentColor" />
              <span>{progress.xp.toLocaleString("ko-KR")}</span>
              <small>XP</small>
            </div>
            <div className="profile-dot" aria-label={`레벨 ${level} 학습자`} title={`레벨 ${level} 학습자`}>
              <span>H</span>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-wrap">
        <section className="welcome-row" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> 오늘도 안전하게, 한 걸음</div>
            <h1 id="welcome-title">보안 감각을<br className="mobile-break" /> <span>퀘스트처럼</span> 키워요.</h1>
            <p>매일 5분, 디지털 세상을 지키는 습관을 배워요.</p>
            <button
              className="button-primary welcome-cta"
              onClick={() => setLocation(`/lesson/${(nextLesson ?? lessons[0]).id}`)}
            >
              {nextLesson ? "오늘의 퀘스트 시작" : "퀘스트 다시 보기"}
              <ArrowRight size={17} />
            </button>
            <div className="welcome-note"><ShieldCheck size={14} /> 실제 공격 없이, 안전한 보안 기초만 배워요</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-sticker">
              <ShieldCheck size={78} strokeWidth={1.55} />
              <span className="sticker-spark"><Sparkles size={19} /></span>
            </div>
            <div className="hero-float-card float-card-top"><Zap size={15} fill="currentColor" /> +20 XP</div>
            <div className="hero-float-card float-card-bottom"><CircleCheck size={16} /> 안전 습관 +1</div>
            <span className="hero-star hero-star-one">✳</span>
            <span className="hero-star hero-star-two">✦</span>
          </div>
        </section>

        <section className="content-grid" aria-label="학습 대시보드">
          <div className="learning-column" id="learn">
            <div className="section-heading">
              <div>
                <span className="section-kicker">YOUR LEARNING PATH</span>
                <h2>학습 지도</h2>
                <p>하나씩 완료하며 나만의 보안 감각을 만들어요.</p>
              </div>
              <div className="course-count"><BookOpenCheck size={15} /> {completedCount}/{lessons.length} 완료</div>
            </div>

            <div className="lesson-path">
              <div className="path-rail" aria-hidden="true"><span style={{ height: `${Math.max(6, percent)}%` }} /></div>
              {lessons.map((lesson, index) => {
                const completed = completedIds.has(lesson.id);
                const current = !completed && lesson.id === nextLesson?.id;
                const Icon = lessonIcons[lesson.id as keyof typeof lessonIcons];
                return (
                  <article className={`quest-card${completed ? " quest-complete" : ""}${current ? " quest-current" : ""}`} key={lesson.id}>
                    <div className={`quest-index${completed ? " index-complete" : current ? " index-current" : ""}`}>
                      {completed ? <Check size={19} strokeWidth={3} /> : `0${index + 1}`}
                    </div>
                    <div className={`quest-icon quest-icon-${lesson.id}`}><Icon size={22} strokeWidth={2} /></div>
                    <div className="quest-details">
                      <div className="quest-meta">
                        <span>{lesson.category}</span>
                        {current && <span className="recommended-label"><Sparkles size={12} /> 추천 퀘스트</span>}
                        {completed && <span className="completed-label"><Check size={12} /> 완료</span>}
                      </div>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.summary}</p>
                      <div className="quest-foot"><span><Clock3 size={13} /> {lesson.duration}</span><span><Zap size={13} fill="currentColor" /> {lesson.xp} XP</span></div>
                    </div>
                    <button
                      className={`quest-action${completed ? " quest-action-done" : ""}`}
                      onClick={() => setLocation(`/lesson/${lesson.id}`)}
                      aria-label={`${lesson.title} ${completed ? "다시 보기" : "시작"}`}
                    >
                      {completed ? <Check size={18} /> : <ChevronRight size={20} />}
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="safety-banner" id="safety">
              <div className="safety-icon"><ShieldCheck size={21} /></div>
              <div><strong>안전이 먼저, 호기심은 그다음</strong><p>모든 퀘스트는 방어와 예방을 위한 학습이에요. 허가 없이 시스템을 건드리지 않아요.</p></div>
              <span className="safety-stamp">PLAY<br />SAFE</span>
            </div>
          </div>

          <aside className="insights-column" aria-label="내 학습 현황">
            <section className="progress-card">
              <div className="card-heading"><div><span className="section-kicker">YOUR PROGRESS</span><h2>나의 성장</h2></div><Trophy size={20} className="trophy-icon" /></div>
              <div className="progress-ring-row">
                <div className="progress-ring" role="progressbar" aria-label="전체 학습 진도" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={`${completedCount}개 퀘스트 완료, ${percent}%`} style={{ background: `conic-gradient(#35c999 ${percent * 3.6}deg, #e9efec 0deg)` }}>
                  <div><strong>{percent}<small>%</small></strong><span>완료</span></div>
                </div>
                <div className="progress-ring-copy"><strong>보안 감각 레벨 {level}</strong><span>{completedCount === lessons.length ? "모든 기초 퀘스트를 마쳤어요!" : `${lessons.length - completedCount}개 퀘스트가 기다려요`}</span><div className="mini-progress" role="progressbar" aria-label="다음 레벨 경험치 진도" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xpWithinLevel} aria-valuetext={`${xpWithinLevel}/100 XP`}><i style={{ width: `${xpWithinLevel}%` }} /></div><small>다음 레벨까지 {100 - xpWithinLevel} XP</small></div>
              </div>
              <div className="stat-divider" />
              <div className="week-header"><strong>이번 주 학습</strong><span>꾸준함이 실력이 돼요</span></div>
              <div className="week-strip" aria-label="이번 주 학습 스트릭">
                {week.map((day) => {
                  const active = activeDates.has(day.key);
                  return <div className={`week-day${active ? " week-day-active" : ""}${day.isToday ? " week-day-today" : ""}`} key={day.key}><span>{day.label}</span><i>{active ? <Check size={12} strokeWidth={3} /> : day.isToday ? <span className="today-dot" /> : null}</i></div>;
                })}
              </div>
              <div className="week-foot"><Flame size={14} /><span>{currentStreak > 0 ? `현재 ${currentStreak}일 연속 학습 중!` : "첫 퀘스트를 끝내고 오늘의 스트릭을 시작해요"}</span></div>
            </section>

            <section className="level-card">
              <div className="level-topline"><span className="level-badge"><Sparkles size={13} /> LEVEL {level}</span><span className="level-xp">{progress.xp} <small>XP</small></span></div>
              <h3>{level >= 3 ? "보안 감각이 자라고 있어요" : level === 2 ? "좋은 보안 습관이 보여요" : "첫 번째 방어선을 세워요"}</h3>
              <p>짧은 학습 하나가 더 안전한 내일을 만들어요.</p>
              <div className="level-progress-track" role="progressbar" aria-label="다음 레벨까지 경험치 진도" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xpWithinLevel} aria-valuetext={`${xpWithinLevel}/100 XP`}><i style={{ width: `${xpWithinLevel}%` }} /></div>
              <div className="level-progress-caption"><span>다음 레벨</span><span>{xpWithinLevel}/100 XP</span></div>
            </section>

            <section className="tip-card">
              <div className="tip-header"><span className="tip-icon"><Sparkles size={15} /></span><span>오늘의 안전 한 줄</span></div>
              <p>“급한 메시지일수록,<br /><strong>링크보다 공식 경로를 확인하기.”</strong></p>
              <div className="tip-footer"><span>작은 확인이 큰 사고를 막아요.</span><MailWarning size={17} /></div>
            </section>

            <div className="side-note"><span className="side-note-mark">H</span><span>배운 만큼 안전해지는<br /><strong>나만의 보안 루틴</strong></span><ArrowRight size={15} /></div>
          </aside>
        </section>
      </main>

      <nav className="mobile-dock" aria-label="모바일 메뉴">
        <a className="dock-active" href="#learn"><BookOpenCheck size={19} /><span>학습</span></a>
        <a href="#safety"><ShieldCheck size={19} /><span>안전 원칙</span></a>
        <div className="dock-xp"><Zap size={15} fill="currentColor" /> {progress.xp} XP</div>
      </nav>
      <footer className="site-footer"><BrandMark compact /><span>보안 지식은 지키기 위해 배워요.</span><a href="#safety">안전 원칙 <ArrowRight size={12} /></a></footer>
    </div>
  );
}
