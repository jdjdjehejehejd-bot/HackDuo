import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  Clock3,
  Flame,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { badges } from "@/data/badges";
import { getCompletedLessonNotes, lessons } from "@/data/lessons";
import { LAB_SIMULATION_IDS } from "@/pages/LabPage";
import { getCurrentStreak, getLevelNumber, useLearningProgress } from "@/hooks/useLearningProgress";

export default function MyPage() {
  const [, setLocation] = useLocation();
  const { progress, setDisplayName, activateDeveloperMode } = useLearningProgress();
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(progress.displayName);
  const [developerCode, setDeveloperCode] = useState("");
  const [developerMessage, setDeveloperMessage] = useState("");
  const completedIds = new Set(progress.completedLessonIds);
  const notes = getCompletedLessonNotes(progress.completedLessonIds);
  const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id));
  const level = getLevelNumber(progress.xp);
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const earnedBadgeCount = badges.filter((badge) => badge.isEarned(progress, lessons.length, LAB_SIMULATION_IDS.length)).length;
  const nextBadge = badges.find((badge) => !badge.isEarned(progress, lessons.length, LAB_SIMULATION_IDS.length));

  return (
    <div className="app-shell my-page-shell">
      <header className="app-topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            <a className="nav-link" href="/">피드</a>
            <button className="nav-link" onClick={() => setLocation("/lab")}>실습실</button>
            <button className="nav-link nav-link-active" onClick={() => setLocation("/my")}>My 노트</button>
          </nav>
          <div className="topbar-right">
            <div className="top-stat streak-chip" aria-label={`연속 학습 ${currentStreak}일`}><Flame size={16} fill="currentColor" /><span>{currentStreak}</span><small>일</small></div>
            <div className="top-stat xp-chip" aria-label={`누적 ${progress.xp} XP`}><Zap size={15} fill="currentColor" /><span>{progress.xp.toLocaleString("ko-KR")}</span><small>XP</small></div>
            <button className="profile-avatar" aria-label={`레벨 ${level} 학습 노트`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>T</button>
          </div>
        </div>
      </header>

      <main className="my-container">
        <button className="my-back-link" onClick={() => setLocation("/")}><ArrowLeft size={15} /> 학습 피드</button>
        <section className="notebook-hero" aria-labelledby="notebook-title">
          <div className="notebook-hero-copy">
            <span className="eyebrow"><span className="live-dot" /> MY FIELD NOTES</span>
            <h1 id="notebook-title">{progress.displayName}님의 단서가<br /><span>내 노트가 돼요.</span></h1>
            <p>스토리를 클리어할 때마다 핵심 개념과 기억할 점을 여기에 모아둘게요.</p>
            {isEditingName ? (
              <form className="profile-name-form" onSubmit={(event) => { event.preventDefault(); setDisplayName(draftName); setIsEditingName(false); }}>
                <label htmlFor="profile-name">표시 이름</label>
                <input id="profile-name" value={draftName} maxLength={24} onChange={(event) => setDraftName(event.target.value)} autoFocus />
                <button type="submit">저장</button>
                <button type="button" onClick={() => { setDraftName(progress.displayName); setIsEditingName(false); }}>취소</button>
              </form>
            ) : (
              <button className="profile-name-edit" onClick={() => setIsEditingName(true)}>학습자 이름 바꾸기</button>
            )}
          </div>
          <div className="notebook-stamp" aria-label={`${notes.length}개 단원 노트`}><NotebookPen size={24} /><strong>{String(notes.length).padStart(2, "0")}</strong><span>NOTES</span><i className="notebook-stamp-spark">✦</i></div>
        </section>

        <section className="notebook-content" aria-labelledby="notes-list-title">
          <div className="notebook-list-heading"><div><span className="section-kicker">YOUR COLLECTION</span><h2 id="notes-list-title">내 보안 노트</h2><p>최근에 클리어한 스토리부터 보여요.</p></div><span className="notebook-count"><BookOpen size={14} /> {notes.length} / {lessons.length}</span></div>

          {notes.length === 0 ? (
            <section className="notebook-empty" aria-labelledby="empty-notes-title">
              <div className="notebook-empty-icon"><NotebookPen size={27} /></div>
              <span className="section-kicker">A NOTEBOOK WAITING FOR YOU</span>
              <h3 id="empty-notes-title">첫 번째 단서를 모아볼까요?</h3>
              <p>강좌를 마치면 핵심 개념과 ‘기억해 두기’가 이 노트에 자동으로 추가돼요.</p>
              {nextLesson ? <button className="button-primary" onClick={() => setLocation(`/lesson/${nextLesson.id}`)}>첫 스토리 시작하기 <ArrowRight size={16} /></button> : <button className="button-primary" onClick={() => setLocation("/")}>학습 피드 열기 <ArrowRight size={16} /></button>}
            </section>
          ) : (
            <div className="notebook-list">
              {notes.map((lesson, index) => (
                <article className="notebook-entry" key={lesson.id} style={{ animationDelay: `${Math.min(index, 7) * 65}ms` }} aria-labelledby={`note-${lesson.id}`}>
                  <header className="notebook-entry-top"><span>CHAPTER 0{lesson.stageNumber} · EP.{String(lessons.findIndex((item) => item.id === lesson.id) + 1).padStart(2, "0")}</span><span className="notebook-saved"><Check size={11} strokeWidth={3} /> 클리어한 노트</span></header>
                  <div className="notebook-entry-heading"><div><span className="notebook-category">{lesson.category}</span><h3 id={`note-${lesson.id}`}>{lesson.shortTitle}</h3><p>{lesson.summary}</p></div><span className={`notebook-lesson-mark mark-${lesson.id}`}><ShieldCheck size={20} /></span></div>
                  <div className="notebook-points">
                    {lesson.sections.map((section, sectionIndex) => (
                      <div className="notebook-point" key={`${lesson.id}-${section.concept}`}>
                        <span className="notebook-point-index">0{sectionIndex + 1}</span>
                        <div><small>{section.concept}</small><strong>{section.takeaway}</strong></div>
                      </div>
                    ))}
                  </div>
                  <footer className="notebook-entry-footer"><span><Sparkles size={12} /> 기억할 단서 3개</span><span><Clock3 size={12} /> {lesson.duration}</span><button onClick={() => setLocation(`/lesson/${lesson.id}`)}>스토리 복습 <ArrowRight size={13} /></button></footer>
                </article>
              ))}
            </div>
          )}

          {notes.length > 0 && nextLesson && <button className="notebook-continue" onClick={() => setLocation(`/lesson/${nextLesson.id}`)}><span><BookOpen size={18} /><span><strong>다음 이야기를 이어갈까요?</strong><small>{nextLesson.shortTitle} · 클리어하면 노트에 이어서 추가돼요.</small></span></span><ArrowRight size={17} /></button>}
          {notes.length === lessons.length && <div className="notebook-finish"><Sparkles size={15} /> 모든 스토리를 클리어했어요. 이 노트가 나만의 보안 필드 가이드예요.</div>}
        </section>

        <section className="badge-collection" aria-labelledby="badge-title">
          <div className="notebook-list-heading"><div><span className="section-kicker">YOUR ACHIEVEMENTS</span><h2 id="badge-title">작은 성취가 배지가 돼요</h2><p>스토리와 실습을 진행할수록 새로운 배지가 열려요.</p></div><span className="notebook-count"><BadgeCheck size={14} /> {earnedBadgeCount} / {badges.length}</span></div>
          <div className="badge-grid">
            {badges.map((badge) => {
              const earned = badge.isEarned(progress, lessons.length, LAB_SIMULATION_IDS.length);
              return <article className={`badge-card${earned ? " badge-card-earned" : ""}`} key={badge.id}><span className="badge-glyph">{badge.icon}</span><div><strong>{badge.title}</strong><p>{badge.description}</p></div>{earned && <Check size={15} className="badge-check" />}</article>;
            })}
          </div>
          {nextBadge && <div className="badge-next"><Sparkles size={14} /><span>다음 목표 · <strong>{nextBadge.title}</strong> — {nextBadge.description}</span></div>}
        </section>
      </main>

      <details className="developer-tools">
        <summary>개발자 도구</summary>
        <form onSubmit={(event) => { event.preventDefault(); const unlocked = activateDeveloperMode(developerCode, lessons.map((lesson) => lesson.id), [...LAB_SIMULATION_IDS]); setDeveloperMessage(unlocked ? "개발자 모드 활성화 · 레벨 20 · 전체 잠금 해제" : "코드가 올바르지 않아요."); if (unlocked) setDeveloperCode(""); }}>
          <label htmlFor="developer-code">잠금 해제 코드</label>
          <div><input id="developer-code" value={developerCode} onChange={(event) => { setDeveloperCode(event.target.value); setDeveloperMessage(""); }} placeholder="개발자 코드 입력" autoComplete="off" /><button type="submit">적용</button></div>
          <small>개발·데모용 기능입니다. 브라우저에 저장되며 실제 보안 인증 수단으로 사용하지 마세요.</small>
          {developerMessage && <strong role="status">{developerMessage}</strong>}
        </form>
      </details>

      <nav className="mobile-dock" aria-label="모바일 메뉴"><a href="/"><BookOpen size={18} /><span>피드</span></a><button onClick={() => setLocation("/lab")}><ShieldCheck size={18} /><span>실습</span></button><button className="dock-active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><NotebookPen size={18} /><span>My</span></button></nav>
      <footer className="site-footer"><BrandMark compact /><span>TEUM · 내 노트, 내 보안 감각.</span><button type="button" onClick={() => setLocation("/")}>학습 피드 <ArrowRight size={12} /></button></footer>
    </div>
  );
}
