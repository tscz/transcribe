import { mount } from "enzyme";
import React from "react";

import TestEnvironment from "../../tests/TestEnvironment";
import FileInput, { FileType } from "./fileInput";

it("renders without crashing", () => {
  TestEnvironment.smokeTest(
    <FileInput
      id="zipFileInput"
      fileType={FileType.ZIP}
      callback={(file, fileUrl) => {}}
    />
  );
});

it("can select a file from local disk", () => {
  const mockCallback = jest.fn((file: File, fileURL: string) => {});
  const mockUrl = "http://fileurl";
  const mockFile = new File([""], "project.zip");

  //Mock creating objectURL in the Browser
  (global as any).URL.createObjectURL = jest.fn(file => mockUrl);

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
