import { Printer } from "lucide-react";
import { StubPage } from "./StubPage";

export function PrintPage() {
  return (
    <StubPage
      icon={Printer}
      title="Print"
      description="Generate a lead sheet combining structure, harmony, and notation for printing or PDF export."
      plannedFeatures={[
        "Full score rendering via OpenSheetMusicDisplay",
        "Configurable layout (A4, Letter, real book style)",
        "Include/exclude sections by type",
        "Print or download as PDF",
      ]}
    />
  );
}
