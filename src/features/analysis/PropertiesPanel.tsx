import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BPM_MAX, BPM_MIN } from "@/lib/constants";
import { TIME_SIGNATURE_LABELS, TimeSignatureType } from "@/model/types";
import { useStore } from "@/store";

export function PropertiesPanel() {
  const {
    bpm,
    timeSignature,
    firstMeasureStart,
    updateRhythm,
  } = useStore();

  return (
    <div className="space-y-5">
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
        <p className="text-xs text-muted-foreground/60 leading-snug">
          Drag the <span className="text-amber-400 font-medium">M0</span> marker on the waveform to adjust.
        </p>
      </div>
    </div>
  );
}
