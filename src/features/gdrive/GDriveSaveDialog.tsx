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
import { buildProjectZip } from "@/features/project/persistenceApi";
import { PersistedState } from "@/model/types";
import { useStore } from "@/store";

import { isSignedIn, signIn, signOut } from "./auth";
import { findProjectByName, uploadProject } from "./driveApi";

export function GDriveSaveDialog({ open }: { open: boolean }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    closeDialog,
    title,
    bpm,
    timeSignature,
    duration,
    firstMeasureStart,
    sections,
    measures,
    audioUrl,
  } = useStore();

  const signedIn = isSignedIn();

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
      const zipBlob = await buildProjectZip(state, audioUrl);
      const existingId = await findProjectByName(title);
      await uploadProject(title, zipBlob, existingId);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        closeDialog();
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save to Drive");
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = () => {
    signOut();
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Google Drive</DialogTitle>
          {signedIn && (
            <DialogDescription>
              Saves{" "}
              <code className="text-xs bg-secondary px-1 rounded">
                {title}.transcription.zip
              </code>{" "}
              to your Google Drive.
            </DialogDescription>
          )}
        </DialogHeader>

        {!signedIn ? (
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Connect your Google account to save projects to Drive.
            </p>
            <Button onClick={signIn} className="w-full">
              Connect Google Drive
            </Button>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Saved to Drive!
              </p>
            )}
          </div>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
          {signedIn && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleDisconnect}
              disabled={saving}
            >
              Disconnect Drive
            </Button>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            {signedIn && (
              <Button onClick={handleSave} disabled={saving || saved}>
                {saving ? "Saving…" : "Save to Drive"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
