import { IconButton, InputBase } from "@material-ui/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import TestEnvironment from "tests/TestEnvironment";

import FileInput, { FileType } from "./fileInput";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <FileInput id="zipFileInput" fileType={FileType.ZIP} callback={() => {}} />
  );
});

type CustomNodeJsGlobal =
  | typeof globalThis
  | {
      URL: {
        createObjectURL: () => string;
      };
    };
declare const global: CustomNodeJsGlobal;

it("can select a file from local disk", () => {
  const mockCallback = jest.fn();
  const mockUrl = "https://fileurl";
  const mockFile = new File([""], "project.zip");

  //Mock creating objectURL in the Browser
  global.URL.createObjectURL = jest.fn(() => mockUrl);

  //Render test component
  render(
    <FileInput
      id="id"
      data-testid="zipFileInput"
      fileType={FileType.ZIP}
      callback={mockCallback}
    />
  );
  const user = userEvent.setup();

  // Invoke change event (i.e. selection of a file in the OS specific file input dialog)

  user.upload(screen.getByLabelText("Choose Project Zip File"), [mockFile]);

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback.mock.calls[0][0].name).toEqual(mockFile.name);
  expect(mockCallback.mock.calls[0][1]).toEqual(mockUrl);
});

it("triggers the os file input dialog on icon button and text input click", () => {
  //Render test component
  render(
    <FileInput id="zipFileInput" fileType={FileType.ZIP} callback={() => {}} />
  );
});

it("does not select a file if file chooser dialog is canceled", () => {});

it("can be filtered for audio file types", () => {});

it("can be filtered for zip file types", () => {});
