import Button from "@material-ui/core/Button/Button";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import DialogManagement from "../../components/dialogManagement/dialogManagement";
import { DialogType, openedDialog } from "../../states/dialog/dialogsSlice";
import { createRootReducer } from "../../states/store";

export default {
  title: "Components|DialogManagement",
  component: DialogManagement
};

export const OpenDialog = () => {
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

export const NewDialog = () => {
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

export const SaveDialog = () => {
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
