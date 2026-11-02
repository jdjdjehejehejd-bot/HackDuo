import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import type { Lesson } from "@/data/lessons";

type EpisodeOneVideoIntroProps = {
  lesson: Lesson;
  lessonNumber: number;
  onStart: () => void;
  onExit: () => void;
  onVideoError: () => void;
};

const captions = [
  { start: 2.0, end: 3.8, speaker: "민지", text: "손대면 안 되는 이유가 있겠지?" },
  { start: 3.8, end: 6.8, speaker: "틈이", text: "안녕, 민지. 이번에는 내가 먼저 깨어났네." },
  { start: 6.8, end: 8.6, speaker: "민지", text: "왜 검색창에 그대로 떠?" },
  { start: 8.6, end: 11.4, speaker: "틈이", text: "처음부터 잠기지 않았어." },
  { start: 11.4, end: 15.2, speaker: "틈이", text: "민지, 이건 사고가 아니라 확인해야 할 사건이야." },
] as const;

export default function EpisodeOneVideoIntro({
  lesson,
  lessonNumber,
  onStart,
  onExit,
  onVideoError,
}: EpisodeOneVideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15.104);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().then(() => {
      setHasStarted(true);
      setNeedsGesture(false);
    }).catch(() => {
      setNeedsGesture(true);
    });
  }, []);

  const activeCaption = captions.find(({ start, end }) => currentTime >= start && currentTime < end);
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  function startPlayback(restart = false) {
    const video = videoRef.current;
    if (!video) return;
    if (restart) video.currentTime = 0;
    video.play().then(() => {
      setHasStarted(true);
      setHasEnded(false);
      setNeedsGesture(false);
    }).catch(() => {
      setNeedsGesture(true);
    });
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      return;
    }
    startPlayback(hasEnded);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && !isPlaying && !hasEnded) startPlayback();
  }

  function seekTo(value: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.currentTime = value;
    setCurrentTime(value);
    if (hasEnded && value < duration) setHasEnded(false);
  }

  return (
    <div className="anime-opening anime-video-opening" role="dialog" aria-modal="true" aria-labelledby="anime-video-title">
      <video
        ref={videoRef}
        className="anime-video-background"
        autoPlay
        playsInline
        preload="auto"
        poster="/anime/episode-01-security-basics.webp"
        aria-label="레슨 1 컷신 애니메이션"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 15.104)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => { setIsPlaying(true); setHasStarted(true); setNeedsGesture(false); setHasEnded(false); }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setHasEnded(true); }}
        onError={onVideoError}
      >
        <source src="/anime/episode-01-opening.mp4" type="video/mp4" />
      </video>
      <div className="anime-video-grade" aria-hidden="true" />
      <div className="anime-video-vignette" aria-hidden="true" />

      <header className="anime-opening-header">
        <button className="anime-opening-exit" onClick={onExit} aria-label="학습 피드로 돌아가기"><ArrowLeft size={16} /><span>피드</span></button>
        <div className="anime-opening-brand"><BrandMark compact /><span>TEUM · ORIGINAL SERIES</span></div>
        <button className="anime-opening-skip" onClick={onStart}>건너뛰기 <ArrowRight size={14} /></button>
      </header>

      <div className={`anime-video-title${currentTime < 2.4 ? " anime-video-title-visible" : ""}`}>
        <span>EPISODE {String(lessonNumber).padStart(2, "0")}</span>
        <h1 id="anime-video-title">{lesson.title}</h1>
        <p>{lesson.episode}</p>
      </div>

      {activeCaption && (
        <div className="anime-video-caption" aria-live="polite" aria-atomic="true">
          <span>{activeCaption.speaker}</span>
          <p>“{activeCaption.text}”</p>
        </div>
      )}

      {!isPlaying && !hasEnded && (
        <button className="anime-video-center-play" onClick={() => startPlayback(!hasStarted)} aria-label="컷신을 소리와 함께 재생">
          <Play size={26} fill="currentColor" />
          <span>{needsGesture ? "소리와 함께 재생" : "계속 보기"}</span>
        </button>
      )}

      {hasEnded && (
        <div className="anime-video-ended" role="status">
          <span>이야기는 이제 수업에서 이어져요</span>
          <button className="anime-opening-start" onClick={onStart}>수업 시작 <ArrowRight size={17} /></button>
        </div>
      )}

      <footer className="anime-video-controls">
        <input
          className="anime-video-seek"
          type="range"
          min={0}
          max={duration || 15.104}
          step={0.05}
          value={Math.min(currentTime, duration || 15.104)}
          style={{ "--anime-video-progress": `${progress}%` } as CSSProperties}
          onChange={(event) => seekTo(Number(event.currentTarget.value))}
          aria-label="컷신 재생 위치"
        />
        <div className="anime-video-control-row">
          <span className="anime-opening-hint">{isPlaying ? "컷신 감상 중" : hasEnded ? "사건의 단서를 확인했어요" : "오프닝 애니메이션"}</span>
          <div className="anime-video-control-buttons">
            <button className="anime-video-control" onClick={toggleMute} aria-label={isMuted ? "소리 켜기" : "소리 끄기"} aria-pressed={!isMuted}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button className="anime-video-control" onClick={() => startPlayback(true)} aria-label="컷신 처음부터 다시 보기"><RotateCcw size={15} /></button>
            <button className="anime-video-control" onClick={togglePlayback} aria-label={isPlaying ? "일시정지" : "재생"} aria-pressed={isPlaying}>
              {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
