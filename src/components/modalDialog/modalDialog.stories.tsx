import { action } from "@storybook/addon-actions";
import React from "react";
import { Story, storyForComponent } from "tests/Storybook";

import ModalDialog from "./modalDialog";

export default storyForComponent("ModalDialog", ModalDialog);

export const Basic: Story = () => (
  <ModalDialog
    title="Title"
    onCancel={action("onCancel")}
    actions={[
      { label: "action1", onClick: action("action1 onClick") },
      { label: "action2", onClick: action("action2 onClick") },
      { label: "action3", onClick: action("action3 onClick") }
    ]}
  ></ModalDialog>
);
