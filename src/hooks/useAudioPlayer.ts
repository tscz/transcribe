import { useEffect, useRef } from "react";
import * as Tone from "tone";

import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

/**
 * Manages the Tone.js audio engine.
 * Tone.Player → PitchShift → Destination
 *
 * Time model:
 *   Tone.getTransport().seconds  = raw Transport time, advances at real-time rate
 *   audioTime                    = Transport.seconds * playbackRate  (actual content position)
 *
 * All store values (loopStart, loopEnd, seekTarget, currentTime) are in audioTime.
 * Whenever we read/write Transport.seconds we convert:
 *   Transport → audio : t * playbackRate
 *   audio → Transport : t / playbackRate
 */
export function useAudioPlayer() {
  const playerRef = useRef<Tone.Player | null>(null);
  const pitchShiftRef = useRef<Tone.PitchShift | null>(null);
  const prevRateRef = useRef<number>(1); // tracks previous playbackRate for Transport compensation
  const playerSyncedRef = useRef<boolean>(false); // true once player.sync().start(0) has been called

  const {
    audioUrl,
    status,
    isPlaying,
    playbackRate,
    detune,
    isLooping,
    loopStart,
    loopEnd,
    seekTarget,
    setPlaying,
    setProjectReady,
    setCurrentTime,
    clearSeekTarget,
  } = useStore(
    useShallow((s) => ({
      audioUrl: s.audioUrl,
      status: s.status,
      isPlaying: s.isPlaying,
      playbackRate: s.playbackRate,
      detune: s.detune,
      isLooping: s.isLooping,
      loopStart: s.loopStart,
      loopEnd: s.loopEnd,
      seekTarget: s.seekTarget,
      setPlaying: s.setPlaying,
      setProjectReady: s.setProjectReady,
      setCurrentTime: s.setCurrentTime,
      clearSeekTarget: s.clearSeekTarget,
    }))
  );

  // ── Initialize audio engine when a project is loaded ─────────────────────

  useEffect(() => {
    if (!audioUrl || status !== "loading") return;

    let cancelled = false;

    const init = async () => {
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
          setProjectReady();
        },
        onerror: (e) => console.error("Audio load error", e),
      }).connect(pitchShift);

      pitchShiftRef.current = pitchShift;
      playerRef.current = player;
      playerSyncedRef.current = false;
    };

    init();
    return () => { cancelled = true; };
  }, [audioUrl, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Play / pause ──────────────────────────────────────────────────────────

  useEffect(() => {
    const transport = Tone.getTransport();
    if (isPlaying) {
      Tone.start().then(() => {
        if (playerRef.current?.loaded) {
          if (!playerSyncedRef.current) {
            playerRef.current.sync().start(0);
            playerSyncedRef.current = true;
          }
          transport.start();
        }
      });
    } else {
      transport.pause();
    }
  }, [isPlaying]);

  // ── Consume seekTarget — convert audio time → Transport time ──────────────

  useEffect(() => {
    if (seekTarget === null) return;
    Tone.getTransport().seconds = seekTarget / playbackRate;
    clearSeekTarget();
  }, [seekTarget, clearSeekTarget]); // eslint-disable-line react-hooks/exhaustive-deps
  // playbackRate intentionally omitted: seekTarget is always set fresh by the
  // seek action, which already has access to the current rate via the store.

  // ── Time tracking + loop enforcement (RAF while playing) ──────────────────

  useEffect(() => {
    if (!isPlaying) return;

    let rafId: number;
    const tick = () => {
      const audioTime = Tone.getTransport().seconds * playbackRate;
      setCurrentTime(audioTime);
      if (isLooping && audioTime >= loopEnd) {
        Tone.getTransport().seconds = loopStart / playbackRate;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isLooping, loopStart, loopEnd, playbackRate, setCurrentTime]);

  // ── Playback rate ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!playerRef.current) return;

    const prevRate = prevRateRef.current;
    if (prevRate !== playbackRate) {
      // Keep the current audio content position when rate changes:
      //   audioTime = Transport * prevRate  →  newTransport = audioTime / newRate
      const audioTime = Tone.getTransport().seconds * prevRate;
      Tone.getTransport().seconds = audioTime / playbackRate;
      prevRateRef.current = playbackRate;
    }

    playerRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // ── Pitch shift ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!pitchShiftRef.current) return;
    const compensation = 12 * Math.log2(1 / playbackRate);
    pitchShiftRef.current.pitch = compensation + detune;
  }, [detune, playbackRate]);

  // ── Stop on unmount ───────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      Tone.getTransport().stop();
      setPlaying(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
