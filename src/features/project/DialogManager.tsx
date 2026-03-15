import { AddSectionDialog } from "@/features/analysis/AddSectionDialog";
import { useStore } from "@/store";

import { NewProjectDialog } from "./NewProjectDialog";
import { OpenProjectDialog } from "./OpenProjectDialog";
import { SaveProjectDialog } from "./SaveProjectDialog";

export function DialogManager() {
  const currentDialog = useStore((s) => s.currentDialog);

  return (
    <>
      <NewProjectDialog open={currentDialog === "new"} />
      <OpenProjectDialog open={currentDialog === "open"} />
      <SaveProjectDialog open={currentDialog === "save"} />
      <AddSectionDialog open={currentDialog === "addSection"} />
    </>
  );
}
