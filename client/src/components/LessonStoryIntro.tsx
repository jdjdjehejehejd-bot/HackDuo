import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import type { Lesson } from "@/data/lessons";
import { lessonStoryboards } from "@/data/animatedStoryboards";

const sceneLabels = ["무대가 열리다", "사건이 터지다", "임무를 맡다"] as const;
const episodeArt: Record<string, string> = {
  "security-basics": "/anime/episode-01-security-basics.webp",
  "threat-model": "/anime/episode-02-threat-model.webp",
  account: "/anime/episode-03-account.webp",
  cryptography: "/anime/episode-04-cryptography.webp",
  network: "/anime/episode-05-network.webp",
  web: "/anime/episode-06-web.webp",
  privacy: "/anime/episode-07-privacy.webp",
  phishing: "/anime/episode-08-phishing.webp",
  incident: "/anime/episode-09-incident.webp",
};

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
  const lines = [firstSentence(lesson.hook), firstSentence(firstSection.scene), lesson.mission];
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [act, setAct] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const skipRef = useRef<HTMLButtonElement>(null);
  const finished = act === sceneLabels.length - 1 && !isPlaying;
  const background = episodeArt[lesson.id] ?? episodeArt["security-basics"];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      setReducedMotion(media.matches);
      if (media.matches) setIsPlaying(false);
    };
    media.addEventListener("change", syncMotionPreference);
    const focusFrame = window.requestAnimationFrame(() => skipRef.current?.focus());
    return () => {
      media.removeEventListener("change", syncMotionPreference);
      window.cancelAnimationFrame(focusFrame);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (act >= sceneLabels.length - 1) setIsPlaying(false);
      else setAct((current) => current + 1);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [act, isPlaying, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onStart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onStart]);

  function togglePlayback() {
    if (reducedMotion) {
      setAct((current) => current >= sceneLabels.length - 1 ? 0 : current + 1);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (finished) setAct(0);
    setIsPlaying(true);
  }

  function selectAct(index: number) {
    setAct(index);
    setIsPlaying(false);
  }

  return (
    <div className={`anime-opening anime-opening-act-${act}${isPlaying ? " anime-opening-playing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="anime-opening-title">
      <img className="anime-opening-background" src={background} alt="" aria-hidden="true" draggable={false} />
      <div className="anime-opening-color-grade" aria-hidden="true" />
      <div className="anime-opening-vignette" aria-hidden="true" />
      <div className="anime-opening-light-leak" aria-hidden="true" />
      <div className="anime-opening-grain" aria-hidden="true" />

      <header className="anime-opening-header">
        <button className="anime-opening-exit" onClick={onExit} aria-label="학습 피드로 돌아가기"><ArrowLeft size={16} /><span>피드</span></button>
        <div className="anime-opening-brand"><BrandMark compact /><span>TEUM · ORIGINAL SERIES</span></div>
        <button ref={skipRef} className="anime-opening-skip" onClick={onStart}>건너뛰기 <ArrowRight size={14} /></button>
      </header>

      <div className={`anime-opening-title-card${act === 0 ? " anime-opening-title-visible" : ""}`}>
        <span><Sparkles size={13} /> EPISODE {String(lessonNumber).padStart(2, "0")}</span>
        <h1 id="anime-opening-title">{lesson.title}</h1>
        <p>{lesson.episode}</p>
      </div>

      <div className={`anime-opening-scene anime-opening-scene-${act}`} aria-hidden="true">
        <div className="anime-opening-sun-glow" />
        <div className="anime-opening-spark anime-opening-spark-one" />
        <div className="anime-opening-spark anime-opening-spark-two" />
        <img className={`anime-opening-character anime-opening-minji anime-opening-minji-${act}`} src="/anime/minji-anime.webp" alt="" draggable={false} />
        <img className={`anime-opening-character anime-opening-ttumi anime-opening-ttumi-${act}`} src="/anime/ttumi-anime.webp" alt="" draggable={false} />
      </div>

      <div className={`anime-opening-action-line anime-opening-action-line-${act}`}>
        <span>{sceneLabels[act]}</span>
        <strong>{act === 0 ? board.location : act === 1 ? firstSection.title : lesson.mission}</strong>
      </div>

      <div className="anime-opening-subtitle" aria-live="polite" aria-atomic="true">
        <span>{act === 1 ? "민지 · 새빛대 학생" : "틈이 · 보안 도우미"}</span>
        <p key={act}>“{lines[act]}”</p>
      </div>

      <footer className="anime-opening-controls">
        <div className="anime-opening-progress" role="group" aria-label="오프닝 장면 선택">
          {sceneLabels.map((label, index) => (
            <button key={label} className={act === index ? "anime-opening-step-active" : ""} onClick={() => selectAct(index)} aria-label={`${index + 1}장면: ${label}`} aria-pressed={act === index}>
              <span className="anime-opening-progress-track"><i /></span>
              <span className="anime-opening-step-label">{label}</span>
            </button>
          ))}
        </div>
        <div className="anime-opening-control-row">
          <span className="anime-opening-hint">{reducedMotion ? "모션 감소 · 장면을 직접 넘겨 보세요" : isPlaying ? lesson.episode : finished ? "이야기가 이어질 준비가 됐어요" : "오프닝 재생을 조절할 수 있어요"}</span>
          <button className="anime-opening-play" onClick={togglePlayback} aria-pressed={isPlaying}>
            {reducedMotion ? <Play size={15} /> : isPlaying ? <Pause size={15} /> : finished ? <RotateCcw size={15} /> : <Play size={15} />}
            {reducedMotion ? act === sceneLabels.length - 1 ? "처음부터" : "다음 장면" : isPlaying ? "일시정지" : finished ? "다시 보기" : "이어서 보기"}
          </button>
          {finished && <button className="anime-opening-start" onClick={onStart}>수업 시작 <ArrowRight size={17} /></button>}
        </div>
      </footer>
    </div>
  );
}
