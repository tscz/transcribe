import { Music2 } from "lucide-react";
import { StubPage } from "./StubPage";

export function HarmonyPage() {
  return (
    <StubPage
      icon={Music2}
      title="Harmony"
      description="Transcribe chord progressions and harmonic analysis for each section of the song."
      plannedFeatures={[
        "Chord entry per measure (Roman numeral or chord name)",
        "Interactive circle of fifths tool",
        "Key detection and modulation tracking",
        "Export chord chart",
      ]}
    />
  );
}
