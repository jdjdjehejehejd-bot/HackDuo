import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleHelp, ListChecks, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { useLearningProgress } from "@/hooks/useLearningProgress";

function getLessonQuestions(lesson: typeof lessons[number]) {
  return [...lesson.questions, ...lesson.sections.map((section) => ({ question: `사건 속 “${section.title}”를 확인할 때 가장 먼저 기억할 내용은?`, choices: [section.takeaway, "확인 없이 추측으로 결론 내리기", "허가 범위를 넘어 실제 시스템 시험하기"], answerIndex: 0, explanation: `${section.concept}: ${section.takeaway}` })), { question: "이번 편의 핵심 임무는 무엇일까?", choices: [lesson.mission, "확인 없이 서둘러 결론 내리기", "허가 범위를 넘어 직접 시험하기"], answerIndex: 0, explanation: `이번 편에서 기억할 임무는 ${lesson.mission}` }].slice(0, 7);
}

type ReplayItem = {
  lesson: typeof lessons[number];
  question: ReturnType<typeof getLessonQuestions>[number];
  id: string;
};

export default function ReplayPage() {
  const [, setLocation] = useLocation();
  const { progress } = useLearningProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => new Set());

  const items = useMemo<ReplayItem[]>(() => lessons.flatMap((lesson) => {
    const questions = getLessonQuestions(lesson);
    return (progress.questionMistakes[lesson.id] ?? [])
      .map((questionIndex) => {
        const question = questions[questionIndex];
        return question ? { lesson, question, id: `${lesson.id}:${questionIndex}` } : null;
      })
      .filter((item): item is ReplayItem => item !== null);
  }), [progress.questionMistakes]);

  const activeItem = items.find((item) => item.id === activeId);
  const outstandingCount = items.filter((item) => !solvedIds.has(item.id)).length;

  function openQuestion(item: ReplayItem) {
    setActiveId(item.id);
    setSelected(null);
    setChecked(false);
  }

  function returnToList() {
    setActiveId(null);
    setSelected(null);
    setChecked(false);
  }

  function checkAnswer() {
    if (selected === null || !activeItem) return;
    setChecked(true);
    if (selected === activeItem.question.answerIndex) {
      setSolvedIds((current) => new Set(current).add(activeItem.id));
    }
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="topbar-inner">
          <button className="back-link" onClick={() => setLocation("/")}><ArrowLeft size={16} /> 홈으로</button>
          <a className="brand-link" href="/" aria-label="TEUM 홈"><BrandMark /></a>
          <div className="topbar-right"><span className="unit-page-progress">SMART REPLAY</span></div>
        </div>
      </header>

      <main className="replay-page">
        <button className="unit-page-back" onClick={() => setLocation("/my")}><ArrowLeft size={15} /> 내 노트로</button>
        <section className="replay-heading">
          <span className="section-kicker">SMART REPLAY · WRONG QUESTIONS</span>
          <h1>다시 살펴볼 문제</h1>
          <p>놓쳤던 문제를 한곳에 모았어. 궁금한 문제를 골라 다시 확인해 봐.</p>
        </section>

        {items.length === 0 ? (
          <section className="replay-empty">
            <CheckCircle2 size={32} />
            <h2>지금은 다시 볼 문제가 없어.</h2>
            <p>레슨에서 놓친 문제가 생기면 여기에 하나씩 모아둘게.</p>
            <button className="button-primary" onClick={() => setLocation("/")}>스토리 둘러보기 <ArrowRight size={16} /></button>
          </section>
        ) : activeItem ? (
          <section className="replay-card" aria-labelledby="replay-question-title">
            <button className="replay-list-back" onClick={returnToList}><ArrowLeft size={14} /> 오답 목록</button>
            <div className="replay-meta">
              <span><CircleHelp size={14} /> {items.findIndex((item) => item.id === activeItem.id) + 1} / {items.length}</span>
              <small>{activeItem.lesson.shortTitle}</small>
            </div>
            <div className="replay-question"><ShieldCheck size={18} /><h2 id="replay-question-title">{activeItem.question.question}</h2></div>
            <div className="replay-options" role="group" aria-label="답 선택">
              {activeItem.question.choices.map((choice, choiceIndex) => {
                const correct = checked && choiceIndex === activeItem.question.answerIndex;
                const wrong = checked && selected === choiceIndex && !correct;
                return (
                  <button key={choice} className={`replay-option${selected === choiceIndex ? " is-selected" : ""}${correct ? " is-correct" : ""}${wrong ? " is-wrong" : ""}`} disabled={checked} onClick={() => setSelected(choiceIndex)}>
                    <span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className="replay-feedback">
                <strong>{selected === activeItem.question.answerIndex ? "이번엔 제대로 짚었어." : "괜찮아. 단서를 다시 살펴보자."}</strong>
                <p>{activeItem.question.explanation}</p>
              </div>
            )}
            <div className="replay-actions">
              {!checked
                ? <button className="button-primary" disabled={selected === null} onClick={checkAnswer}>답 확인하기 <Check size={16} /></button>
                : <button className="button-primary" onClick={returnToList}>오답 목록으로 <ListChecks size={16} /></button>}
            </div>
          </section>
        ) : (
          <section className="replay-list-panel" aria-labelledby="replay-list-title">
            <div className="replay-list-heading">
              <div><span className="section-kicker">MISSED CLUES</span><h2 id="replay-list-title">놓친 단서 목록</h2></div>
              <span className="replay-list-count">{outstandingCount}개 남음 <i>/</i> {items.length}개</span>
            </div>
            <div className="replay-question-list">
              {items.map((item, index) => {
                const solved = solvedIds.has(item.id);
                return (
                  <button className={`replay-question-row${solved ? " is-solved" : ""}`} key={item.id} onClick={() => openQuestion(item)}>
                    <span className="replay-question-index">{solved ? <Check size={15} /> : String(index + 1).padStart(2, "0")}</span>
                    <span className="replay-question-copy">
                      <small>{item.lesson.shortTitle} · 질문 {Number(item.id.split(":").at(-1)) + 1}</small>
                      <strong>{item.question.question}</strong>
                      <em>{solved ? "다시 맞혔어" : "눌러서 다시 풀어봐"}</em>
                    </span>
                    <ArrowRight size={16} />
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer"><BrandMark compact /><span>TEUM · 놓친 단서를 다시 살펴봐.</span></footer>
    </div>
  );
}
