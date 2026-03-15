import { useCallback, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";

import { SECTION_COLORS } from "@/lib/constants";
import { getMeasureEnd } from "@/model/analysis";
import { Measures, Sections } from "@/model/types";
import { useStore } from "@/store";

/**
 * Manages dual-view waveform:
 *  - detailRef:   tall, zoomable, shows sections + measures
 *  - overviewRef: short overview strip (minimap) showing full song
 *
 * Playback is handled by Tone.js; waveform is display-only.
 * Position is synced by calling ws.setTime() from the audio player RAF loop.
 */
export function useWaveform(
  detailRef: React.RefObject<HTMLDivElement | null>,
  overviewRef: React.RefObject<HTMLDivElement | null>
) {
  const wsRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const zoomPxRef = useRef<number>(0); // 0 = fit to container (wavesurfer default)
  const wsReadyRef = useRef<boolean>(false); // true only after wavesurfer fires "ready"

  const { audioUrl, status, currentTime, seek } = useStore();

  // ── Draggable first-measure pin ───────────────────────────────────────────

  const addFirstMeasurePin = useCallback((firstMeasureStart: number, duration: number) => {
    const rp = regionsRef.current;
    if (!rp || !wsReadyRef.current) return;

    // Remove existing pin
    const existing = rp.getRegions().find((r) => r.id === "__first_measure__");
    existing?.remove();

    // Build handle element — triangle label sitting above the waveform line
    const handle = document.createElement("div");
    handle.style.cssText = [
      "position: absolute",
      "top: 0",
      "left: -10px",
      "display: flex",
      "flex-direction: column",
      "align-items: center",
      "cursor: grab",
      "touch-action: none",
      "pointer-events: auto",
      "z-index: 20",
    ].join("; ");

    const badge = document.createElement("div");
    badge.textContent = "M0";
    badge.style.cssText = [
      "background: #f59e0b",
      "color: #000",
      "font-size: 9px",
      "font-weight: 700",
      "padding: 2px 5px",
      "border-radius: 3px",
      "white-space: nowrap",
      "font-family: ui-monospace, monospace",
      "line-height: 1.4",
      "user-select: none",
      "min-width: 20px",
      "text-align: center",
    ].join("; ");

    const arrow = document.createElement("div");
    arrow.style.cssText = [
      "width: 0",
      "height: 0",
      "border-left: 5px solid transparent",
      "border-right: 5px solid transparent",
      "border-top: 5px solid #f59e0b",
    ].join("; ");

    handle.appendChild(badge);
    handle.appendChild(arrow);

    const region = rp.addRegion({
      id: "__first_measure__",
      start: firstMeasureStart,
      end: firstMeasureStart,
      color: "rgba(245, 158, 11, 0.7)",
      drag: true,
      resize: false,
      content: handle,
    });

    region.on("update-end", () => {
      useStore.getState().updateRhythm({ firstMeasureStart: region.start });
    });
  }, []);

  // ── Update regions (sections) and measure markers ─────────────────────────

  const updateRegions = useCallback(
    (sections: Sections, measures: Measures, duration: number) => {
      const rp = regionsRef.current;
      if (!rp || !wsReadyRef.current) return;

      rp.clearRegions();

      // Section regions (colored background strips)
      for (const id of sections.allIds) {
        const section = sections.byId[id];
        if (section.measures.length === 0) continue;

        const first = section.measures[0];
        const last = section.measures[section.measures.length - 1];
        const start = measures.byId[first]?.time ?? 0;
        const end = getMeasureEnd(last, measures, duration);
        const color = SECTION_COLORS[section.type];

        rp.addRegion({
          id: section.id,
          start,
          end,
          color: color + "35",
          drag: false,
          resize: false,
        });
      }

      // Measure markers — prominent vertical lines with number labels
      for (const mId of measures.allIds) {
        const m = measures.byId[mId];
        const num = parseInt(mId);
        const isBeat1 = num % 4 === 0;

        // Label element — absolutely positioned so it never stacks with neighbours
        const label = document.createElement("span");
        label.textContent = mId;
        label.style.cssText = [
          "position: absolute",
          "top: 3px",
          "left: 3px",
          "font-size: 9px",
          "line-height: 1",
          "font-family: ui-monospace, monospace",
          "pointer-events: none",
          "user-select: none",
          "white-space: nowrap",
          isBeat1
            ? "color: rgba(255,255,255,0.65); font-weight: 600;"
            : "color: rgba(255,255,255,0.35);",
        ].join("; ");

        rp.addRegion({
          id: `m_${mId}`,
          start: m.time,
          end: m.time,
          color: isBeat1 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)",
          drag: false,
          resize: false,
          content: label,
        });
      }
    },
    []
  );

  // ── Initialize ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!detailRef.current || !overviewRef.current || !audioUrl || status === "idle") return;

    const container = detailRef.current;

    if (wsRef.current) {
      wsRef.current.destroy();
      wsRef.current = null;
    }
    wsReadyRef.current = false;

    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    const ws = WaveSurfer.create({
      container,
      waveColor: "hsl(239 84% 67% / 0.4)",
      progressColor: "hsl(239 84% 67%)",
      cursorColor: "hsl(239 84% 67%)",
      cursorWidth: 2,
      height: 104,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      interact: true,
      plugins: [
        regions,

        // Mouse-wheel zoom on the detail view
        ZoomPlugin.create({
          scale: 0.382, // zoom factor per scroll tick
          maxZoom: 500,
          deltaThreshold: 5,
        }),

        // Overview minimap rendered into the overview container
        MinimapPlugin.create({
          container: overviewRef.current,
          height: 48,
          waveColor: "hsl(239 84% 67% / 0.3)",
          progressColor: "hsl(239 84% 67% / 0.6)",
          overlayColor: "rgba(99 102 241 / 0.15)",
        }),
      ],
    });

    ws.load(audioUrl);

    // Mark wavesurfer as ready only after it has decoded + rendered audio.
    // If the store is already "ready" (Tone.Player finished first), re-draw
    // regions now that the waveform canvas exists.
    ws.on("ready", () => {
      wsReadyRef.current = true;
      const { sections, measures, duration, firstMeasureStart, status: s } = useStore.getState();
      if (s === "ready") {
        updateRegions(sections, measures, duration);
        addFirstMeasurePin(firstMeasureStart, duration);
      }
    });

    // Route user click/seek to Tone.js
    ws.on("interaction", (time) => seek(time));

    wsRef.current = ws;

    return () => {
      ws.destroy();
      wsRef.current = null;
      regionsRef.current = null;
      wsReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, status]);

  // ── Sync visual playhead with Tone.js ─────────────────────────────────────

  useEffect(() => {
    wsRef.current?.setTime(currentTime);
  }, [currentTime]);

  // ── Highlight loop region in the detail view ──────────────────────────────

  const updateLoopRegion = useCallback((start: number, end: number, active: boolean) => {
    const rp = regionsRef.current;
    if (!rp) return;

    // Remove existing loop highlight
    const existing = rp.getRegions().find((r) => r.id === "__loop__");
    existing?.remove();

    if (active && end > start) {
      rp.addRegion({
        id: "__loop__",
        start,
        end,
        color: "rgba(99, 102, 241, 0.15)",
        drag: false,
        resize: false,
      });
    }
  }, []);

  // ── Zoom helpers ──────────────────────────────────────────────────────────

  const zoomIn = useCallback(() => {
    const ws = wsRef.current;
    const container = detailRef.current;
    if (!ws || !container || !wsReadyRef.current) return;
    const current = zoomPxRef.current || container.clientWidth / (ws.getDuration() || 1);
    const next = Math.min(current * 2, 500);
    zoomPxRef.current = next;
    ws.zoom(next);
  }, [detailRef]);

  const zoomOut = useCallback(() => {
    const ws = wsRef.current;
    const container = detailRef.current;
    if (!ws || !container || !wsReadyRef.current) return;
    const current = zoomPxRef.current || container.clientWidth / (ws.getDuration() || 1);
    const next = Math.max(current / 2, container.clientWidth / (ws.getDuration() || 1));
    zoomPxRef.current = next;
    ws.zoom(next);
  }, [detailRef]);

  const resetZoom = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || !wsReadyRef.current) return;
    zoomPxRef.current = 0;
    ws.zoom(0);
  }, []);

  /** Zoom the detail view to fit a specific time region */
  const zoomToRegion = useCallback(
    (start: number, end: number) => {
      const ws = wsRef.current;
      const container = detailRef.current;
      if (!ws || !container || !wsReadyRef.current || end <= start) return;

      const regionDuration = end - start;
      const containerWidth = container.clientWidth || 800;
      const pxPerSecond = Math.min(containerWidth / regionDuration, 500);

      zoomPxRef.current = pxPerSecond;
      ws.zoom(pxPerSecond);

      // Scroll to region start after zoom settles
      requestAnimationFrame(() => {
        const scrollEl = container.querySelector("[part='scroll']") as HTMLElement | null;
        if (scrollEl) {
          scrollEl.scrollLeft = start * pxPerSecond;
        }
      });
    },
    [detailRef]
  );

  return { updateRegions, addFirstMeasurePin, updateLoopRegion, zoomIn, zoomOut, resetZoom, zoomToRegion };
}
