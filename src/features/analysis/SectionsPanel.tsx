import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EDITABLE_SECTION_TYPES, SECTION_COLORS, SECTION_LABELS } from "@/lib/constants";
import { sectionBorders } from "@/model/analysis";
import { SectionType } from "@/model/types";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

export function SectionsPanel() {
  const { sections, removeSection, updateSection, openDialog } = useStore(
    useShallow((s) => ({
      sections: s.sections,
      removeSection: s.removeSection,
      updateSection: s.updateSection,
      openDialog: s.openDialog,
    }))
  );

  if (sections.allIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground gap-3">
        <p>No sections defined yet.</p>
        <Button size="sm" onClick={() => openDialog("addSection")}>
          Add Section
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium w-6" />
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Type</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Start</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">End</th>
              <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Measures</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {sections.allIds.map((id, idx) => {
              const section = sections.byId[id];
              const { first, last } = sectionBorders(section);
              const isUndefined = section.type === SectionType.UNDEFINED;
              const color = SECTION_COLORS[section.type];

              // Measures this section can expand into without overlapping named sections
              const prevSection = idx > 0 ? sections.byId[sections.allIds[idx - 1]] : null;
              const nextSection = idx < sections.allIds.length - 1 ? sections.byId[sections.allIds[idx + 1]] : null;
              const prevUndefined = prevSection?.type === SectionType.UNDEFINED ? prevSection.measures : [];
              const nextUndefined = nextSection?.type === SectionType.UNDEFINED ? nextSection.measures : [];
              const validStarts = [...prevUndefined, ...section.measures].filter((m) => parseInt(m) <= last);
              const validEnds = [...section.measures, ...nextUndefined].filter((m) => parseInt(m) >= first);

              return (
                <tr key={id} className="group border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  {/* Color swatch */}
                  <td className="px-3 py-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </td>

                  {/* Type */}
                  <td className="px-3 py-2">
                    {isUndefined ? (
                      <span className="text-muted-foreground text-xs italic">Undefined</span>
                    ) : (
                      <Select
                        value={section.type}
                        onValueChange={(v) =>
                          updateSection(id, v as SectionType, String(first), String(last))
                        }
                      >
                        <SelectTrigger className="h-7 text-xs border-0 bg-transparent p-0 w-28 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EDITABLE_SECTION_TYPES.map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">
                              {SECTION_LABELS[t]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>

                  {/* First measure */}
                  <td className="px-3 py-2">
                    {isUndefined ? (
                      <span className="text-xs text-muted-foreground">{first}</span>
                    ) : (
                      <Select
                        value={String(first)}
                        onValueChange={(v) =>
                          updateSection(id, section.type, v, String(last))
                        }
                      >
                        <SelectTrigger className="h-7 text-xs border-0 bg-transparent p-0 w-16 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {validStarts.map((m) => (
                            <SelectItem key={m} value={m} className="text-xs">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>

                  {/* Last measure */}
                  <td className="px-3 py-2">
                    {isUndefined ? (
                      <span className="text-xs text-muted-foreground">{last}</span>
                    ) : (
                      <Select
                        value={String(last)}
                        onValueChange={(v) =>
                          updateSection(id, section.type, String(first), v)
                        }
                      >
                        <SelectTrigger className="h-7 text-xs border-0 bg-transparent p-0 w-16 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {validEnds.map((m) => (
                            <SelectItem key={m} value={m} className="text-xs">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>

                  {/* Measure count */}
                  <td className="px-3 py-2">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {section.measures.length}
                    </Badge>
                  </td>

                  {/* Delete */}
                  <td className="px-2 py-2">
                    {!isUndefined && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive"
                        onClick={() => removeSection(id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-border">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => openDialog("addSection")}
        >
          Add Section
        </Button>
      </div>
    </div>
  );
}
