import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWaveform } from "@/hooks/useWaveform";
import { useStore } from "@/store";

export function WaveformView() {
  const detailRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);

  const { updateRegions, addFirstMeasurePin, updateLoopRegion, zoomIn, zoomOut, resetZoom, zoomToRegion } =
    useWaveform(detailRef, overviewRef);

  const { sections, measures, duration, firstMeasureStart, status, loopStart, loopEnd } = useStore();

  // Re-draw regions and pin together so the pin is never lost after a clearRegions()
  useEffect(() => {
    if (status !== "ready") return;
    updateRegions(sections, measures, duration);
    addFirstMeasurePin(firstMeasureStart, duration);
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
      </div>

      {/* ── Overview / minimap strip ─────────────────────────────────────── */}
      {isReady && (
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 px-1.5 z-10 pointer-events-none">
            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">
              Overview
            </span>
          </div>
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
