import { Component } from "react";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface DialogProps {
  title: string;
  onCancel: () => void;
  onSubmit?: () => void;
}

class Dialog extends Component<DialogProps> {
  render() {
    return (
      <Modal show={true} onHide={this.props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={this.props.onSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Dialog;
