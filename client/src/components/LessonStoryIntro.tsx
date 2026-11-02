import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import type { Lesson } from "@/data/lessons";
import { storyDialogues } from "@/data/storyDialogues";
import EpisodeOneVideoIntro from "@/components/EpisodeOneVideoIntro";

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
  "white-hat": "/anime/episode-09-incident.webp",
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type LessonStoryIntroProps = {
  lesson: Lesson;
  lessonNumber: number;
  onStart: () => void;
  onExit: () => void;
};

export default function LessonStoryIntro({ lesson, lessonNumber, onStart, onExit }: LessonStoryIntroProps) {
  const episodeDialogue = storyDialogues[lesson.id] ?? storyDialogues["security-basics"];
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [act, setAct] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion() && lesson.id !== "security-basics");
  const [videoFailed, setVideoFailed] = useState(false);
  const visualAct = Math.min(act, 2);
  const isFirstEpisode = lesson.id === "security-basics";
  const isVideoOpening = isFirstEpisode && !videoFailed && !reducedMotion;
  const ttumiVisible = !isFirstEpisode || act >= 5;
  const skipRef = useRef<HTMLButtonElement>(null);
  const finished = act === episodeDialogue.length - 1 && !isPlaying;
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
    if (!videoFailed || reducedMotion) return;
    setAct(0);
    setIsPlaying(true);
  }, [reducedMotion, videoFailed]);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const lineDuration = Math.min(10000, Math.max(4500, 2600 + episodeDialogue[act].line.length * 55));
    const timer = window.setTimeout(() => {
      if (act >= episodeDialogue.length - 1) setIsPlaying(false);
      else setAct((current) => current + 1);
    }, lineDuration);
    return () => window.clearTimeout(timer);
  }, [act, episodeDialogue, isPlaying, reducedMotion]);

  function advanceAct() {
    if (act >= episodeDialogue.length - 1) {
      setIsPlaying(false);
      onStart();
      return;
    }
    setAct((current) => current + 1);
    setIsPlaying(true);
  }

  function previousAct() {
    if (act === 0) return;
    setAct((current) => current - 1);
    setIsPlaying(false);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
      if (isVideoOpening) return;
      if (event.key === "ArrowLeft") previousAct();
      if (event.key === "ArrowRight") advanceAct();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onExit, act, episodeDialogue.length, isVideoOpening]);

  function togglePlayback() {
    if (reducedMotion) {
      setAct((current) => current >= episodeDialogue.length - 1 ? 0 : current + 1);
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

  function handleOpeningClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("button, header, footer")) return;
    advanceAct();
  }

  if (isVideoOpening) {
    return (
      <EpisodeOneVideoIntro
        lesson={lesson}
        lessonNumber={lessonNumber}
        onStart={onStart}
        onExit={onExit}
        onVideoError={() => setVideoFailed(true)}
      />
    );
  }

  return (
    <div className={`anime-opening anime-opening-act-${act}${isPlaying ? " anime-opening-playing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="anime-opening-title" onClick={handleOpeningClick} title="화면을 클릭하면 다음 장면으로 넘어갑니다">
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

      <div className={`anime-opening-scene anime-opening-scene-${visualAct}`} aria-hidden="true">
        <div className="anime-opening-sun-glow" />
        <div className="anime-opening-spark anime-opening-spark-one" />
        <div className="anime-opening-spark anime-opening-spark-two" />
        <img className={`anime-opening-character anime-opening-minji anime-opening-minji-${visualAct}`} src="/anime/minji-anime.webp" alt="" draggable={false} />
        <img className={`anime-opening-character anime-opening-ttumi anime-opening-ttumi-${visualAct}${ttumiVisible ? " anime-opening-ttumi-visible" : " anime-opening-ttumi-hidden"}${isFirstEpisode && act === 5 ? " anime-opening-ttumi-reveal" : ""}`} src="/anime/ttumi-anime.webp" alt="" draggable={false} />
      </div>

      <button className="anime-opening-nav anime-opening-nav-prev" onClick={previousAct} disabled={act === 0} aria-label="컷씬 이전 장면"><ArrowLeft size={23} /></button>
      <button className="anime-opening-nav anime-opening-nav-next" onClick={advanceAct} aria-label={act === episodeDialogue.length - 1 ? "수업 시작" : "컷씬 다음 장면"}><ArrowRight size={23} /></button>

      <div className="anime-opening-action-line anime-opening-action-line-visible">
        <span>새빛대학교 보안 동아리 · 틈이 프로젝트</span>
      </div>

      <div className="anime-opening-subtitle" aria-live="polite" aria-atomic="true">
        <span>{episodeDialogue[act].speaker}</span>
        <p key={act}>{episodeDialogue[act].line}</p>
      </div>

      <footer className="anime-opening-controls">
        <div className="anime-opening-progress" role="group" aria-label="오프닝 장면 선택">
          {episodeDialogue.map((scene, index) => (
            <button key={scene.label} className={act === index ? "anime-opening-step-active" : ""} onClick={() => selectAct(index)} aria-label={`${index + 1}장면: ${scene.label}`} aria-pressed={act === index}>
              <span className="anime-opening-progress-track"><i /></span>
              <span className="anime-opening-step-label">{scene.label}</span>
            </button>
          ))}
        </div>
        <div className="anime-opening-control-row">
          <span className="anime-opening-hint">{reducedMotion ? "모션 감소 · 화면을 클릭해 다음 장면" : isPlaying ? "화면 클릭 · 다음 장면" : finished ? "이야기가 이어질 준비가 됐어요" : "화면 클릭 또는 재생 버튼"}</span>
          <button className="anime-opening-play" onClick={togglePlayback} aria-pressed={isPlaying}>
            {reducedMotion ? <Play size={15} /> : isPlaying ? <Pause size={15} /> : finished ? <RotateCcw size={15} /> : <Play size={15} />}
            {reducedMotion ? act === episodeDialogue.length - 1 ? "처음부터" : "다음 장면" : isPlaying ? "일시정지" : finished ? "다시 보기" : "이어서 보기"}
          </button>
          {finished && <button className="anime-opening-start" onClick={onStart}>수업 시작 <ArrowRight size={17} /></button>}
        </div>
      </footer>
    </div>
  );
}
