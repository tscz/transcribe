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
import { useStore } from "@/store";

export function NewProjectDialog({ open }: { open: boolean }) {
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { closeDialog, createProject } = useStore();
  const navigate = useNavigate();

  const canCreate = title.trim().length > 0 && audioFile !== null;

  const handleCreate = async () => {
    if (!audioFile || !canCreate) return;
    setLoading(true);
    try {
      const audioUrl = URL.createObjectURL(audioFile);

      // Decode audio to get duration
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioCtx = new AudioContext();
      const buffer = await audioCtx.decodeAudioData(arrayBuffer);
      audioCtx.close();

      createProject(title.trim(), audioUrl, buffer.duration);
      navigate("/structure");
      closeDialog();
      setTitle("");
      setAudioFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              placeholder="My Song"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canCreate && handleCreate()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio-file">Audio File</Label>
            <div className="flex gap-2">
              <Input
                id="audio-file"
                readOnly
                placeholder="No file selected"
                value={audioFile?.name ?? ""}
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
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: MP3, WAV, OGG, M4A
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={closeDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!canCreate || loading}
          >
            {loading ? "Loading…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
