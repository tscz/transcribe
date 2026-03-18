import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadProject } from "@/features/project/persistenceApi";
import { useStore } from "@/store";

import { isSignedIn, signIn, signOut } from "./auth";
import { downloadProject, DriveFile, listProjectFiles } from "./driveApi";

export function GDriveOpenDialog({ open }: { open: boolean }) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { closeDialog, loadProject: loadProjectState } = useStore();
  const navigate = useNavigate();

  const signedIn = isSignedIn();

  useEffect(() => {
    if (!open || !signedIn) return;
    setLoadingFiles(true);
    setError(null);
    listProjectFiles()
      .then(setFiles)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load files"))
      .finally(() => setLoadingFiles(false));
  }, [open, signedIn]);

  const handleOpen = async (file: DriveFile) => {
    setOpeningId(file.id);
    setError(null);
    try {
      const blob = await downloadProject(file.id);
      const f = new File([blob], file.name, { type: "application/zip" });
      const { state, audioUrl } = await loadProject(f);
      loadProjectState(state, audioUrl);
      navigate("/structure");
      closeDialog();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to open project");
    } finally {
      setOpeningId(null);
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
          <DialogTitle>Open from Google Drive</DialogTitle>
        </DialogHeader>

        {!signedIn ? (
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Connect your Google account to open projects from Drive.
            </p>
            <Button onClick={signIn} className="w-full">
              Connect Google Drive
            </Button>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            {loadingFiles && (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
            {!loadingFiles && files.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No projects found in Drive.
              </p>
            )}
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
              >
                <span className="text-sm truncate">
                  {file.name.replace(".transcription.zip", "")}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!!openingId}
                  onClick={() => handleOpen(file)}
                >
                  {openingId === file.id ? "Opening…" : "Open"}
                </Button>
              </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
          {signedIn && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleDisconnect}
              disabled={!!openingId}
            >
              Disconnect Drive
            </Button>
          )}
          <Button variant="ghost" onClick={closeDialog} disabled={!!openingId}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
