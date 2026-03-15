import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { BPM_MAX, BPM_MIN } from "@/lib/constants";
import { TIME_SIGNATURE_LABELS, TimeSignatureType } from "@/model/types";
import { useStore } from "@/store";

export function PropertiesPanel() {
  const {
    bpm,
    timeSignature,
    firstMeasureStart,
    syncFirstMeasureStart,
    updateRhythm,
    setSyncFirstMeasureStart,
  } = useStore();

  return (
    <div className="space-y-5 p-4">
      {/* BPM */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label>Tempo</Label>
          <span className="text-sm tabular-nums font-medium">{bpm} BPM</span>
        </div>
        <Slider
          min={BPM_MIN}
          max={BPM_MAX}
          step={1}
          value={[bpm]}
          onValueChange={([v]) => updateRhythm({ bpm: v })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{BPM_MIN}</span>
          <span>{BPM_MAX}</span>
        </div>
      </div>

      {/* Time signature */}
      <div className="space-y-2">
        <Label>Time Signature</Label>
        <Select
          value={timeSignature}
          onValueChange={(v) => updateRhythm({ timeSignature: v as TimeSignatureType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TimeSignatureType).map((ts) => (
              <SelectItem key={ts} value={ts}>
                {TIME_SIGNATURE_LABELS[ts]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* First measure start */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>First Measure</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {firstMeasureStart.toFixed(2)}s
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
          <Switch
            checked={syncFirstMeasureStart}
            onCheckedChange={setSyncFirstMeasureStart}
            id="sync-measure"
          />
          <Label htmlFor="sync-measure" className="cursor-pointer text-xs leading-snug">
            {syncFirstMeasureStart
              ? "Click waveform to set measure 0"
              : "Sync to waveform click"}
          </Label>
        </div>
      </div>
    </div>
  );
}
