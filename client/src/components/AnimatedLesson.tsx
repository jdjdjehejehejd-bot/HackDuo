import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import type { LessonSection } from "@/data/lessons";
import { lessonStoryboards } from "@/data/animatedStoryboards";

const beatLabels = ["문제 발견", "원리 설명", "함께 해결"] as const;

function firstSentence(text: string) {
  const sentence = text.match(/[^.!?]+[.!?]?/u)?.[0]?.trim();
  return sentence || text;
}

type AnimatedLessonProps = {
  lessonId: string;
  sectionIndex: number;
  section: LessonSection;
};

export default function AnimatedLesson({ lessonId, sectionIndex, section }: AnimatedLessonProps) {
  const board = lessonStoryboards[lessonId] ?? lessonStoryboards["security-basics"];
  const steps = board.steps[sectionIndex] ?? board.steps[0];
  const [beatIndex, setBeatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(media.matches);
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    setBeatIndex(0);
    setIsPlaying(!reducedMotion);
  }, [lessonId, sectionIndex, reducedMotion]);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (beatIndex >= beatLabels.length - 1) setIsPlaying(false);
      else setBeatIndex((current) => current + 1);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, [beatIndex, isPlaying, reducedMotion]);

  const dialog = [section.scene, firstSentence(section.body), section.takeaway];
  const speaker = beatIndex === 1 ? "틈이 · 보안 도우미" : "민지 · 새빛대 학생";
  const isFinished = beatIndex === beatLabels.length - 1 && !isPlaying;

  function activatePlayback() {
    if (reducedMotion) {
      setBeatIndex((current) => current >= beatLabels.length - 1 ? 0 : current + 1);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (isFinished) setBeatIndex(0);
    setIsPlaying(true);
  }

  return (
    <section className={`animated-lesson animated-theme-${lessonId} cartoon-lesson`} aria-label={`카툰 강의: ${section.concept}`}>
      <div className="animated-lesson-heading">
        <div><span className="animated-lesson-kicker">이야기로 배우는 정보보안</span><strong>{section.concept}</strong></div>
        <span className="animated-lesson-duration">카툰 3장면</span>
      </div>

      <div className={`cartoon-stage cartoon-set-${lessonId} cartoon-beat-${beatIndex}${isPlaying ? " cartoon-playing" : ""}`} data-beat={beatIndex}>
        <div className="cartoon-set-window" aria-hidden="true"><i /><i /><i /><span>{board.location}</span></div>
        <div className="cartoon-episode-tag"><Sparkles size={11} /> {board.badge}</div>

        <div className={`cartoon-prop-card cartoon-prop-phase-${beatIndex}`} aria-hidden="true">
          <span className="cartoon-prop-stamp">{board.propGlyph}</span>
          <span className="cartoon-prop-copy"><small>{board.propName}</small><strong>{steps[beatIndex]}</strong></span>
          <i className="cartoon-prop-status" />
        </div>

        <img className={`cartoon-character cartoon-minji cartoon-pose-${beatIndex}`} src="/cartoon/minji-student.webp" alt="" aria-hidden="true" draggable={false} />
        <img className={`cartoon-character cartoon-ttumi cartoon-pose-${beatIndex}`} src="/cartoon/ttumi-security-bot.webp" alt="" aria-hidden="true" draggable={false} />

        <div className={`cartoon-dialogue cartoon-dialogue-${beatIndex}`} aria-live="polite" aria-atomic="true">
          <span>{speaker}</span>
          <p>“{dialog[beatIndex]}”</p>
        </div>
        <span className="cartoon-scene-counter">장면 {beatIndex + 1} / 3</span>
      </div>

      <div className="animated-controls cartoon-controls" aria-label="카툰 강의 조작">
        {reducedMotion ? (
          <button className="animated-play-button" onClick={activatePlayback} aria-label={beatIndex === beatLabels.length - 1 ? "카툰 강의 처음 장면으로 돌아가기" : "카툰 강의 다음 장면 보기"}>
            <Play size={14} /> {beatIndex === beatLabels.length - 1 ? "처음 장면" : "다음 장면"}
          </button>
        ) : (
          <button className="animated-play-button" onClick={activatePlayback} aria-pressed={isPlaying}>
            {isPlaying ? <Pause size={14} /> : isFinished ? <RotateCcw size={14} /> : <Play size={14} />}
            {isPlaying ? "잠깐 멈추기" : isFinished ? "다시 보기" : beatIndex > 0 ? "이어서 보기" : "카툰 재생"}
          </button>
        )}
        <div className="animated-beat-picker cartoon-beat-picker" role="group" aria-label="카툰 장면 선택">
          {beatLabels.map((label, index) => (
            <button key={label} className={beatIndex === index ? "beat-picker-active" : ""} onClick={() => { setBeatIndex(index); setIsPlaying(false); }} aria-label={`장면 ${index + 1}: ${label}`} aria-pressed={beatIndex === index}>{index + 1}</button>
          ))}
        </div>
        <span className="animated-caption-hint">{reducedMotion ? "모션 감소 설정 · 장면을 직접 넘겨요" : isPlaying ? "민지와 틈이의 이야기가 재생 중이에요" : "장면을 선택해 다시 볼 수 있어요"}</span>
      </div>
    </section>
  );
}
