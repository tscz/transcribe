export interface DialogState {
  readonly currentDialog: DialogType;
}

export enum DialogActionTypes {
  OPEN = "DIALOG_OPEN"
}

export enum DialogType {
  NONE = "none",
  NEW = "new",
  OPEN = "open",
  SAVE = "save"
}
