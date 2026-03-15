import { Drum } from "lucide-react";
import { StubPage } from "./StubPage";

export function DrumPage() {
  return (
    <StubPage
      icon={Drum}
      title="Drums"
      description="Transcribe drum patterns with a visual beat editor."
      plannedFeatures={[
        "Grid-based beat sequencer (kick, snare, hi-hat, etc.)",
        "Pattern per measure with section grouping",
        "Ghost notes and accent notation",
        "Export as percussion notation",
      ]}
    />
  );
}
