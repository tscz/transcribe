import { DialogActions, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Component } from "react";
import React from "react";

interface DialogAction {
  label: string;
  onClick: () => void;
}

interface ModalDialogProps {
  title: string;
  onCancel: () => void;
  actions?: DialogAction[];
}

class ModalDialog extends Component<ModalDialogProps> {
  render() {
    return (
      <Dialog
        onClose={this.props.onCancel}
        open={true}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>{this.props.children}</DialogContent>
        <DialogActions>
          {this.props.actions?.map((value, index) => (
            <Button key={value.label} onClick={value.onClick} color="primary">
              {value.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

export default ModalDialog;
