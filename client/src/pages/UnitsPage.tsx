import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { storyUnits } from "@/data/storyUnits";
import { getCurrentStreak, getLevelNumber, useLearningProgress } from "@/hooks/useLearningProgress";

const filters = [
  { id: "all", label: "전체" },
  { id: "active", label: "진행 중" },
  { id: "done", label: "완료" },
] as const;

type FilterId = (typeof filters)[number]["id"];

function getUnitLessons(unitId: string) {
  const storyLessons = lessons.filter((lesson) => lesson.storyUnitId === unitId);
  if (storyLessons.length > 0) return storyLessons;
  const unitNumber = Number(unitId.replace("unit-", ""));
  return lessons.slice((unitNumber - 1) * 5, unitNumber * 5);
}

export default function UnitsPage() {
  const [, setLocation] = useLocation();
  const { progress } = useLearningProgress();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const completedIds = new Set(progress.completedLessonIds);
  const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id));
  const currentUnitId = nextLesson?.storyUnitId ?? storyUnits[0].id;
  const currentUnit = storyUnits.find((unit) => unit.id === currentUnitId) ?? storyUnits[0];
  const completedCount = lessons.filter((lesson) => completedIds.has(lesson.id)).length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  const totalQuestions = lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const level = getLevelNumber(progress.xp);

  const unitCards = useMemo(
    () =>
      storyUnits.map((unit) => {
        const unitLessons = getUnitLessons(unit.id);
        const done = unitLessons.filter((lesson) => completedIds.has(lesson.id)).length;
        const state = done === unitLessons.length ? "done" : done > 0 ? "active" : "ready";
        return { unit, unitLessons, done, state };
      }),
    [progress.completedLessonIds],
  );

  const doneUnitCount = unitCards.filter((card) => card.state === "done").length;
  const activeUnitCount = unitCards.filter((card) => card.state === "active").length;

  const visibleCards = unitCards.filter((card) => {
    if (filter === "active" && card.state !== "active") return false;
    if (filter === "done" && card.state !== "done") return false;
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    const haystack = [card.unit.title, card.unit.promise, card.unit.arc, ...card.unit.episodes].join(" ").toLowerCase();
    return haystack.includes(keyword);
  });

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            <a className="nav-link" href="/">학습 피드</a>
            <a className="nav-link nav-link-active" href="/units">단원 전체</a>
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

      <main className="units-page">
        <button className="unit-page-back" onClick={() => setLocation("/")}><ArrowLeft size={15} /> 학습 피드로</button>

        <section className="units-hero" aria-labelledby="units-title">
          <div className="units-hero-copy">
            <span className="section-kicker">THE STORY UNIVERSE · {storyUnits.length} UNITS</span>
            <h1 id="units-title">단원별 보안 스토리</h1>
            <p>스무 개의 사건을 한자리에 모았어요. 지금 이어가는 단원부터 골라서 한 편씩 따라가 보세요.</p>
            <div className="units-hero-stats">
              <span><BadgeCheck size={14} /> {completedCount}/{lessons.length} 레슨</span>
              <span><BookOpen size={14} /> {doneUnitCount}개 단원 완료</span>
              <span><Sparkles size={14} /> {activeUnitCount}개 단원 진행 중</span>
            </div>
            <button className="button-primary units-hero-cta" onClick={() => setLocation(`/unit/${currentUnit.id}`)}>
              이어서 볼 단원 · {currentUnit.title} <ArrowRight size={16} />
            </button>
          </div>
          <div className="units-hero-progress" aria-label={`전체 진도 ${percent}%`}>
            <div className="units-ring" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} style={{ background: `conic-gradient(#c651ef ${percent * 3.6}deg, #f0eaf4 0deg)` }}>
              <div><strong>{percent}<small>%</small></strong><span>전체 진도</span></div>
            </div>
            <div className="units-hero-progress-copy">
              <small>LEVEL {String(level).padStart(2, "0")} · {progress.xp} XP</small>
              <strong>{storyUnits.length}개 단원 · {totalQuestions}개 단서 질문</strong>
              <span>한 단원은 5개의 작은 사건으로 이어져요.</span>
            </div>
          </div>
        </section>

        <div className="units-toolbar">
          <label className="units-search">
            <Search size={15} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="단원 제목이나 키워드로 찾기 (예: 피싱, 권한)"
              aria-label="단원 검색"
            />
          </label>
          <div className="units-filter" role="group" aria-label="단원 필터">
            {filters.map((item) => (
              <button key={item.id} className={filter === item.id ? "is-selected" : ""} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{item.label}</button>
            ))}
          </div>
        </div>

        {visibleCards.length === 0 ? (
          <div className="units-empty" role="status">
            <Search size={22} />
            <strong>조건에 맞는 단원이 없어요.</strong>
            <p>다른 키워드로 찾아보거나 필터를 ‘전체’로 바꿔 보세요.</p>
            <button className="button-light" onClick={() => { setQuery(""); setFilter("all"); }}>모든 단원 보기</button>
          </div>
        ) : (
          <section className="units-grid" aria-label="전체 단원 목록">
            {visibleCards.map(({ unit, unitLessons, done, state }) => {
              const total = unitLessons.length || 5;
              const unitPercent = Math.round((done / total) * 100);
              const isCurrent = unit.id === currentUnit.id;
              const statusLabel = state === "done" ? "완료" : state === "active" ? "진행 중" : isCurrent ? "다음 단원" : "시작 전";
              return (
                <button className={`units-card is-${state}${isCurrent ? " is-current" : ""}`} key={unit.id} onClick={() => setLocation(`/unit/${unit.id}`)} aria-label={`UNIT ${unit.number} ${unit.title} ${statusLabel} ${done}/${total} 레슨`}>
                  <span className="units-card-top">
                    <span className="units-card-number">{state === "done" ? <Check size={15} /> : String(unit.number).padStart(2, "0")}</span>
                    <span className="units-card-heading">
                      <small>UNIT {String(unit.number).padStart(2, "0")} · EP.01–{String(total).padStart(2, "0")}</small>
                    <strong>{unit.title}</strong>
                    </span>
                    <span className={`units-card-status is-${state}${isCurrent ? " is-current" : ""}`}>{statusLabel}</span>
                  </span>
                  <span className="units-card-promise">{unit.promise}</span>
                  <span className="units-card-progress">
                    <span className="units-card-track"><i style={{ width: `${unitPercent}%` }} /></span>
                    <small>{done}/{total} 레슨</small>
                  </span>
                  <span className="units-card-foot">
                    <span className="units-card-dots" aria-hidden="true">
                      {unitLessons.map((lesson) => <i key={lesson.id} className={completedIds.has(lesson.id) ? "is-done" : ""} />)}
                    </span>
                    <span className="units-card-meta"><Clock3 size={11} /> 5편 · {unit.episodes[0]}</span>
                    <ChevronRight size={15} />
                  </span>
                </button>
              );
            })}
          </section>
        )}

        <section className="units-next">
          <div>
            <span className="section-kicker">NEXT STOP</span>
            <strong>{currentUnit.title}</strong>
            <p>{nextLesson ? nextLesson.shortTitle : "모든 스토리를 마쳤어요. 복습으로 감각을 유지해요."}</p>
          </div>
          <button className="button-light" onClick={() => setLocation(nextLesson ? `/lesson/${nextLesson.id}` : `/unit/${currentUnit.id}`)}>{nextLesson ? "이어서 학습" : "단원 살펴보기"}<ArrowRight size={15} /></button>
        </section>
      </main>

      <nav className="mobile-dock" aria-label="모바일 메뉴"><a href="/"><BookOpen size={18} /><span>학습</span></a><a className="dock-active" href="/units"><ShieldCheck size={18} /><span>단원</span></a><button onClick={() => setLocation("/my")}><UserRound size={18} /><span>내 노트</span></button></nav>
      <footer className="site-footer"><BrandMark compact /><span>TEUM · 안전하게 알고, 작게 실천하기.</span></footer>
    </div>
  );
}
