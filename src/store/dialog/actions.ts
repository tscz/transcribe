import { DialogActionTypes, DialogType } from "./types";

/** Open modal dialog. */
export const openDialog = (dialog: DialogType) => ({
  type: DialogActionTypes.OPEN,
  payload: dialog
});

export const closeDialog = () => ({
  type: DialogActionTypes.OPEN,
  payload: DialogType.NONE
});
