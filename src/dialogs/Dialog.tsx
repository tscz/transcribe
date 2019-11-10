import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class Dialog extends Component<
  { title: string; show: boolean; onCancel: () => void; onSubmit?: () => void },
  {}
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
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
