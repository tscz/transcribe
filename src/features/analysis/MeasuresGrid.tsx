import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SECTION_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TIME_SIGNATURE_BEATS } from "@/model/types";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

export function MeasuresGrid() {
  const { measures, sections, timeSignature, loopStart, loopEnd, setLoopRegion, duration } = useStore(
    useShallow((s) => ({
      measures: s.measures,
      sections: s.sections,
      timeSignature: s.timeSignature,
      loopStart: s.loopStart,
      loopEnd: s.loopEnd,
      setLoopRegion: s.setLoopRegion,
      duration: s.duration,
    }))
  );
  const measuresPerRow = TIME_SIGNATURE_BEATS[timeSignature] * 2; // 4/4 → 8, 3/4 → 6

  // Build section color map
  const measureColors: Record<string, string> = {};
  for (const sectionId of sections.allIds) {
    const section = sections.byId[sectionId];
    for (const mId of section.measures) {
      measureColors[mId] = SECTION_COLORS[section.type];
    }
  }

  // Group measures by section
  const sectionGroups: Array<{ label: string; color: string; measureIds: string[] }> = [];
  for (const sectionId of sections.allIds) {
    const section = sections.byId[sectionId];
    if (section.measures.length === 0) continue;
    const first = section.measures[0];
    const last = section.measures[section.measures.length - 1];
    const label =
      section.type === "UNDEFINED"
        ? `m${first}–m${last}`
        : section.type.charAt(0) + section.type.slice(1).toLowerCase();
    sectionGroups.push({ label, color: SECTION_COLORS[section.type], measureIds: section.measures });
  }

  const getMeasureEnd = (mId: string) => {
    const nextId = measures.allIds[measures.allIds.indexOf(mId) + 1];
    return nextId ? measures.byId[nextId].time : duration;
  };

  const hasSelection = loopEnd > loopStart;

  const handleMeasureClick = (measureId: string) => {
    const measure = measures.byId[measureId];
    if (!measure) return;
    const mEnd = getMeasureEnd(measureId);

    if (hasSelection && measure.time > loopEnd - 0.001) {
      // Clicked AFTER current selection end → extend selection to include this measure
      setLoopRegion(loopStart, mEnd);
    } else {
      // Clicked within or before selection → start fresh single-measure selection
      setLoopRegion(measure.time, mEnd);
    }
  };

  const clearSelection = () => setLoopRegion(0, 0);

  if (measures.allIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
        No measures yet. Set BPM and tempo to generate measures.
      </div>
    );
  }

  // Find first and last selected measure IDs for display
  const selectedMeasures = hasSelection
    ? measures.allIds.filter((mId) => {
        const m = measures.byId[mId];
        const mEnd = getMeasureEnd(mId);
        return m.time >= loopStart - 0.001 && mEnd <= loopEnd + 0.001;
      })
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Selection status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 shrink-0 min-h-[32px]">
        {hasSelection ? (
          <>
            <span className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{selectedMeasures.length}</span>
              {" "}measure{selectedMeasures.length !== 1 ? "s" : ""} selected
              {selectedMeasures.length > 0 && (
                <span className="text-muted-foreground/60">
                  {" "}(m{selectedMeasures[0]}–m{selectedMeasures[selectedMeasures.length - 1]})
                </span>
              )}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-5 w-5 opacity-60 hover:opacity-100"
              onClick={clearSelection}
              title="Clear selection"
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground/60">
            Click a measure to select · click a later one to extend
          </span>
        )}
      </div>

      {/* Measure grid */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {sectionGroups.map(({ label, color, measureIds }) => (
          <div key={label + measureIds[0]} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs font-medium text-muted-foreground capitalize">{label}</span>
            </div>
            <div className="flex flex-col gap-1">
              {Array.from({ length: Math.ceil(measureIds.length / measuresPerRow) }, (_, rowIdx) =>
                measureIds.slice(rowIdx * measuresPerRow, (rowIdx + 1) * measuresPerRow)
              ).map((rowIds, rowIdx) => (
                <div key={rowIdx} className="flex gap-1">
                  {rowIds.map((mId) => {
                    const measure = measures.byId[mId];
                    if (!measure) return null;
                    const mEnd = getMeasureEnd(mId);
                    const isSelected =
                      hasSelection &&
                      measure.time >= loopStart - 0.001 &&
                      mEnd <= loopEnd + 0.001;
                    const isSelectionStart = isSelected && Math.abs(measure.time - loopStart) < 0.001;
                    const num = parseInt(mId);

                    return (
                      <button
                        key={mId}
                        onClick={() => handleMeasureClick(mId)}
                        className={cn(
                          "w-8 h-8 text-xs rounded transition-all font-mono relative",
                          "hover:scale-110 hover:z-10",
                          isSelected
                            ? "ring-2 ring-primary text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground",
                          isSelectionStart && "ring-offset-1 ring-offset-background"
                        )}
                        style={{
                          backgroundColor: color + (isSelected ? "70" : "25"),
                        }}
                        title={`Measure ${mId} @ ${measure.time.toFixed(2)}s`}
                      >
                        {isSelected || num % 4 === 0 ? mId : "·"}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
