import { useEffect, useRef } from "react";

import { useWaveform } from "@/hooks/useWaveform";
import { useStore } from "@/store";

export function WaveformView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { updateRegions } = useWaveform(containerRef);

  const { sections, measures, duration, status } = useStore();

  // Update regions whenever sections/measures change
  useEffect(() => {
    if (status !== "ready") return;
    updateRegions(sections, measures, duration);
  }, [sections, measures, duration, status, updateRegions]);

  return (
    <div className="w-full bg-secondary/30 rounded-md overflow-hidden">
      {status === "loading" && (
        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground animate-pulse">
          Decoding audio…
        </div>
      )}
      <div
        ref={containerRef}
        className={status !== "ready" ? "hidden" : undefined}
      />
    </div>
  );
}
