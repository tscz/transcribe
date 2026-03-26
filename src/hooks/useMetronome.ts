import { useEffect, useRef } from "react";
import * as Tone from "tone";
import { shallow } from "zustand/shallow";

import { TIME_SIGNATURE_BEATS } from "@/model/types";
import { useStore } from "@/store";

/**
 * Drives a metronome click track on the existing Tone.Transport.
 *
 * Beat scheduling is done in Transport time (wall-clock seconds).
 * Loop interval = (60 / bpm) / playbackRate so clicks stay aligned
 * with the audio content at any playback speed.
 *
 * Call this hook alongside useAudioPlayer() in PlayerControls.
 */
export function useMetronome() {
  const loopRef = useRef<Tone.Loop | null>(null);
  const beatIndexRef = useRef<number>(0);
  const loopScheduledRef = useRef<boolean>(false);
  const accentSynthRef = useRef<Tone.Synth | null>(null);
  const normalSynthRef = useRef<Tone.Synth | null>(null);

  // ── Create synths on mount, dispose on unmount ───────────────────────────

  useEffect(() => {
    accentSynthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.04 },
      volume: -6,
    }).toDestination();

    normalSynthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.03 },
      volume: -12,
    }).toDestination();

    return () => {
      accentSynthRef.current?.dispose();
      normalSynthRef.current?.dispose();
      accentSynthRef.current = null;
      normalSynthRef.current = null;
    };
  }, []);

  // ── Internal helpers ─────────────────────────────────────────────────────

  const stopLoop = () => {
    loopRef.current?.stop(0);
    loopRef.current?.dispose();
    loopRef.current = null;
    loopScheduledRef.current = false;
    beatIndexRef.current = 0;
  };

  const buildLoop = () => {
    const { bpm, timeSignature, playbackRate, firstMeasureStart } = useStore.getState();
    const beatsPerMeasure = TIME_SIGNATURE_BEATS[timeSignature];
    const beatInterval = (60 / bpm) / playbackRate;
    const loopStart = firstMeasureStart / playbackRate;

    const loop = new Tone.Loop((time) => {
      const accent = beatIndexRef.current % beatsPerMeasure === 0;
      const synth = accent ? accentSynthRef.current : normalSynthRef.current;
      synth?.triggerAttackRelease(accent ? 1000 : 600, "32n", time);
      beatIndexRef.current += 1;
    }, beatInterval);

    loopRef.current = loop;
    return { loop, loopStart };
  };

  const startLoop = () => {
    if (loopScheduledRef.current) return;
    const { loop, loopStart } = buildLoop();
    loop.start(loopStart);
    loopScheduledRef.current = true;
  };

  // ── React to play state and metronome toggle ─────────────────────────────

  useEffect(() => {
    const unsub = useStore.subscribe(
      (s) => ({ isPlaying: s.isPlaying, metronomeEnabled: s.metronomeEnabled }),
      ({ isPlaying, metronomeEnabled }) => {
        if (isPlaying && metronomeEnabled) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { equalityFn: shallow }
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Rebuild loop when BPM / time signature / rate / offset changes ───────

  useEffect(() => {
    const unsub = useStore.subscribe(
      (s) => ({
        bpm: s.bpm,
        timeSignature: s.timeSignature,
        playbackRate: s.playbackRate,
        firstMeasureStart: s.firstMeasureStart,
      }),
      () => {
        const { isPlaying, metronomeEnabled } = useStore.getState();
        stopLoop();
        if (isPlaying && metronomeEnabled) startLoop();
      },
      { equalityFn: shallow }
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stop loop when a new project is loading (Transport.cancel() is called) ──

  useEffect(() => {
    const unsub = useStore.subscribe(
      (s) => s.status,
      (status) => {
        if (status === "loading") stopLoop();
      }
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recalibrate beat index on seek so accents stay aligned ───────────────

  useEffect(() => {
    const unsub = useStore.subscribe(
      (s) => s.seekTarget,
      (seekTarget) => {
        if (seekTarget === null) return;
        const { bpm, timeSignature, playbackRate, firstMeasureStart } = useStore.getState();
        const beatsPerMeasure = TIME_SIGNATURE_BEATS[timeSignature];
        const beatInterval = (60 / bpm) / playbackRate;
        const offsetSeconds = firstMeasureStart / playbackRate;
        const elapsed = Math.max(0, seekTarget / playbackRate - offsetSeconds);
        beatIndexRef.current = Math.round(elapsed / beatInterval) % beatsPerMeasure;
      }
    );
    return unsub;
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────

  useEffect(() => {
    return () => stopLoop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
