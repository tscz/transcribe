import { cn } from "@/lib/utils";
import { MEASURES_PER_ROW, SECTION_COLORS } from "@/lib/constants";
import { useStore } from "@/store";

export function MeasuresGrid() {
  const { measures, sections, isLooping, loopStart, loopEnd, setLoopRegion } = useStore();

  // Build a map: measureId → section color
  const measureColors: Record<string, string> = {};
  for (const sectionId of sections.allIds) {
    const section = sections.byId[sectionId];
    for (const mId of section.measures) {
      measureColors[mId] = SECTION_COLORS[section.type];
    }
  }

  // Group measures by section for labeling
  const sectionGroups: Array<{ label: string; color: string; measureIds: string[] }> = [];
  for (const sectionId of sections.allIds) {
    const section = sections.byId[sectionId];
    if (section.measures.length === 0) continue;
    const first = section.measures[0];
    const label =
      section.type === "UNDEFINED"
        ? `m${first}–m${section.measures[section.measures.length - 1]}`
        : `${section.type.charAt(0)}${section.type.slice(1).toLowerCase()}`;
    sectionGroups.push({
      label,
      color: SECTION_COLORS[section.type],
      measureIds: section.measures,
    });
  }

  const handleMeasureClick = (measureId: string) => {
    const measure = measures.byId[measureId];
    if (!measure) return;
    const nextId = measures.allIds[measures.allIds.indexOf(measureId) + 1];
    const end = nextId ? measures.byId[nextId].time : useStore.getState().duration;

    if (isLooping && measure.time <= loopEnd && measure.time >= loopStart) {
      // Extend loop end
      setLoopRegion(loopStart, end);
    } else {
      // Start fresh loop at this measure
      setLoopRegion(measure.time, end);
    }
  };

  if (measures.allIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
        No measures yet. Set BPM and tempo to generate measures.
      </div>
    );
  }

  return (
    <div className="overflow-auto p-3 space-y-4">
      {sectionGroups.map(({ label, color, measureIds }) => (
        <div key={label + measureIds[0]} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs font-medium text-muted-foreground capitalize">{label}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {measureIds.map((mId) => {
              const measure = measures.byId[mId];
              if (!measure) return null;
              const nextId = measures.allIds[measures.allIds.indexOf(mId) + 1];
              const mEnd = nextId
                ? measures.byId[nextId].time
                : useStore.getState().duration;
              const inLoop =
                isLooping && measure.time >= loopStart && mEnd <= loopEnd;

              return (
                <button
                  key={mId}
                  onClick={() => handleMeasureClick(mId)}
                  className={cn(
                    "w-8 h-8 text-xs rounded transition-all font-mono",
                    "hover:scale-110 hover:z-10 relative",
                    inLoop
                      ? "ring-2 ring-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{
                    backgroundColor: color + (inLoop ? "60" : "25"),
                  }}
                  title={`Measure ${mId} @ ${measure.time.toFixed(2)}s`}
                >
                  {parseInt(mId) % MEASURES_PER_ROW === 0 ? mId : "·"}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
