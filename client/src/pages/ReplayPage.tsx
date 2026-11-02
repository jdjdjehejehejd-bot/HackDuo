import { ArrowLeft, ArrowRight, Check, CircleHelp, RotateCcw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { useLearningProgress } from "@/hooks/useLearningProgress";

function getLessonQuestions(lesson: typeof lessons[number]) {
  return [...lesson.questions, ...lesson.sections.map((section) => ({ question: `사건 속 “${section.title}”를 확인할 때 가장 먼저 기억할 내용은?`, choices: [section.takeaway, "확인 없이 추측으로 결론 내리기", "허가 범위를 넘어 실제 시스템 시험하기"], answerIndex: 0, explanation: `${section.concept}: ${section.takeaway}` })), { question: "이번 편의 핵심 임무는 무엇일까요?", choices: [lesson.mission, "확인 없이 서둘러 결론 내리기", "허가 범위를 넘어 직접 시험하기"], answerIndex: 0, explanation: `이번 편에서는 ${lesson.mission}` }].slice(0, 7);
}

export default function ReplayPage() {
  const [, setLocation] = useLocation();
  const { progress } = useLearningProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const items = lessons.flatMap((lesson) => { const questions = getLessonQuestions(lesson); return (progress.questionMistakes[lesson.id] ?? []).map((questionIndex) => ({ lesson, question: questions[questionIndex] })).filter((item) => item.question); });
  const item = items[index];

  function next() {
    if (index >= items.length - 1) { setLocation("/my"); return; }
    setIndex((current) => current + 1); setSelected(null); setChecked(false);
  }

  return <div className="app-shell"><header className="app-topbar"><div className="topbar-inner"><button className="back-link" onClick={() => setLocation("/")}><ArrowLeft size={16} /> 홈으로</button><a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a><div className="topbar-right"><span className="unit-page-progress">SMART REPLAY</span></div></div></header><main className="replay-page"><button className="unit-page-back" onClick={() => setLocation("/my")}><ArrowLeft size={15} /> 내 노트</button><section className="replay-heading"><span className="section-kicker">SMART REPLAY · WRONG QUESTIONS ONLY</span><h1>헷갈렸던 문제만 다시 풀어요.</h1><p>레슨 전체를 다시 시작하지 않고, 이전에 틀렸던 문제만 모아 짧게 복습해요.</p></section>{!item ? <section className="replay-empty"><Check size={32} /><h2>다시 확인할 문제가 없어요.</h2><p>레슨에서 틀린 문제가 생기면 이곳에 자동으로 모여요.</p><button className="button-primary" onClick={() => setLocation("/")}>학습하러 가기 <ArrowRight size={16} /></button></section> : <section className="replay-card"><div className="replay-meta"><span><CircleHelp size={14} /> {index + 1} / {items.length}</span><small>{item.lesson.shortTitle}</small></div><div className="replay-question"><ShieldCheck size={18} /><h2>{item.question.question}</h2></div><div className="replay-options">{item.question.choices.map((choice, choiceIndex) => { const correct = checked && choiceIndex === item.question.answerIndex; const wrong = checked && selected === choiceIndex && !correct; return <button key={choice} className={`replay-option${selected === choiceIndex ? " is-selected" : ""}${correct ? " is-correct" : ""}${wrong ? " is-wrong" : ""}`} disabled={checked} onClick={() => setSelected(choiceIndex)}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</button>; })}</div>{checked && <div className="replay-feedback"><strong>{selected === item.question.answerIndex ? "다시 맞혔어요." : "해설을 확인해요."}</strong><p>{item.question.explanation}</p></div>}<div className="replay-actions">{!checked ? <button className="button-primary" disabled={selected === null} onClick={() => setChecked(true)}>정답 확인 <Check size={16} /></button> : <button className="button-primary" onClick={next}>{index >= items.length - 1 ? "복습 마치기" : "다음 오답"} <ArrowRight size={16} /></button>}</div></section>} </main><footer className="site-footer"><BrandMark compact /><span>TEUM · 틀린 문제만 다시 확인하기.</span></footer></div>;
}
