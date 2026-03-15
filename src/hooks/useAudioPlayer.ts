import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";

import { useStore } from "@/store";

/**
 * Manages the Tone.js audio engine.
 * Tone.Player → PitchShift effect → Destination
 *
 * Exposes:
 *  - seek(time): move playhead
 *  - currentSeconds(): returns current Tone.Transport position
 */
export function useAudioPlayer() {
  const playerRef = useRef<Tone.Player | null>(null);
  const pitchShiftRef = useRef<Tone.PitchShift | null>(null);
  const loopTimeoutRef = useRef<number | null>(null);

  const {
    audioUrl,
    status,
    isPlaying,
    playbackRate,
    detune,
    isLooping,
    loopStart,
    loopEnd,
    setPlaying,
    setProjectReady,
    setCurrentTime,
    syncFirstMeasureStart,
    updateRhythm,
  } = useStore();

  // ── Initialize audio engine when a project is loaded ─────────────────────

  useEffect(() => {
    if (!audioUrl || status !== "loading") return;

    let cancelled = false;

    const init = async () => {
      // Tear down any previous instance
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current.dispose();
      }
      if (pitchShiftRef.current) {
        pitchShiftRef.current.dispose();
      }
      Tone.getTransport().stop();
      Tone.getTransport().cancel();

      const pitchShift = new Tone.PitchShift().toDestination();
      const player = new Tone.Player({
        url: audioUrl,
        onload: () => {
          if (cancelled) return;
          Tone.getTransport().loop = false;
          setProjectReady();
        },
        onerror: (e) => {
          console.error("Audio load error", e);
        },
      }).connect(pitchShift);

      pitchShiftRef.current = pitchShift;
      playerRef.current = player;
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [audioUrl, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Play / pause ──────────────────────────────────────────────────────────

  useEffect(() => {
    const transport = Tone.getTransport();
    if (isPlaying) {
      Tone.start().then(() => {
        if (playerRef.current?.loaded) {
          playerRef.current.sync().start(0);
          transport.start();
        }
      });
    } else {
      transport.pause();
    }
  }, [isPlaying]);

  // ── Time tracking (RAF loop while playing) ────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return;

    let rafId: number;
    const tick = () => {
      const t = Tone.getTransport().seconds;
      setCurrentTime(t);

      // Handle loop end
      if (isLooping && t >= loopEnd) {
        Tone.getTransport().seconds = loopStart;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isLooping, loopStart, loopEnd, setCurrentTime]);

  // ── Sync playback rate ────────────────────────────────────────────────────

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // ── Sync detune / pitch shift ─────────────────────────────────────────────

  useEffect(() => {
    if (!pitchShiftRef.current) return;
    // Combine manual detune with pitch compensation for playback rate
    const compensation = 12 * Math.log2(1 / playbackRate);
    pitchShiftRef.current.pitch = compensation + detune;
  }, [detune, playbackRate]);

  // ── Sync loop ─────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  // ── Seek helper ───────────────────────────────────────────────────────────

  const seek = useCallback((time: number) => {
    Tone.getTransport().seconds = time;
    setCurrentTime(time);

    // If syncFirstMeasureStart mode is active, use seek position as measure 0
    if (useStore.getState().syncFirstMeasureStart) {
      updateRhythm({ firstMeasureStart: time });
    }
  }, [setCurrentTime, updateRhythm]);

  // ── Stop (used on project reset) ──────────────────────────────────────────

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    setPlaying(false);
  }, [setPlaying]);

  return { seek, stop };
}
