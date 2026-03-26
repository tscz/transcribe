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

  // ── All store subscriptions in a single effect ───────────────────────────

  useEffect(() => {
    // Does not reset beatIndexRef — callers that need a fresh index (seek, project
    // load) set it explicitly before or after calling stopLoop.
    const stopLoop = () => {
      loopRef.current?.dispose();
      loopRef.current = null;
    };

    const startLoop = () => {
      if (loopRef.current) return;
      const { bpm, timeSignature, playbackRate, firstMeasureStart, currentTime } = useStore.getState();
      const beatsPerMeasure = TIME_SIGNATURE_BEATS[timeSignature];
      const beatInterval = (60 / bpm) / playbackRate;
      const loopStart = firstMeasureStart / playbackRate;
      // Use currentTime (audio time) / playbackRate instead of Tone.getTransport().seconds
      // so that rate-change restarts read the correct Transport position before useAudioPlayer's
      // React effect has had a chance to compensate Transport.seconds for the new rate.
      const startAt = Math.max(loopStart, currentTime / playbackRate);

      // Calibrate beat index to the start position so accents align with measure downbeats.
      // This covers: first play mid-song, metronome toggle while playing, and param changes.
      const elapsed = Math.max(0, currentTime / playbackRate - loopStart);
      beatIndexRef.current = Math.round(elapsed / beatInterval) % beatsPerMeasure;

      const loop = new Tone.Loop((time) => {
        const accent = beatIndexRef.current % beatsPerMeasure === 0;
        const synth = accent ? accentSynthRef.current : normalSynthRef.current;
        synth?.triggerAttackRelease(accent ? 1000 : 600, "32n", time);
        beatIndexRef.current += 1;
      }, beatInterval);

      loopRef.current = loop;
      loop.start(startAt);
    };

    const unsubPlayback = useStore.subscribe(
      (s) => ({ isPlaying: s.isPlaying, metronomeEnabled: s.metronomeEnabled }),
      ({ isPlaying, metronomeEnabled }) => {
        if (isPlaying && metronomeEnabled) startLoop();
        else stopLoop();
      },
      { equalityFn: shallow }
    );

    const unsubParams = useStore.subscribe(
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

    // Transport.cancel() is called on project load, which destroys all scheduled
    // events and makes our loop reference stale — stop before that happens.
    const unsubStatus = useStore.subscribe(
      (s) => s.status,
      (status) => {
        if (status === "loading") {
          stopLoop();
          beatIndexRef.current = 0;
        }
      }
    );

    const unsubSeek = useStore.subscribe(
      (s) => s.seekTarget,
      (seekTarget) => {
        if (seekTarget === null) return;
        // seek() atomically sets currentTime = seekTarget, so startLoop() will calibrate
        // beatIndexRef from the new position. Restarting the loop also re-anchors its
        // AudioContext phase so clicks land on beat boundaries after the seek.
        if (loopRef.current) {
          const { isPlaying, metronomeEnabled } = useStore.getState();
          stopLoop();
          if (isPlaying && metronomeEnabled) startLoop();
        }
      }
    );

    return () => {
      unsubPlayback();
      unsubParams();
      unsubStatus();
      unsubSeek();
      stopLoop();
    };
  }, []);
}
