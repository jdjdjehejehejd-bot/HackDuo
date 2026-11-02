import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
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

function toFriendlyTone(text: string) {
  return text.replace(/발견한다\.$/, "발견해요.").replace(/추적한다\.$/, "추적해요.").replace(/드러난다\.$/, "드러나요.").replace(/발견된다\.$/, "발견돼요.").replace(/찾는다\.$/, "찾아요.").replace(/요구한다\.$/, "요구해요.").replace(/바꾼다\.$/, "바꿔요.").replace(/배운다\.$/, "배워요.").replace(/선택해야 한다\.$/, "선택해야 해요.").replace(/재구성해야 한다\.$/, "재구성해야 해요.").replace(/된다\.$/, "돼요.").replace(/있다\.$/, "있어요.").replace(/있었다\.$/, "있었어요.").replace(/다르다\.$/, "달라요.").replace(/모인다\.$/, "모여요.").replace(/흔들린다\.$/, "흔들려요.").replace(/한다\.$/, "해요.");
}

export default function UnitPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/unit/:unitId");
  const unit = storyUnits.find((item) => item.id === params?.unitId) ?? storyUnits[0];
  const unitLessons = getUnitLessons(unit.id);
  const { progress } = useLearningProgress();
  const completedIds = new Set(progress.completedLessonIds);
  const completedCount = unitLessons.filter((lesson) => completedIds.has(lesson.id)).length;
  const [showUnitDescription, setShowUnitDescription] = useState(false);

  const unitDescription = `${toFriendlyTone(unit.arc)} 민지와 틈이는 이 사건을 따라가며 ${unit.promise.replace(/해요\.$/, "는 법을 배워요.")} 작은 이상을 그냥 지나치지 않고, 다음 단서가 가리키는 위험을 안전하게 확인해 봐요.`;
  const unitDescriptionPreview = `${unitDescription.split(" ").slice(0, 16).join(" ")}…`;
  return <div className="app-shell"><header className="app-topbar"><div className="topbar-inner"><button className="back-link" onClick={() => setLocation("/")}><ArrowLeft size={16} /> 홈으로</button><a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a><div className="topbar-right"><span className="unit-page-progress">{completedCount}/{unitLessons.length} 레슨</span></div></div></header><main className="unit-page"><button className="unit-page-back" onClick={() => setLocation("/")}><ArrowLeft size={15} /> 단원 목록</button><section className="unit-hero"><div><span className="section-kicker">UNIT {String(unit.number).padStart(2, "0")} · STORY ARC</span><h1>{unit.title}</h1><p>{showUnitDescription ? unitDescription : unitDescriptionPreview}</p><button className="description-toggle" type="button" onClick={() => setShowUnitDescription((current) => !current)}>{showUnitDescription ? "설명 접기" : "더보기"}</button></div><div className="unit-hero-mark"><ShieldCheck size={42} strokeWidth={1.5} /><span>{completedCount}/{unitLessons.length}</span></div></section><section className="unit-lesson-panel" aria-labelledby="unit-lessons-title"><div className="unit-lesson-heading"><div><span className="section-kicker">FIVE CLUES</span><h2 id="unit-lessons-title">이 단원의 레슨</h2></div><span>{completedCount === unitLessons.length ? "단원 완료" : `${unitLessons.length - completedCount}개 남음`}</span></div><div className="unit-lesson-list">{unitLessons.map((lesson, index) => { const completed = completedIds.has(lesson.id); const lessonIndex = lessons.findIndex((item) => item.id === lesson.id); const unlocked = completed || lessonIndex === 0 || completedIds.has(lessons[lessonIndex - 1]?.id); return <article className={`unit-lesson-row${completed ? " is-complete" : ""}${!unlocked ? " is-locked" : ""}`} key={lesson.id}><span className="unit-lesson-number">{completed ? <Check size={15} /> : !unlocked ? <LockKeyhole size={14} /> : String(index + 1).padStart(2, "0")}</span><div className="unit-lesson-copy"><small>EP. {String(index + 1).padStart(2, "0")} · {lesson.category}</small><h3>{lesson.shortTitle}</h3><p>{lesson.hook} {lesson.summary} 이제 이 단서에서 무엇이 정상이고 무엇을 지켜야 하는지 직접 찾아봐요.</p><div><span><Clock3 size={12} /> {lesson.duration}</span><span><Zap size={12} /> {lesson.xp + 5} XP</span></div></div><button className="unit-lesson-open" disabled={!unlocked} onClick={() => setLocation(`/lesson/${lesson.id}`)}>{completed ? "다시 보기" : unlocked ? "시작하기" : "잠김"}<ArrowRight size={15} /></button></article>; })}</div></section></main><footer className="site-footer"><BrandMark compact /><span>TEUM · 안전하게 알고, 작게 실천하기.</span></footer></div>;
}
