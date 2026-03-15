import { AudioLines, FolderOpen, Plus, Redo2, Save, Undo2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStore, useTemporalStore } from "@/store";

const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
const modKey = isMac ? "⌘" : "Ctrl+";

export function TopBar() {
  const { status, title, openDialog } = useStore();
  const navigate = useNavigate();
  const isReady = status === "ready";

  const { undo, redo, pastStates, futureStates } = useTemporalStore((s) => s);
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <header className="flex items-center h-14 px-4 border-b border-border bg-card shrink-0 gap-3">
      {/* Logo (mobile only) */}
      <div className="flex items-center gap-2 md:hidden">
        <AudioLines className="text-primary h-5 w-5" />
        <span className="font-semibold text-sm">Transcribe</span>
      </div>

      <Separator orientation="vertical" className="h-5 md:hidden" />

      {/* Project actions */}
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openDialog("new")}
            >
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => { openDialog("open"); navigate("/structure"); }}
            >
              <FolderOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isReady}
              onClick={() => openDialog("save")}
            >
              <Save />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save project</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-5" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!canUndo}
              onClick={() => undo()}
            >
              <Undo2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo ({modKey}Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!canRedo}
              onClick={() => redo()}
            >
              <Redo2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo ({modKey}⇧Z)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-5" />

      {/* Project title */}
      {isReady && title && (
        <span className="text-sm text-muted-foreground truncate max-w-xs">
          {title}
        </span>
      )}
    </header>
  );
}
