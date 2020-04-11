import { action } from "@storybook/addon-actions";
import React from "react";

import ModalDialog from "./modalDialog";

export default {
  title: "Components|ModalDialog",
  component: ModalDialog
};

export const Basic = () => (
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
