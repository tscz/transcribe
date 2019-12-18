import React from "react";

import ModalDialog from "./modalDialog";

export default {
  title: "Components|ModalDialog",
  component: ModalDialog
};

export const Basic = () => (
  <ModalDialog
    title="Title"
    onCancel={() => {}}
    actions={[
      { label: "action1", onClick: () => {} },
      { label: "action2", onClick: () => {} },
      { label: "action3", onClick: () => {} }
    ]}
  ></ModalDialog>
);
