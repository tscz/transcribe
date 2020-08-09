import Button from "@material-ui/core/Button/Button";
import DialogManagement from "components/dialogManagement/dialogManagement";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { DialogType, openedDialog } from "states/dialog/dialogsSlice";
import { createRootReducer } from "states/store";
import { Story, storyForComponent } from "tests/Storybook";

export default storyForComponent("DialogManagement", DialogManagement);

export const OpenDialog: Story = () => {
  const store = createStore(createRootReducer, composeWithDevTools());

  return (
    <Provider store={store}>
      <DialogManagement />
      <Button onClick={() => store.dispatch(openedDialog(DialogType.OPEN))}>
        Open OpenDialog
      </Button>
    </Provider>
  );
};

export const NewDialog: Story = () => {
  const store = createStore(createRootReducer, composeWithDevTools());

  return (
    <Provider store={store}>
      <DialogManagement />
      <Button onClick={() => store.dispatch(openedDialog(DialogType.NEW))}>
        Open NewDialog
      </Button>
    </Provider>
  );
};

export const SaveDialog: Story = () => {
  const store = createStore(createRootReducer, composeWithDevTools());

  return (
    <Provider store={store}>
      <DialogManagement />
      <Button onClick={() => store.dispatch(openedDialog(DialogType.SAVE))}>
        Open SaveDialog
      </Button>
    </Provider>
  );
};
