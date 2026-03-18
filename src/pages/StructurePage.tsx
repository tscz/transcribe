import { Repeat, SlidersHorizontal } from "lucide-react";

import { AddSectionDialog } from "@/features/analysis/AddSectionDialog";
import { MeasuresGrid } from "@/features/analysis/MeasuresGrid";
import { PropertiesPanel } from "@/features/analysis/PropertiesPanel";
import { SectionsPanel } from "@/features/analysis/SectionsPanel";
import { PlayerControls } from "@/features/audio/PlayerControls";
import { WaveformView } from "@/features/waveform/WaveformView";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatTime } from "@/lib/utils";
import { TIME_SIGNATURE_LABELS } from "@/model/types";
import { useStore } from "@/store";

function SongStats() {
  const bpm = useStore((s) => s.bpm);
  const timeSignature = useStore((s) => s.timeSignature);
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
      <span>{bpm} BPM</span>
      <span className="opacity-40">·</span>
      <span>{TIME_SIGNATURE_LABELS[timeSignature]}</span>
    </span>
  );
}

function PanelCard({
  title,
  headerAction,
  children,
  className,
}: {
  title: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col bg-card border border-border rounded-lg overflow-hidden ${className ?? ""}`}>
      <div className="px-4 py-2.5 border-b border-border bg-secondary/30 shrink-0 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
        {headerAction}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function SelectionDisplay() {
  const loopStart = useStore((s) => s.loopStart);
  const loopEnd = useStore((s) => s.loopEnd);
  const hasSelection = loopEnd > loopStart;

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums shrink-0">
      <Repeat className="h-3.5 w-3.5 shrink-0" />
      {hasSelection ? `${formatTime(loopStart)} / ${formatTime(loopEnd)}` : "– / –"}
    </span>
  );
}

export function StructurePage() {
  const currentDialog = useStore((s) => s.currentDialog);

  return (
    <>
      {/* Desktop: 2-row left column, Measures spanning full height on right */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto] md:grid-rows-[auto_1fr] h-full gap-3 p-3">
        {/* Top-left: Waveform + player, properties in header popover */}
        <PanelCard
          title="Song Overview"
          headerAction={
            <div className="flex items-center gap-3">
              <SongStats />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Song Properties
                  </p>
                  <PropertiesPanel />
                </PopoverContent>
              </Popover>
            </div>
          }
        >
          <div className="p-3 space-y-3">
            <WaveformView />
            <div className="flex items-center justify-between gap-3">
              <PlayerControls />
              <SelectionDisplay />
            </div>
          </div>
        </PanelCard>

        {/* Right column: Measures spans both rows */}
        <PanelCard title="Song Measures" className="md:row-span-2">
          <MeasuresGrid />
        </PanelCard>

        {/* Bottom-left: Sections */}
        <PanelCard title="Song Sections">
          <SectionsPanel />
        </PanelCard>
      </div>

      {/* Mobile: stacked panels */}
      <div className="md:hidden flex flex-col gap-3 p-3 pb-6">
        <PanelCard title="Now Playing">
          <div className="p-3 space-y-3">
            <WaveformView />
            <div className="flex items-center justify-between gap-3">
              <PlayerControls />
              <SelectionDisplay />
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Song Properties">
          <PropertiesPanel />
        </PanelCard>

        <PanelCard title="Song Sections">
          <SectionsPanel />
        </PanelCard>

        <PanelCard title="Song Measures">
          <MeasuresGrid />
        </PanelCard>
      </div>

      {/* Add section dialog */}
      <AddSectionDialog open={currentDialog === "addSection"} />
    </>
  );
}
