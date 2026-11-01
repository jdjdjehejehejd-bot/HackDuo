import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  Flame,
  Heart,
  LockKeyhole,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Trophy,
  Target,
  Zap,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import BrandMark from "@/components/BrandMark";
import AnimatedLesson from "@/components/AnimatedLesson";
import LessonStoryIntro from "@/components/LessonStoryIntro";
import { lessons } from "@/data/lessons";
import { storyDecisions } from "@/data/storyDecisions";
import { getCurrentStreak, getLevelNumber, useLearningProgress } from "@/hooks/useLearningProgress";
import NotFound from "@/pages/NotFound";

const STARTING_HEARTS = 5;

export default function LessonPage() {
  const [match, params] = useRoute<{ lessonId: string }>("/lesson/:lessonId");
  const [, setLocation] = useLocation();
  const lessonIndex = match ? lessons.findIndex((item) => item.id === params.lessonId) : -1;
  const lesson = lessonIndex >= 0 ? lessons[lessonIndex] : undefined;
  const { progress, completeLesson, recordStoryChoice } = useLearningProgress();
  const [enteredLessonId, setEnteredLessonId] = useState(lesson?.id);
  const [completedAtEntry, setCompletedAtEntry] = useState(() =>
    lesson ? progress.completedLessonIds.includes(lesson.id) : false,
  );
  const [phase, setPhase] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [firstTryResults, setFirstTryResults] = useState<Record<number, boolean>>({});
  const [earnedXp, setEarnedXp] = useState(0);
  const [storyIntroDismissedFor, setStoryIntroDismissedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!lesson || lesson.id === enteredLessonId) return;
    setEnteredLessonId(lesson.id);
    setCompletedAtEntry(progress.completedLessonIds.includes(lesson.id));
    setPhase(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFirstTryResults({});
    setEarnedXp(0);
  }, [enteredLessonId, lesson, progress.completedLessonIds]);

  if (!lesson) return <NotFound />;

  const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const completedBefore = completedAtEntry;
  const isLocked = !completedBefore && previousLesson ? !progress.completedLessonIds.includes(previousLesson.id) : false;
  const currentStreak = getCurrentStreak(progress.lastActiveDate, progress.streak);
  const level = getLevelNumber(progress.xp);
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
  const storyDecision = storyDecisions[lesson.id];
  const chosenDecision = progress.storyChoices[lesson.id];

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
        <header className="lesson-topbar"><button className="back-button" onClick={() => setLocation("/")}><ArrowLeft size={18} /><span>피드</span></button><BrandMark /><span /></header>
        <main className="locked-main"><div className="locked-medallion"><LockKeyhole size={30} /></div><span className="completion-eyebrow"><ShieldCheck size={14} /> 다음 스토리</span><h1>단서를 하나씩 모아봐요.</h1><p><strong>{previousLesson?.shortTitle}</strong> 단원을 마치면 이 스토리가 열려요.</p><button className="button-primary completion-home" onClick={() => setLocation(`/lesson/${previousLesson?.id}`)}>이전 단원 이어서 보기 <ArrowRight size={17} /></button><button className="plain-home-button" onClick={() => setLocation("/")}>피드로 돌아가기</button></main>
      </div>
    );
  }

  if (storyIntroDismissedFor !== lesson.id) {
    return (
      <LessonStoryIntro
        key={lesson.id}
        lesson={lesson}
        lessonNumber={lessonIndex + 1}
        onStart={() => setStoryIntroDismissedFor(lesson.id)}
        onExit={() => setLocation("/")}
      />
    );
  }

  return (
    <div className="lesson-shell">
      <header className="lesson-topbar"><button className="back-button" onClick={goBack} aria-label={phase === 0 ? "피드로 돌아가기" : "이전 단계"}><ArrowLeft size={18} /><span>{phase === 0 ? "피드" : "이전"}</span></button><BrandMark /><div className="lesson-top-stats"><span><Flame size={14} fill="currentColor" /> {currentStreak}일</span><span><Zap size={14} fill="currentColor" /> {progress.xp} XP</span></div></header>

      {!isComplete ? (
        <main className="lesson-main">
          <div className="lesson-intro"><span className="lesson-category"><ShieldCheck size={13} /> {lesson.category}<i>·</i> EP.{String(lessonIndex + 1).padStart(2, "0")}</span><span className="lesson-episode-label">CHAPTER 0{lesson.stageNumber} · {lesson.episode}</span><h1>{lesson.title}</h1><p>{lesson.summary}</p><div className="lesson-mission"><Target size={15} /><span><small>이번 편의 임무</small><strong>{lesson.mission}</strong></span></div></div>
          <div className="lesson-meter"><button className="meter-back" onClick={goBack} aria-label="이전 단계"><ArrowLeft size={16} /></button><div className="meter-track" role="progressbar" aria-label="스토리 진행률" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={phase + 1} aria-valuetext={`${totalSteps}단계 중 ${phase + 1}단계`}>{Array.from({ length: totalSteps }, (_, index) => <i className={phase >= index ? "meter-filled" : ""} key={index} />)}</div><span className="meter-label">{phase + 1}<small> / {totalSteps}</small></span><span className={`heart-counter${hearts <= 2 ? " hearts-low" : ""}`} aria-label={`남은 하트 ${hearts}개`}>{Array.from({ length: STARTING_HEARTS }, (_, index) => <Heart key={index} size={14} fill={index < hearts ? "currentColor" : "none"} />)}</span></div>

          {isConcept ? (
            <section key={`concept-${lesson.id}-${phase}`} className="concept-card" aria-live="polite">
              <div className="case-file-line"><span className="case-tag"><Sparkles size={13} /> 사건 기록 · {String(lessonIndex + 1).padStart(2, "0")}</span><span className="concept-number">단서 {phase + 1} / {sectionCount}</span></div>
              {phase === 0 && <blockquote className="lesson-hook">“{lesson.hook}”</blockquote>}
              {phase === 0 && storyDecision && <div className="story-decision"><div className="story-decision-heading"><Target size={15} /><div><small>첫 번째 판단 체크포인트</small><strong>{storyDecision.prompt}</strong></div></div><div className="story-decision-options" role="group" aria-label="스토리 판단 선택지">{storyDecision.choices.map((choice, index) => { const chosen = chosenDecision === index; const isBest = index === storyDecision.bestIndex; return <button key={choice} className={`story-decision-option${chosen ? " story-decision-selected" : ""}${chosen && isBest ? " story-decision-good" : ""}`} onClick={() => recordStoryChoice(lesson.id, index)} aria-pressed={chosen}><span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong></button>; })}</div>{chosenDecision !== undefined && <div className={`story-decision-outcome${chosenDecision === storyDecision.bestIndex ? " story-decision-outcome-good" : ""}`}><Sparkles size={14} /><span>{storyDecision.outcomes[chosenDecision]}</span></div>}</div>}
              <div className="case-evidence"><span>현장 기록</span><p>{lesson.sections[phase].scene}</p></div>
              <AnimatedLesson lessonId={lesson.id} sectionIndex={phase} section={lesson.sections[phase]} />
              <h2>{lesson.sections[phase].title}</h2><p>{lesson.sections[phase].body}</p>
              <div className="takeaway"><span><Sparkles size={14} /></span><div><small>기억해 두기</small><strong>{lesson.sections[phase].takeaway}</strong></div></div>
              <div className="lesson-learning-note"><BadgeCheck size={14} /><span>실제 일상에서 비슷한 장면을 만나면 떠올려 봐요.</span></div>
            </section>
          ) : currentQuestion ? (
            <section key={`quiz-${lesson.id}-${quizIndex}`} className="quiz-card" aria-live="polite">
              <div className="quiz-overline"><span className="quiz-icon"><CircleHelp size={17} /></span><span>단서 확인 {quizIndex + 1} / {questionCount}</span><span className="quiz-reward"><Zap size={12} fill="currentColor" /> 정답 XP</span></div>
              <h2>{currentQuestion.question}</h2>
              <div className="answer-list" role="group" aria-label="정답 선택지">{currentQuestion.choices.map((choice, index) => { const isSelected = selectedAnswer === index; const isRight = showFeedback && index === currentQuestion.answerIndex; const isWrong = showFeedback && isSelected && !quizIsCorrect; return <button className={`answer-option${isSelected ? " answer-selected" : ""}${isRight ? " answer-correct" : ""}${isWrong ? " answer-wrong" : ""}`} key={choice} onClick={() => { if (!showFeedback) setSelectedAnswer(index); }} disabled={showFeedback} aria-pressed={isSelected}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="answer-text">{choice}</span><span className="answer-check">{isRight ? <Check size={16} /> : isSelected ? <span className="answer-radio-dot" /> : null}</span></button>; })}</div>
              {showFeedback && <div className={`answer-feedback answer-feedback-enter${quizIsCorrect ? " feedback-correct" : " feedback-try-again"}`}><span className="feedback-symbol">{quizIsCorrect ? <CheckCircle2 size={19} /> : <Heart size={17} />}</span><div><strong>{quizIsCorrect ? "정확해요. 단서를 찾았어요." : "괜찮아요. 이유를 확인해 봐요."}</strong><p>{currentQuestion.explanation}</p></div></div>}
              {showFeedback && hearts === 0 && <div className="hearts-empty-note">하트를 모두 써도 스토리는 계속돼요. 해설을 읽고 다음 단계로 가요.</div>}
            </section>
          ) : null}

          <div className="lesson-footer"><div className="lesson-duration"><Clock3 size={14} /><span>{lesson.duration} · 편하게 한 걸음</span></div><button className="button-primary lesson-next" onClick={advance} disabled={!isConcept && selectedAnswer === null && !showFeedback}>{isConcept ? phase === sectionCount - 1 ? "사건 속 질문 풀기" : "다음 단서 찾기" : !showFeedback ? "선택 확인하기" : quizIndex === questionCount - 1 ? "이번 편 마무리" : "다음 질문"}{!isConcept && showFeedback && quizIndex === questionCount - 1 ? <Check size={16} /> : <ChevronRight size={17} />}</button></div>
          <nav className="lesson-references" aria-label="더 읽을거리"><span>개념 더 알아보기</span>{lesson.references.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">{reference.label}<ExternalLink size={12} /></a>)}</nav>
        </main>
      ) : (
        <main className="completion-main">
          <div className="completion-glow" aria-hidden="true"><span /><span /><span /></div><div className="completion-medallion completion-medallion-pop"><CheckCircle2 size={43} strokeWidth={1.8} /></div><span className="completion-eyebrow"><Sparkles size={13} /> STORY COMPLETE</span>
          <h1>{completedBefore ? "다시 보니 더 선명해요." : correctFirstTryCount === questionCount ? "단서를 모두 찾았어요!" : "보안 감각이 한 뼘 자랐어요."}</h1>
          <p className="completion-copy">{lesson.shortTitle} 스토리를 마쳤어요.<br />첫 시도 정답 {correctFirstTryCount}/{questionCount}개 · 배운 내용을 안전한 습관으로 이어가요.</p>
          <div className="earned-card"><div className="earned-icon"><Zap size={20} fill="currentColor" /></div><div><span>{earnedXp > 0 ? "이번에 얻은 경험치" : "다시 학습 완료"}</span><strong>{earnedXp > 0 ? `+${earnedXp} XP` : "좋은 습관을 다시 확인했어요"}</strong></div>{earnedXp > 0 && <span className="earned-spark"><Sparkles size={16} /></span>}</div>
          <div className="note-added-toast"><NotebookPen size={15} /><span>{completedBefore ? "이 편의 핵심은 My 노트에 담겨 있어요." : "클리어! 핵심 개념 3개를 My 노트에 담았어요."}</span><Check size={14} /></div>
          {correctFirstTryCount === questionCount && !completedBefore && <div className="perfect-bonus"><Trophy size={14} /> 완벽 보너스 +5 XP 포함</div>}
          <div className="completion-stats"><span><Flame size={15} fill="currentColor" /> 연속 학습 <strong>{progress.streak || 1}일</strong></span><span><Trophy size={15} /> 보안 감각 <strong>레벨 {level}</strong></span></div>
          {nextLesson && nextLesson.id !== lesson.id ? <button className="button-primary completion-home" onClick={() => setLocation(`/lesson/${nextLesson.id}`)}>다음 스토리 <ArrowRight size={16} /></button> : level >= 3 ? <button className="button-primary completion-home" onClick={() => setLocation("/lab")}>실습실 둘러보기 <ArrowRight size={16} /></button> : <button className="button-primary completion-home" onClick={() => setLocation("/my")}>내 노트 확인하기 <ArrowRight size={16} /></button>}
          <button className="plain-home-button completion-notes-link" onClick={() => setLocation("/my")}>My 노트에서 핵심 복습하기 <ArrowRight size={14} /></button>
          <button className="plain-home-button" onClick={() => setLocation("/")}>피드로 돌아가기</button><div className="completion-footnote"><ShieldCheck size={13} /> 이 기기에 학습 기록이 저장돼요.</div>
        </main>
      )}
    </div>
  );
}
