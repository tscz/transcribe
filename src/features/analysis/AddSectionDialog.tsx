import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EDITABLE_SECTION_TYPES, SECTION_LABELS } from "@/lib/constants";
import { SectionType } from "@/model/types";
import { useStore } from "@/store";

export function AddSectionDialog({ open }: { open: boolean }) {
  const [type, setType] = useState<SectionType>(SectionType.VERSE);
  const [firstMeasure, setFirstMeasure] = useState("0");
  const [lastMeasure, setLastMeasure] = useState("0");

  const { closeDialog, addSection, measures } = useStore();
  const measureIds = measures.allIds;

  const first = parseInt(firstMeasure);
  const last = parseInt(lastMeasure);
  const valid = first <= last;

  const handleAdd = () => {
    if (!valid) return;
    addSection(type, firstMeasure, lastMeasure);
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Section Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as SectionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EDITABLE_SECTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {SECTION_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First Measure</Label>
              <Select value={firstMeasure} onValueChange={setFirstMeasure}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {measureIds.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Last Measure</Label>
              <Select
                value={lastMeasure}
                onValueChange={setLastMeasure}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {measureIds
                    .filter((id) => parseInt(id) >= first)
                    .map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!valid && (
            <p className="text-xs text-destructive">
              First measure must be ≤ last measure
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!valid || measureIds.length === 0}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
