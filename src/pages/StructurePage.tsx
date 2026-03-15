import { AddSectionDialog } from "@/features/analysis/AddSectionDialog";
import { MeasuresGrid } from "@/features/analysis/MeasuresGrid";
import { PropertiesPanel } from "@/features/analysis/PropertiesPanel";
import { SectionsPanel } from "@/features/analysis/SectionsPanel";
import { PlayerControls } from "@/features/audio/PlayerControls";
import { WaveformView } from "@/features/waveform/WaveformView";
import { useStore } from "@/store";

function PanelCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col bg-card border border-border rounded-lg overflow-hidden ${className ?? ""}`}>
      <div className="px-4 py-2.5 border-b border-border bg-secondary/30 shrink-0">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export function StructurePage() {
  const currentDialog = useStore((s) => s.currentDialog);

  return (
    <>
      {/* Desktop: 2×2 grid */}
      <div className="hidden md:grid md:grid-cols-[3fr_2fr] md:grid-rows-[auto_1fr] h-full gap-3 p-3">
        {/* Top-left: Waveform + player */}
        <PanelCard title="Song Overview">
          <div className="p-3 space-y-3">
            <WaveformView />
            <PlayerControls />
          </div>
        </PanelCard>

        {/* Top-right: Measures */}
        <PanelCard title="Song Measures">
          <MeasuresGrid />
        </PanelCard>

        {/* Bottom-left: Sections */}
        <PanelCard title="Song Sections">
          <SectionsPanel />
        </PanelCard>

        {/* Bottom-right: Properties */}
        <PanelCard title="Song Properties">
          <PropertiesPanel />
        </PanelCard>
      </div>

      {/* Mobile: stacked panels */}
      <div className="md:hidden flex flex-col gap-3 p-3 pb-6">
        <PanelCard title="Now Playing">
          <div className="p-3 space-y-3">
            <WaveformView />
            <PlayerControls />
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
