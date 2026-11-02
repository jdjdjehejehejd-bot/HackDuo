import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { storyUnits } from "@/data/storyUnits";
import { useLearningProgress } from "@/hooks/useLearningProgress";

function getUnitLessons(unitId: string) {
  const storyLessons = lessons.filter((lesson) => lesson.storyUnitId === unitId);
  if (storyLessons.length > 0) return storyLessons;
  const unitNumber = Number(unitId.replace("unit-", ""));
  return lessons.slice((unitNumber - 1) * 5, unitNumber * 5);
}

export default function UnitPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/unit/:unitId");
  const unit = storyUnits.find((item) => item.id === params?.unitId) ?? storyUnits[0];
  const unitLessons = getUnitLessons(unit.id);
  const { progress } = useLearningProgress();
  const completedIds = new Set(progress.completedLessonIds);
  const completedCount = unitLessons.filter((lesson) => completedIds.has(lesson.id)).length;

  return <div className="app-shell"><header className="app-topbar"><div className="topbar-inner"><button className="back-link" onClick={() => setLocation("/")}><ArrowLeft size={16} /> 홈으로</button><a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a><div className="topbar-right"><span className="unit-page-progress">{completedCount}/{unitLessons.length} 레슨</span></div></div></header><main className="unit-page"><button className="unit-page-back" onClick={() => setLocation("/")}><ArrowLeft size={15} /> 단원 목록</button><section className="unit-hero"><div><span className="section-kicker">UNIT {String(unit.number).padStart(2, "0")} · STORY ARC</span><h1>{unit.title}</h1><p>{unit.arc}</p><strong>{unit.promise}</strong></div><div className="unit-hero-mark"><ShieldCheck size={42} strokeWidth={1.5} /><span>{completedCount}/{unitLessons.length}</span></div></section><section className="unit-lesson-panel" aria-labelledby="unit-lessons-title"><div className="unit-lesson-heading"><div><span className="section-kicker">FIVE CLUES</span><h2 id="unit-lessons-title">이 단원의 레슨</h2></div><span>{completedCount === unitLessons.length ? "단원 완료" : `${unitLessons.length - completedCount}개 남음`}</span></div><div className="unit-lesson-list">{unitLessons.map((lesson, index) => { const completed = completedIds.has(lesson.id); const lessonIndex = lessons.findIndex((item) => item.id === lesson.id); const unlocked = completed || lessonIndex === 0 || completedIds.has(lessons[lessonIndex - 1]?.id); return <article className={`unit-lesson-row${completed ? " is-complete" : ""}${!unlocked ? " is-locked" : ""}`} key={lesson.id}><span className="unit-lesson-number">{completed ? <Check size={15} /> : !unlocked ? <LockKeyhole size={14} /> : String(index + 1).padStart(2, "0")}</span><div className="unit-lesson-copy"><small>EP. {String(index + 1).padStart(2, "0")} · {lesson.category}</small><h3>{lesson.shortTitle}</h3><p>{lesson.summary}</p><div><span><Clock3 size={12} /> {lesson.duration}</span><span><Zap size={12} /> {lesson.xp + 5} XP</span></div></div><button className="unit-lesson-open" disabled={!unlocked} onClick={() => setLocation(`/lesson/${lesson.id}`)}>{completed ? "다시 보기" : unlocked ? "시작하기" : "잠김"}<ArrowRight size={15} /></button></article>; })}</div></section></main><footer className="site-footer"><BrandMark compact /><span>TEUM · 안전하게 알고, 작게 실천하기.</span></footer></div>;
}
