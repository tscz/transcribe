import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Component } from "react";
import React from "react";

interface DialogProps {
  title: string;
  onCancel: () => void;
  onSubmit?: () => void;
}

class Dialog2 extends Component<DialogProps> {
  render() {
    return (
      <Dialog
        onClose={this.props.onCancel}
        aria-labelledby="simple-dialog-title"
        open={true}
      >
        <DialogTitle id="simple-dialog-title">{this.props.title}</DialogTitle>

        {this.props.children}

        <Button variant="contained" onClick={this.props.onSubmit}>
          Create
        </Button>
      </Dialog>
    );
  }
}

export default Dialog2;
