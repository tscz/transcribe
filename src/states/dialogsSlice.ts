import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DialogState {
  readonly currentDialog: DialogType;
}

export enum DialogType {
  NONE = "none",
  NEW = "new",
  OPEN = "open",
  SAVE = "save",
  ADD_SECTION = "add_section"
}

const initialDialogState: DialogState = {
  currentDialog: DialogType.NONE
};

const dialogsSlice = createSlice({
  name: "dialogs",
  initialState: initialDialogState,
  reducers: {
    openedDialog(state, action: PayloadAction<DialogType>) {
      state.currentDialog = action.payload;
    },
    closedDialog(state) {
      state.currentDialog = DialogType.NONE;
    }
  }
});

export const { openedDialog, closedDialog } = dialogsSlice.actions;

export default dialogsSlice.reducer;
