import { useEffect, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import type { LessonSection } from "@/data/lessons";
import { lessonStoryboards } from "@/data/animatedStoryboards";

const beatLabels = ["상황을 만나다", "보안 원리를 보다", "안전한 결과를 만들다"] as const;

function firstTwoSentences(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]?/gu)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [text];
  return sentences.slice(0, 2).join(" ");
}

type AnimatedLessonProps = {
  lessonId: string;
  sectionIndex: number;
  section: LessonSection;
};

export default function AnimatedLesson({ lessonId, sectionIndex, section }: AnimatedLessonProps) {
  const board = lessonStoryboards[lessonId] ?? lessonStoryboards["security-basics"];
  const flow = board.flows[sectionIndex] ?? board.flows[0];
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
    }, 3100);
    return () => window.clearTimeout(timer);
  }, [beatIndex, isPlaying, reducedMotion]);

  const narration = [section.scene, firstTwoSentences(section.body), section.takeaway];
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
    <section className={`animated-lesson animated-theme-${lessonId}`} aria-label={`애니메이션 수업: ${section.concept}`}>
      <div className="animated-lesson-heading">
        <div><span className="animated-lesson-kicker">움직이는 개념 수업</span><strong>{section.concept}</strong></div>
        <span className="animated-lesson-duration">3장면 설명</span>
      </div>

      <div className={`animated-board beat-${beatIndex}${isPlaying ? " is-playing" : ""}`}>
        <div className="animated-board-top"><span><i /> TEUM MOTION CLASS</span><small>{board.badge}</small></div>
        <div className="animated-flow" aria-hidden="true">
          <div className="animated-flow-rail"><span className={`animated-traveler traveler-${beatIndex}`}>{board.mechanismGlyph}</span></div>
          {flow.map((label, index) => {
            const glyph = [board.sourceGlyph, board.mechanismGlyph, board.resultGlyph][index];
            const state = index < beatIndex ? " is-past" : index === beatIndex ? " is-current" : " is-upcoming";
            return (
              <div className={`animated-flow-node${state}`} key={`${label}-${index}`}>
                <span className="animated-node-glyph">{glyph}</span>
                <small>0{index + 1}</small>
                <strong>{label}</strong>
              </div>
            );
          })}
        </div>
        <div className="animated-board-foot" aria-hidden="true"><span>{section.scene}</span><ArrowRight size={14} /><strong>{flow[2]}</strong></div>
      </div>

      <div key={beatIndex} className="animated-caption" aria-live="polite" aria-atomic="true">
        <span>장면 0{beatIndex + 1} · {beatLabels[beatIndex]}</span>
        <p>{narration[beatIndex]}</p>
      </div>

      <div className="animated-controls" aria-label="애니메이션 수업 조작">
        {reducedMotion ? (
          <button className="animated-play-button" onClick={activatePlayback} aria-label={beatIndex === beatLabels.length - 1 ? "애니메이션 수업 처음부터 보기" : "애니메이션 수업 다음 장면 보기"}>
            <ArrowRight size={14} /> {beatIndex === beatLabels.length - 1 ? "처음부터 장면 보기" : "다음 장면"}
          </button>
        ) : (
          <button className="animated-play-button" onClick={activatePlayback} aria-pressed={isPlaying}>
            {isPlaying ? <Pause size={14} /> : isFinished ? <RotateCcw size={14} /> : <Play size={14} />}
            {isPlaying ? "일시정지" : isFinished ? "다시 보기" : beatIndex > 0 ? "이어서 보기" : "재생"}
          </button>
        )}
        <div className="animated-beat-picker" role="group" aria-label="강의 장면 선택">
          {beatLabels.map((label, index) => (
            <button key={label} className={beatIndex === index ? "beat-picker-active" : ""} onClick={() => { setBeatIndex(index); setIsPlaying(false); }} aria-label={`장면 ${index + 1}: ${label}`} aria-pressed={beatIndex === index}>{index + 1}</button>
          ))}
        </div>
        <span className="animated-caption-hint">{reducedMotion ? "모션 감소 설정 · 버튼으로 장면을 넘겨요" : isPlaying ? "자막과 함께 수업이 재생 중이에요" : "자막을 읽고 장면을 다시 볼 수 있어요"}</span>
      </div>
    </section>
  );
}
