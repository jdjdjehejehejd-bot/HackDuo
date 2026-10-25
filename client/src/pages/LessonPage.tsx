import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { getCurrentStreak, useLearningProgress } from "@/hooks/useLearningProgress";
import NotFound from "@/pages/NotFound";

export default function LessonPage() {
  const [match, params] = useRoute<{ lessonId: string }>("/lesson/:lessonId");
  const [, setLocation] = useLocation();
  const lesson = match ? lessons.find((item) => item.id === params.lessonId) : undefined;
  const { progress, completeLesson } = useLearningProgress();
  const [phase, setPhase] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  if (!lesson) return <NotFound />;

  const completedBefore = progress.completedLessonIds.includes(lesson.id);
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const quizIsCorrect = selectedAnswer === lesson.quiz.answerIndex;
  const level = Math.floor(progress.xp / 100) + 1;

  function finishLesson() {
    if (!lesson) return;
    const reward = completedBefore ? 0 : lesson.xp;
    completeLesson(lesson.id, lesson.xp);
    setEarnedXp(reward);
    setPhase(3);
  }

  function advance() {
    if (phase < 2) {
      setPhase((current) => current + 1);
      return;
    }
    if (!showFeedback && selectedAnswer !== null) {
      setShowFeedback(true);
      return;
    }
    if (showFeedback && quizIsCorrect) {
      finishLesson();
      return;
    }
    setSelectedAnswer(null);
    setShowFeedback(false);
  }

  return (
    <div className="lesson-shell">
      <header className="lesson-topbar">
        <button className="back-button" onClick={() => setLocation("/")} aria-label="학습 지도로 돌아가기"><ArrowLeft size={19} /><span>학습 지도</span></button>
        <BrandMark />
        <div className="lesson-top-stats"><span><Flame size={15} fill="currentColor" /> {currentStreak}일</span><span><Zap size={15} fill="currentColor" /> {progress.xp} XP</span></div>
      </header>

      {phase < 3 ? (
        <main className="lesson-main">
          <div className="lesson-intro">
            <span className="lesson-category"><ShieldCheck size={14} /> {lesson.category}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.summary}</p>
          </div>
          <div className="lesson-meter">
            <button className="meter-back" onClick={() => phase === 0 ? setLocation("/") : setPhase((current) => current - 1)} aria-label="이전 단계"><ArrowLeft size={17} /></button>
            <div className="meter-track" role="progressbar" aria-label="퀘스트 레슨 진행" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(phase + 1, 3)} aria-valuetext={`3단계 중 ${Math.min(phase + 1, 3)}단계`}>
              {[0, 1, 2].map((step) => <i className={phase >= step ? "meter-filled" : ""} key={step} />)}
            </div>
            <span className="meter-label">{Math.min(phase + 1, 3)} <small>/ 3</small></span>
          </div>

          {phase < 2 ? (
            <section className="concept-card" aria-live="polite">
              <div className="concept-card-top"><span className="concept-number">0{phase + 1}</span><span className="concept-type">오늘의 보안 습관</span><span className="concept-illustration"><LockKeyhole size={20} /></span></div>
              <h2>{lesson.sections[phase].title}</h2>
              <p>{lesson.sections[phase].body}</p>
              <div className="takeaway"><span><Sparkles size={15} /></span><div><small>기억해 두기</small><strong>{lesson.sections[phase].takeaway}</strong></div></div>
            </section>
          ) : (
            <section className="quiz-card" aria-live="polite">
              <div className="quiz-overline"><span className="quiz-icon"><CircleHelp size={18} /></span><span>잠깐, 확인해 볼까요?</span><span className="quiz-reward"><Zap size={13} fill="currentColor" /> +{lesson.xp} XP</span></div>
              <h2>{lesson.quiz.question}</h2>
              <div className="answer-list" role="group" aria-label="정답 선택지">
                {lesson.quiz.choices.map((choice, index) => {
                  const isSelected = selectedAnswer === index;
                  const isRight = showFeedback && index === lesson.quiz.answerIndex;
                  const isWrong = showFeedback && isSelected && !quizIsCorrect;
                  return (
                    <button
                      className={`answer-option${isSelected ? " answer-selected" : ""}${isRight ? " answer-correct" : ""}${isWrong ? " answer-wrong" : ""}`}
                      key={choice}
                      onClick={() => { if (!showFeedback) setSelectedAnswer(index); }}
                      disabled={showFeedback}
                      aria-pressed={isSelected}
                    >
                      <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="answer-text">{choice}</span>
                      <span className="answer-check">{isRight ? <Check size={17} /> : isSelected ? <span className="answer-radio-dot" /> : null}</span>
                    </button>
                  );
                })}
              </div>
              {showFeedback && (
                <div className={`answer-feedback${quizIsCorrect ? " feedback-correct" : " feedback-try-again"}`}>
                  <span className="feedback-symbol">{quizIsCorrect ? <CheckCircle2 size={20} /> : <RotateCcw size={19} />}</span>
                  <div><strong>{quizIsCorrect ? "정확해요!" : "한 번 더 생각해 봐요"}</strong><p>{lesson.quiz.explanation}</p></div>
                </div>
              )}
            </section>
          )}

          <div className="lesson-footer">
            <div className="lesson-duration"><Clock3 size={15} /><span>{lesson.duration} · 부담 없이 한 걸음</span></div>
            <button className="button-primary lesson-next" onClick={advance} disabled={phase === 2 && selectedAnswer === null}>
              {phase < 2 ? phase === 1 ? "퀴즈 풀기" : "다음 내용" : !showFeedback ? "정답 확인" : quizIsCorrect ? "퀘스트 완료" : "다시 풀기"}
              {phase === 2 && showFeedback && quizIsCorrect ? <Check size={17} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </main>
      ) : (
        <main className="completion-main">
          <div className="completion-glow" aria-hidden="true"><span /><span /><span /></div>
          <div className="completion-medallion"><CheckCircle2 size={45} strokeWidth={1.7} /></div>
          <span className="completion-eyebrow"><Sparkles size={14} /> 퀘스트 완료</span>
          <h1>{completedBefore ? "복습까지 완료!" : "보안 감각이 한 뼘 자랐어요!"}</h1>
          <p className="completion-copy">{lesson.shortTitle} 퀘스트를 마쳤어요.<br />배운 내용을 안전한 습관으로 이어가 봐요.</p>
          <div className="earned-card">
            <div className="earned-icon"><Zap size={22} fill="currentColor" /></div>
            <div><span>{earnedXp > 0 ? "새로 모은 경험치" : "복습 완료"}</span><strong>{earnedXp > 0 ? `+${earnedXp} XP` : "좋은 습관을 다시 확인했어요"}</strong></div>
            {earnedXp > 0 && <span className="earned-spark"><Sparkles size={17} /></span>}
          </div>
          <div className="completion-stats"><span><Flame size={16} fill="currentColor" /> 연속 학습 <strong>{progress.streak || 1}일</strong></span><span><TrophyIcon /> 보안 감각 <strong>레벨 {level}</strong></span></div>
          <button className="button-primary completion-home" onClick={() => setLocation("/")}>학습 지도로 돌아가기 <ArrowRight size={17} /></button>
          <div className="completion-footnote"><ShieldCheck size={14} /> 이 기기에 학습 기록이 저장돼요.</div>
        </main>
      )}
    </div>
  );
}

function TrophyIcon() {
  return <Sparkles size={16} />;
}
