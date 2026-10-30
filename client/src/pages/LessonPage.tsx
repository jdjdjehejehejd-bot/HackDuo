import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  Heart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import BrandMark from "@/components/BrandMark";
import { lessons } from "@/data/lessons";
import { getCurrentStreak, useLearningProgress } from "@/hooks/useLearningProgress";
import NotFound from "@/pages/NotFound";

const STARTING_HEARTS = 5;

export default function LessonPage() {
  const [match, params] = useRoute<{ lessonId: string }>("/lesson/:lessonId");
  const [, setLocation] = useLocation();
  const lessonIndex = match ? lessons.findIndex((item) => item.id === params.lessonId) : -1;
  const lesson = lessonIndex >= 0 ? lessons[lessonIndex] : undefined;
  const { progress, completeLesson } = useLearningProgress();
  const [phase, setPhase] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [firstTryResults, setFirstTryResults] = useState<Record<number, boolean>>({});
  const [earnedXp, setEarnedXp] = useState(0);

  if (!lesson) return <NotFound />;

  const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const completedBefore = progress.completedLessonIds.includes(lesson.id);
  const isLocked = !completedBefore && previousLesson ? !progress.completedLessonIds.includes(previousLesson.id) : false;
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const level = Math.floor(progress.xp / 100) + 1;
  const sectionCount = lesson.sections.length;
  const questionCount = lesson.questions.length;
  const totalSteps = sectionCount + questionCount;
  const isComplete = phase >= totalSteps;
  const isConcept = phase < sectionCount;
  const quizIndex = phase - sectionCount;
  const currentQuestion = !isConcept && !isComplete ? lesson.questions[quizIndex] : undefined;
  const quizIsCorrect = currentQuestion ? selectedAnswer === currentQuestion.answerIndex : false;
  const correctFirstTryCount = Object.values(firstTryResults).filter(Boolean).length;
  const hearts = Math.max(0, STARTING_HEARTS - Object.values(firstTryResults).filter((correct) => !correct).length);
  const nextLesson = lessons.find((item) => !progress.completedLessonIds.includes(item.id));

  function goBack() {
    if (phase === 0) {
      setLocation("/");
      return;
    }
    setPhase((current) => current - 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }

  function finishLesson() {
    if (!lesson) return;
    const perfectBonus = correctFirstTryCount === questionCount ? 5 : 0;
    const reward = completedBefore
      ? 0
      : Math.round((lesson.xp * correctFirstTryCount) / questionCount) + perfectBonus;
    completeLesson(lesson.id, reward);
    setEarnedXp(reward);
    setPhase(totalSteps);
  }

  function advance() {
    if (isConcept) {
      setPhase((current) => current + 1);
      return;
    }
    if (!showFeedback && selectedAnswer !== null && currentQuestion) {
      setShowFeedback(true);
      setFirstTryResults((current) => current[quizIndex] === undefined ? { ...current, [quizIndex]: quizIsCorrect } : current);
      return;
    }
    if (showFeedback) {
      if (quizIndex === questionCount - 1) {
        finishLesson();
        return;
      }
      setPhase((current) => current + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }

  if (isLocked) {
    return (
      <div className="lesson-shell">
        <header className="lesson-topbar"><button className="back-button" onClick={() => setLocation("/")}><ArrowLeft size={19} /><span>학습 지도</span></button><BrandMark /><span /></header>
        <main className="locked-main"><div className="locked-medallion"><LockKeyhole size={33} /></div><span className="completion-eyebrow"><ShieldCheck size={14} /> 다음 퀘스트</span><h1>한 단계씩 차근차근!</h1><p><strong>{previousLesson?.shortTitle}</strong> 퀘스트를 먼저 완료하면 이 길이 열려요.</p><button className="button-primary completion-home" onClick={() => setLocation(`/lesson/${previousLesson?.id}`)}>이전 퀘스트 시작 <ArrowRight size={17} /></button><button className="plain-home-button" onClick={() => setLocation("/")}>학습 지도로 돌아가기</button></main>
      </div>
    );
  }

  return (
    <div className="lesson-shell">
      <header className="lesson-topbar">
        <button className="back-button" onClick={goBack} aria-label={phase === 0 ? "학습 지도로 돌아가기" : "이전 단계"}><ArrowLeft size={19} /><span>{phase === 0 ? "학습 지도" : "이전"}</span></button>
        <BrandMark />
        <div className="lesson-top-stats"><span><Flame size={15} fill="currentColor" /> {currentStreak}일</span><span><Zap size={15} fill="currentColor" /> {progress.xp} XP</span></div>
      </header>

      {!isComplete ? (
        <main className="lesson-main">
          <div className="lesson-intro"><span className="lesson-category"><ShieldCheck size={14} /> {lesson.category} · UNIT 01</span><h1>{lesson.title}</h1><p>{lesson.summary}</p></div>
          <div className="lesson-meter">
            <button className="meter-back" onClick={goBack} aria-label="이전 단계"><ArrowLeft size={17} /></button>
            <div className="meter-track" role="progressbar" aria-label="퀘스트 레슨 진행" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={phase + 1} aria-valuetext={`${totalSteps}단계 중 ${phase + 1}단계`}>{Array.from({ length: totalSteps }, (_, index) => <i className={phase >= index ? "meter-filled" : ""} key={index} />)}</div>
            <span className="meter-label">{phase + 1}<small> / {totalSteps}</small></span>
            <span className={`heart-counter${hearts <= 2 ? " hearts-low" : ""}`} aria-label={`남은 하트 ${hearts}개`}>{Array.from({ length: STARTING_HEARTS }, (_, index) => <Heart key={index} size={15} fill={index < hearts ? "currentColor" : "none"} />)}</span>
          </div>

          {isConcept ? (
            <section className="concept-card" aria-live="polite">
              <div className="concept-card-top"><span className="concept-number">0{phase + 1}</span><span className="concept-type">오늘의 보안 습관</span><span className="concept-illustration"><LockKeyhole size={20} /></span></div>
              <h2>{lesson.sections[phase].title}</h2><p>{lesson.sections[phase].body}</p>
              <div className="takeaway"><span><Sparkles size={15} /></span><div><small>기억해 두기</small><strong>{lesson.sections[phase].takeaway}</strong></div></div>
              <div className="lesson-learning-note"><BadgeCheck size={15} /><span>천천히 읽고, 내 일상에서 만날 장면을 떠올려 봐요.</span></div>
            </section>
          ) : currentQuestion ? (
            <section className="quiz-card" aria-live="polite">
              <div className="quiz-overline"><span className="quiz-icon"><CircleHelp size={18} /></span><span>문제 {quizIndex + 1} / {questionCount}</span><span className="quiz-reward"><Zap size={13} fill="currentColor" /> 정답 +{Math.round(lesson.xp / questionCount)} XP</span></div>
              <h2>{currentQuestion.question}</h2>
              <div className="answer-list" role="group" aria-label="정답 선택지">
                {currentQuestion.choices.map((choice, index) => {
                  const isSelected = selectedAnswer === index;
                  const isRight = showFeedback && index === currentQuestion.answerIndex;
                  const isWrong = showFeedback && isSelected && !quizIsCorrect;
                  return <button className={`answer-option${isSelected ? " answer-selected" : ""}${isRight ? " answer-correct" : ""}${isWrong ? " answer-wrong" : ""}`} key={choice} onClick={() => { if (!showFeedback) setSelectedAnswer(index); }} disabled={showFeedback} aria-pressed={isSelected}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="answer-text">{choice}</span><span className="answer-check">{isRight ? <Check size={17} /> : isSelected ? <span className="answer-radio-dot" /> : null}</span></button>;
                })}
              </div>
              {showFeedback && <div className={`answer-feedback${quizIsCorrect ? " feedback-correct" : " feedback-try-again"}`}><span className="feedback-symbol">{quizIsCorrect ? <CheckCircle2 size={20} /> : <Heart size={18} />}</span><div><strong>{quizIsCorrect ? "정확해요!" : "괜찮아요, 배움은 계속돼요."}</strong><p>{currentQuestion.explanation}</p></div></div>}
              {showFeedback && hearts === 0 && <div className="hearts-empty-note">하트를 모두 써도 레슨은 끝까지 이어갈 수 있어요. 설명을 읽고 다음 문제로 가요.</div>}
            </section>
          ) : null}

          <div className="lesson-footer"><div className="lesson-duration"><Clock3 size={15} /><span>{lesson.duration} · 부담 없이 한 걸음</span></div><button className="button-primary lesson-next" onClick={advance} disabled={!isConcept && selectedAnswer === null && !showFeedback}>{isConcept ? phase === sectionCount - 1 ? "문제 풀기" : "계속하기" : !showFeedback ? "정답 확인" : quizIndex === questionCount - 1 ? "보상 확인" : "다음 문제"}{!isConcept && showFeedback && quizIndex === questionCount - 1 ? <Check size={17} /> : <ChevronRight size={18} />}</button></div>
        </main>
      ) : (
        <main className="completion-main">
          <div className="completion-glow" aria-hidden="true"><span /><span /><span /></div>
          <div className="completion-medallion"><CheckCircle2 size={45} strokeWidth={1.7} /></div>
          <span className="completion-eyebrow"><Sparkles size={14} /> 퀘스트 완료</span>
          <h1>{completedBefore ? "복습까지 완료!" : correctFirstTryCount === questionCount ? "완벽한 방어였어요!" : "보안 감각이 한 뼘 자랐어요!"}</h1>
          <p className="completion-copy">{lesson.shortTitle} 퀘스트를 마쳤어요.<br />첫 시도 정답 {correctFirstTryCount}/{questionCount}개 · 배운 내용을 안전한 습관으로 이어가요.</p>
          <div className="earned-card"><div className="earned-icon"><Zap size={22} fill="currentColor" /></div><div><span>{earnedXp > 0 ? "새로 모은 경험치" : "복습 완료"}</span><strong>{earnedXp > 0 ? `+${earnedXp} XP` : "좋은 습관을 다시 확인했어요"}</strong></div>{earnedXp > 0 && <span className="earned-spark"><Sparkles size={17} /></span>}</div>
          {correctFirstTryCount === questionCount && <div className="perfect-bonus"><Trophy size={15} /> 완벽 보너스 +5 XP 포함</div>}
          <div className="completion-stats"><span><Flame size={16} fill="currentColor" /> 연속 학습 <strong>{progress.streak || 1}일</strong></span><span><Trophy size={16} /> 보안 감각 <strong>레벨 {level}</strong></span></div>
          {nextLesson && nextLesson.id !== lesson.id ? <button className="button-primary completion-home" onClick={() => setLocation(`/lesson/${nextLesson.id}`)}>다음 퀘스트 <ArrowRight size={17} /></button> : <button className="button-primary completion-home" onClick={() => setLocation("/")}>{nextLesson?.id === lesson.id ? "학습 지도" : "학습 지도 보기"} <ArrowRight size={17} /></button>}
          <button className="plain-home-button" onClick={() => setLocation("/")}>학습 지도로 돌아가기</button>
          <div className="completion-footnote"><ShieldCheck size={14} /> 이 기기에 학습 기록이 저장돼요.</div>
        </main>
      )}
    </div>
  );
}
