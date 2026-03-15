import { Guitar } from "lucide-react";
import { StubPage } from "./StubPage";

export function GuitarPage() {
  return (
    <StubPage
      icon={Guitar}
      title="Guitar"
      description="Transcribe guitar parts using tablature and standard notation."
      plannedFeatures={[
        "Interactive tab editor (6-string, standard/drop tunings)",
        "Barre and open chord diagrams",
        "Picking pattern and strumming notation",
        "Sync tab to waveform regions",
      ]}
    />
  );
}
