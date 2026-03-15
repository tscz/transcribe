import { useCallback, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

import { SECTION_COLORS } from "@/lib/constants";
import { getMeasureEnd } from "@/model/analysis";
import { Measures, Sections } from "@/model/types";
import { useStore } from "@/store";

/**
 * Manages the wavesurfer.js waveform visualization.
 * Waveform is display-only — playback is handled by Tone.js.
 * The waveform position is synced by calling setTime() from the audio player loop.
 */
export function useWaveform(containerRef: React.RefObject<HTMLDivElement | null>) {
  const wsRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<RegionsPlugin | null>(null);

  const { audioUrl, status, currentTime, seek } = useStore();

  // ── Initialize wavesurfer when project loads ──────────────────────────────

  useEffect(() => {
    if (!containerRef.current || !audioUrl || status === "idle") return;

    // Clean up existing instance
    if (wsRef.current) {
      wsRef.current.destroy();
      wsRef.current = null;
    }

    const regionsPlugin = RegionsPlugin.create();
    regionsPluginRef.current = regionsPlugin;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "hsl(239 84% 67% / 0.5)",
      progressColor: "hsl(239 84% 67%)",
      cursorColor: "hsl(239 84% 67%)",
      cursorWidth: 2,
      height: 80,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      interact: true,
      plugins: [regionsPlugin],
    });

    // Load audio (for waveform decoding only — we don't use ws.play())
    ws.load(audioUrl);

    // Route user click/seek to Tone.js
    ws.on("interaction", (time) => {
      seek(time);
    });

    wsRef.current = ws;

    return () => {
      ws.destroy();
      wsRef.current = null;
      regionsPluginRef.current = null;
    };
  }, [audioUrl, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync visual playhead with Tone.js position ────────────────────────────

  useEffect(() => {
    if (!wsRef.current) return;
    wsRef.current.setTime(currentTime);
  }, [currentTime]);

  // ── Update regions (sections) and markers (measures) ─────────────────────

  const updateRegions = useCallback(
    (sections: Sections, measures: Measures, duration: number) => {
      const rp = regionsPluginRef.current;
      if (!rp) return;

      rp.clearRegions();

      // Add section regions
      for (const sectionId of sections.allIds) {
        const section = sections.byId[sectionId];
        if (section.measures.length === 0) continue;

        const firstMeasure = section.measures[0];
        const lastMeasure = section.measures[section.measures.length - 1];
        const start = measures.byId[firstMeasure]?.time ?? 0;
        const end = getMeasureEnd(lastMeasure, measures, duration);
        const color = SECTION_COLORS[section.type];

        rp.addRegion({
          id: section.id,
          start,
          end,
          color: color + "40", // 25% opacity
          drag: false,
          resize: false,
        });
      }

      // Add measure markers as zero-width regions
      for (const measureId of measures.allIds) {
        const measure = measures.byId[measureId];
        rp.addRegion({
          id: `marker_${measureId}`,
          start: measure.time,
          end: measure.time,
          color: "rgba(255,255,255,0.25)",
          drag: false,
          resize: false,
          content: parseInt(measureId) % 4 === 0 ? measure.labelText : undefined,
        });
      }
    },
    []
  );

  return { updateRegions };
}
