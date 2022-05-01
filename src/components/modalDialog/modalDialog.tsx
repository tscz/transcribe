import {
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { Component, PropsWithChildren } from "react";

export interface DialogAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ModalDialogProps {
  title: string;
  subTitle?: string;
  onCancel: () => void;
  actions?: DialogAction[];
}

class ModalDialog extends Component<PropsWithChildren<ModalDialogProps>> {
  render(): JSX.Element {
    return (
      <Dialog
        onClose={this.props.onCancel}
        open={true}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.subTitle}</DialogContentText>
          {this.props.children}
        </DialogContent>
        <DialogActions>
          {this.props.actions?.map((value) => (
            <Button
              key={value.label}
              onClick={value.onClick}
              color="primary"
              disabled={value.disabled ?? false}
            >
              {value.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

export default ModalDialog;
