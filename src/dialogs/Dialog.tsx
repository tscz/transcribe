import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
  title: string;
  show: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
}

class Dialog extends Component<Props> {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onCancel}>
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
