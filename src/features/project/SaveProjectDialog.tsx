import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveProject } from "@/features/project/persistenceApi";
import { PersistedState } from "@/model/types";
import { useStore } from "@/store";

export function SaveProjectDialog({ open }: { open: boolean }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { closeDialog, title, bpm, timeSignature, duration, firstMeasureStart, sections, measures, audioUrl } =
    useStore();

  const handleSave = async () => {
    if (!audioUrl) return;
    setSaving(true);
    setError(null);
    try {
      const state: PersistedState = {
        title,
        bpm,
        timeSignature,
        duration,
        firstMeasureStart,
        sections,
        measures,
      };
      await saveProject(state, audioUrl);
      closeDialog();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>
            Downloads a <code className="text-xs bg-secondary px-1 rounded">.zip</code> file
            containing your transcription and audio. You can reopen it later.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="ghost" onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
