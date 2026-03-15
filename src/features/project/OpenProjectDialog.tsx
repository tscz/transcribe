import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadProject } from "@/features/project/persistenceApi";
import { useStore } from "@/store";

export function OpenProjectDialog({ open }: { open: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { closeDialog, loadProject: loadProjectState } = useStore();
  const navigate = useNavigate();

  const handleOpen = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { state, audioUrl } = await loadProject(file);
      loadProjectState(state, audioUrl);
      navigate("/structure");
      closeDialog();
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to open project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Open Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-file">Project File</Label>
            <div className="flex gap-2">
              <Input
                id="project-file"
                readOnly
                placeholder="No file selected"
                value={file?.name ?? ""}
                className="flex-1 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Select a .zip transcription project file
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={closeDialog} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleOpen} disabled={!file || loading}>
            {loading ? "Opening…" : "Open"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
