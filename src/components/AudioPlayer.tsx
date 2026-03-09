"use client";

import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  /** ID/nombre del archivo en Cloudflare R2 (ej: audios/cancion.mp3) */
  cloudflareId: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ cloudflareId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_R2_AUDIO_URL?.replace(/\/$/, "") ?? "";
  const src = baseUrl && cloudflareId ? `${baseUrl}/${cloudflareId}` : "";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setLoaded(true);
      }
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("canplay", onDurationChange);
    audio.addEventListener("ended", onEnded);
    if (audio.duration && isFinite(audio.duration)) onDurationChange();
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("canplay", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  if (!src) {
    return (
      <div className="py-6">
        <p className="text-grey-muted text-xs">
          Configura NEXT_PUBLIC_R2_AUDIO_URL para reproducir el audio.
        </p>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4 py-2">
      <audio ref={audioRef} preload="metadata" src={src} />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pausar" : "Reproducir"}
        className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-white-broken hover:border-white-broken/30 hover:text-white-muted transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-white-broken/20"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
            <rect x="1" y="0" width="4" height="12" rx="0.5" />
            <rect x="7" y="0" width="4" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
            <path d="M3 2v8l7-4z" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0 flex items-center">
        <div className="relative w-full h-4 flex items-center">
          <div className="absolute left-0 right-0 h-0.5 bg-border rounded-full" />
          <div
            className="absolute left-0 h-0.5 bg-white-broken/40 rounded-full transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="audio-range relative w-full h-4 bg-transparent appearance-none cursor-pointer"
          />
        </div>
      </div>
      <span className="flex-shrink-0 text-grey-muted text-xs tabular-nums font-body min-w-[4.5rem] text-right">
        {formatTime(currentTime)}
        <span className="text-grey-muted/70 mx-1">/</span>
        {loaded ? formatTime(duration) : "…"}
      </span>
    </div>
  );
}
