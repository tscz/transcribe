import { AudioLines, FolderOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStore } from "@/store";

export function LandingPage() {
  const openDialog = useStore((s) => s.openDialog);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="max-w-sm space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
            <AudioLines className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Transcribe</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Load an audio file, map out its structure, and build your transcription —
            all in the browser.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button className="w-full gap-2" onClick={() => openDialog("new")}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => openDialog("open")}
          >
            <FolderOpen className="h-4 w-4" />
            Open Project
          </Button>
        </div>

        {/* Feature hints */}
        <ul className="text-xs text-muted-foreground space-y-1.5 text-left">
          {[
            "Interactive waveform with section regions",
            "BPM detection and measure distribution",
            "Adjustable playback speed and pitch",
            "Save and reload projects as .zip",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
