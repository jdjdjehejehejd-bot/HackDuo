import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import type { Lesson } from "@/data/lessons";
import { lessonStoryboards } from "@/data/animatedStoryboards";

const sceneLabels = ["화의 배경", "사건 발생", "이번 편 임무"] as const;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function firstSentence(text: string) {
  return text.match(/[^.!?]+[.!?]?/u)?.[0]?.trim() || text;
}

type LessonStoryIntroProps = {
  lesson: Lesson;
  lessonNumber: number;
  onStart: () => void;
  onExit: () => void;
};

export default function LessonStoryIntro({ lesson, lessonNumber, onStart, onExit }: LessonStoryIntroProps) {
  const board = lessonStoryboards[lesson.id] ?? lessonStoryboards["security-basics"];
  const firstSection = lesson.sections[0];
  const opening = [
    firstSentence(lesson.hook),
    firstSentence(firstSection.scene),
    lesson.mission,
  ];
  const props = [board.propName, board.steps[0][0], board.steps[0][2]];
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const isFinished = sceneIndex === sceneLabels.length - 1 && !isPlaying;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      setReducedMotion(media.matches);
      if (media.matches) setIsPlaying(false);
    };
    media.addEventListener("change", syncMotionPreference);
    const focusFrame = window.requestAnimationFrame(() => skipButtonRef.current?.focus());
    return () => {
      media.removeEventListener("change", syncMotionPreference);
      window.cancelAnimationFrame(focusFrame);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (sceneIndex >= sceneLabels.length - 1) setIsPlaying(false);
      else setSceneIndex((current) => current + 1);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [isPlaying, reducedMotion, sceneIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onStart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onStart]);

  function togglePlayback() {
    if (reducedMotion) {
      setSceneIndex((current) => current >= sceneLabels.length - 1 ? 0 : current + 1);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (isFinished) setSceneIndex(0);
    setIsPlaying(true);
  }

  function goToScene(index: number) {
    setSceneIndex(index);
    setIsPlaying(false);
  }

  return (
    <div className="lesson-story-intro" role="dialog" aria-modal="true" aria-labelledby="story-intro-title">
      <div className="story-intro-shell">
        <header className="story-intro-header">
          <button className="story-intro-exit" onClick={onExit} aria-label="학습 피드로 돌아가기"><ArrowLeft size={16} /><span>피드</span></button>
          <BrandMark />
          <button ref={skipButtonRef} className="story-intro-skip" onClick={onStart}>오프닝 건너뛰기 <ArrowRight size={14} /></button>
        </header>

        <main className="story-intro-main">
          <div className="story-intro-heading">
            <span><Sparkles size={12} /> EP.{String(lessonNumber).padStart(2, "0")} · 3장면 오프닝</span>
            <h1 id="story-intro-title">{lesson.title}</h1>
            <p>{lesson.episode}</p>
          </div>

          <div className={`story-opening-stage cartoon-set-${lesson.id} story-opening-beat-${sceneIndex}${isPlaying ? " story-opening-playing" : ""}`}>
            <div className="cartoon-set-window" aria-hidden="true"><i /><i /><i /><span>{board.location}</span></div>
            <div className="story-opening-episode-tag"><Sparkles size={12} /> {lesson.episode}</div>

            <div className={`story-opening-prop story-opening-prop-${sceneIndex}`} aria-hidden="true">
              <span className="story-opening-prop-glyph">{board.propGlyph}</span>
              <span><small>{sceneLabels[sceneIndex]}</small><strong>{props[sceneIndex]}</strong></span>
              <i />
            </div>

            <img className={`cartoon-character story-opening-minji story-opening-pose-${sceneIndex}`} src="/cartoon/minji-student.webp" alt="" aria-hidden="true" draggable={false} />
            <img className={`cartoon-character story-opening-ttumi story-opening-pose-${sceneIndex}`} src="/cartoon/ttumi-security-bot.webp" alt="" aria-hidden="true" draggable={false} />

            <div className={`cartoon-dialogue story-opening-dialogue story-opening-speaker-${sceneIndex}`} aria-live="polite" aria-atomic="true">
              <span>{sceneIndex === 1 ? "민지 · 새빛대 학생" : "틈이 · 보안 도우미"}</span>
              <p>“{opening[sceneIndex]}”</p>
            </div>
            <span className="story-opening-scene-count">장면 {sceneIndex + 1} / {sceneLabels.length}</span>
          </div>

          <div className="story-opening-progress" role="group" aria-label="오프닝 장면 선택">
            {sceneLabels.map((label, index) => (
              <button key={label} className={sceneIndex === index ? "story-opening-step-active" : ""} onClick={() => goToScene(index)} aria-label={`${index + 1}장면: ${label}`} aria-pressed={sceneIndex === index}>
                <i>{index + 1}</i><span>{label}</span>
              </button>
            ))}
          </div>

          <div className="story-opening-actions">
            <button className="story-opening-play" onClick={togglePlayback} aria-pressed={isPlaying}>
              {reducedMotion ? <Play size={15} /> : isPlaying ? <Pause size={15} /> : isFinished ? <RotateCcw size={15} /> : <Play size={15} />}
              {reducedMotion ? sceneIndex === sceneLabels.length - 1 ? "첫 장면 다시 보기" : "다음 장면" : isPlaying ? "잠깐 멈추기" : isFinished ? "오프닝 다시 보기" : "이어서 보기"}
            </button>
            {isFinished && <button className="button-primary story-opening-start" onClick={onStart}>수업 시작하기 <ArrowRight size={17} /></button>}
          </div>
          <p className="story-opening-hint" aria-live="polite">{reducedMotion ? "모션 감소 설정 · 장면을 직접 넘길 수 있어요" : isPlaying ? "오프닝이 한 번 재생된 뒤 멈춰요" : isFinished ? "이야기가 끝났어요. 준비되면 수업을 시작해요." : "원하는 장면을 눌러 다시 볼 수 있어요"}</p>
        </main>
      </div>
    </div>
  );
}
