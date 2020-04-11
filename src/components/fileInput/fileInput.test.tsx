import { IconButton, InputBase } from "@material-ui/core";
import { mount } from "enzyme";
import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import FileInput, { FileType } from "./fileInput";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <FileInput id="zipFileInput" fileType={FileType.ZIP} callback={() => {}} />
  );
});

it("can select a file from local disk", () => {
  const mockCallback = jest.fn();
  const mockUrl = "http://fileurl";
  const mockFile = new File([""], "project.zip");

  //Mock creating objectURL in the Browser
  (global as any).URL.createObjectURL = jest.fn(() => mockUrl);

  //Render test component
  const wrapper = mount(
    <FileInput
      id="zipFileInput"
      fileType={FileType.ZIP}
      callback={mockCallback}
    />
  );

  // Invoke change event (i.e. selection of a file in the OS specific file input dialog)
  wrapper.find("input#zipFileInput").simulate("change", {
    target: {
      files: createFileList([mockFile])
    }
  });

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback.mock.calls[0][0].name).toEqual(mockFile.name);
  expect(mockCallback.mock.calls[0][1]).toEqual(mockUrl);
});

it("triggers the os file input dialog on icon button and text input click", () => {
  //Render test component
  const wrapper = mount(
    <FileInput id="zipFileInput" fileType={FileType.ZIP} callback={() => {}} />
  );
  const inputClickMock = jest.fn();
  wrapper
    .find("input#zipFileInput")
    .getDOMNode<HTMLInputElement>().onclick = inputClickMock;

  // Click on the icon button
  wrapper.find(IconButton).simulate("click", {
    target: {
      files: null
    }
  });
  expect(inputClickMock).toHaveBeenCalledTimes(1);

  // Click on the text input
  inputClickMock.mockReset();
  wrapper.find(InputBase).simulate("click", {
    target: {
      files: null
    }
  });
  expect(inputClickMock).toHaveBeenCalledTimes(1);
});

it("does not select a file if file chooser dialog is canceled", () => {
  const mockCallback = jest.fn(() => {});

  //Render test component
  const wrapper = mount(
    <FileInput
      id="zipFileInput"
      fileType={FileType.ZIP}
      callback={mockCallback}
    />
  );

  // Simulate canceling by sending event with files=null
  wrapper.find("input#zipFileInput").simulate("change", {
    target: {
      files: null
    }
  });

  expect(mockCallback).not.toBeCalled();
});

it("can be filtered for audio file types", () => {
  const wrapper = mount(
    <FileInput
      id="audioFileInput"
      fileType={FileType.AUDIO}
      callback={() => {}}
    />
  );

  expect(wrapper.find("input#audioFileInput").props().accept).toEqual(
    "audio/*"
  );
  expect(wrapper.find(InputBase).props().placeholder).toEqual(
    "Choose Audio File ..."
  );
});

it("can be filtered for zip file types", () => {
  const wrapper = mount(
    <FileInput id="zipFileInput" fileType={FileType.ZIP} callback={() => {}} />
  );

  expect(wrapper.find("input#zipFileInput").props().accept).toEqual(".zip");
  expect(wrapper.find(InputBase).props().placeholder).toEqual(
    "Choose Project Zip File ..."
  );
});

const createFileList = (files: File[]): FileList => {
  return {
    length: files.length,
    item: (index: number) => files[index],
    *[Symbol.iterator]() {
      for (let i = 0; i < files.length; i++) {
        yield files[i];
      }
    },
    ...files
  };
};
