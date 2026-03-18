import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWaveform } from "@/hooks/useWaveform";
import { SECTION_COLORS } from "@/lib/constants";
import { getMeasureEnd } from "@/model/analysis";
import { SectionType } from "@/model/types";
import { useStore } from "@/store";

export function WaveformView() {
  const detailRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);

  const { updateRegions, addFirstMeasurePin, updateLoopRegion, zoomIn, zoomOut, resetZoom, zoomToRegion, isAtFullZoom, scrollMetrics, setScrollLeft } =
    useWaveform(detailRef, overviewRef);

  const maxScroll = Math.max(0, scrollMetrics.scrollWidth - scrollMetrics.clientWidth);
  const thumbPct = scrollMetrics.clientWidth > 0
    ? Math.max(8, (scrollMetrics.clientWidth / scrollMetrics.scrollWidth) * 100)
    : 100;
  const thumbLeftPct = maxScroll > 0 ? (scrollMetrics.left / maxScroll) * (100 - thumbPct) : 0;

  const { sections, measures, duration, firstMeasureStart, status, loopStart, loopEnd } = useStore();

  // Re-draw regions and pin together so the pin is never lost after a clearRegions()
  useEffect(() => {
    if (status !== "ready") return;
    updateRegions(sections, measures, duration);
    addFirstMeasurePin(firstMeasureStart);
  }, [sections, measures, duration, firstMeasureStart, status, updateRegions, addFirstMeasurePin]);

  // Update selection highlight + auto-zoom whenever the selected region changes
  useEffect(() => {
    if (status !== "ready") return;
    updateLoopRegion(loopStart, loopEnd, loopEnd > loopStart);
    if (loopEnd > loopStart) {
      zoomToRegion(loopStart, loopEnd);
    }
  }, [loopStart, loopEnd, status, updateLoopRegion, zoomToRegion]);

  const isLoading = status === "loading";
  const isReady = status === "ready";

  return (
    <div className="w-full space-y-1">
      {/* ── Detail view + zoom controls ─────────────────────────────────── */}
      <div className="relative bg-secondary/20 rounded-md overflow-hidden">
        {/* Zoom controls — top-right overlay */}
        {isReady && (
          <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 bg-background/70 backdrop-blur-sm rounded px-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={zoomIn}>
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom in (scroll wheel also works)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={zoomOut}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={resetZoom}>
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Fit full song</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center h-28 text-sm text-muted-foreground animate-pulse">
            Decoding audio…
          </div>
        )}

        {/* Detail waveform — wavesurfer renders here (includes timeline strip) */}
        <div
          ref={detailRef}
          className={isReady ? "w-full" : "hidden"}
        />

        {/* Custom scrollbar — always visible, styled consistently with app scrollbars */}
        {isReady && (
          <div className="relative h-1">
            {/* Track — transparent, matching app vertical scrollbar track */}
            <div className="absolute inset-0 rounded-full bg-transparent" />
            {/* Thumb */}
            <div
              className="absolute inset-y-0 rounded-full transition-colors"
              style={{
                left: `${thumbLeftPct}%`,
                width: `${thumbPct}%`,
                background: isAtFullZoom
                  ? "hsl(var(--border))"
                  : "hsl(var(--muted-foreground) / 0.6)",
              }}
            />
            {/* Invisible range input handles drag/click */}
            {!isAtFullZoom && (
              <input
                type="range"
                min={0}
                max={maxScroll}
                value={scrollMetrics.left}
                step={1}
                onChange={(e) => setScrollLeft(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ margin: 0 }}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Overview / minimap strip ─────────────────────────────────────── */}
      {isReady && (
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 px-1.5 z-10 pointer-events-none">
            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">
              Overview
            </span>
          </div>

          {/* Section colour overlays */}
          {duration > 0 && sections.allIds.map((id) => {
            const section = sections.byId[id];
            if (section.type === SectionType.UNDEFINED || section.measures.length === 0) return null;
            const start = measures.byId[section.measures[0]]?.time ?? 0;
            const end = getMeasureEnd(section.measures[section.measures.length - 1], measures, duration);
            const left = (start / duration) * 100;
            const width = ((end - start) / duration) * 100;
            return (
              <div
                key={id}
                className="absolute inset-y-0 z-10 pointer-events-none rounded-sm flex items-center justify-center"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: SECTION_COLORS[section.type] + "55",
                }}
              >
                <span
                  className="text-[9px] font-bold leading-none select-none"
                  style={{ color: SECTION_COLORS[section.type] }}
                >
                  {section.type.charAt(0)}
                </span>
              </div>
            );
          })}

          {/* Minimap renders into this container via the MinimapPlugin */}
          <div
            ref={overviewRef}
            className="w-full bg-secondary/20 rounded cursor-pointer overflow-hidden"
          />
        </div>
      )}
    </div>
  );
}
