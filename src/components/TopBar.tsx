import { AudioLines, CloudDownload, CloudUpload, FolderOpen, Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStore } from "@/store";

export function TopBar() {
  const { status, title, openDialog } = useStore();
  const navigate = useNavigate();
  const isReady = status === "ready";

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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openDialog("gdrive-open")}
            >
              <CloudDownload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open from Google Drive</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isReady}
              onClick={() => openDialog("gdrive-save")}
            >
              <CloudUpload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save to Google Drive</TooltipContent>
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
