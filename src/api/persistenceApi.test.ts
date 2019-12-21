import FileSaver from "file-saver";
import JSZip from "jszip";

import { initialAnalysisState } from "../states/analysisSlice";
import { initialProjectState } from "../states/projectSlice";
import { PersistedState } from "../states/store";
import PersistenceApi from "./persistenceApi";

const expectedMp3 = "mp3content";

// Mock fetch API by returning a dummy mp3 blob
(global as any).fetch = (url: string) => {
  return new Promise<Response>(resolve =>
    resolve(new Response(new Blob([expectedMp3])))
  );
};

// Mock file-saver's saveAs() function
jest.mock("file-saver");
const mockedSaveAs = FileSaver.saveAs as jest.Mock<typeof saveAs>;

it("can save a transcription", async () => {
  let expectedState: PersistedState = {
    analysis: initialAnalysisState,
    project: initialProjectState
  };

  // Trigger save API
  await PersistenceApi.save("project.zip", {
    mp3url: "song.mp3",
    state: expectedState
  });

  // Verify produced Zip file
  const createdZip = mockedSaveAs.mock.calls[0][0];
  let zip = await JSZip.loadAsync(createdZip);
  let json = zip.file("state.json");
  let mp3 = zip.file("song.mp3");

  expect(zip.files).toEqual({
    "song.mp3": expect.anything(),
    "state.json": expect.anything()
  });

  let persistedState = await json
    .async("text")
    .then(content => JSON.parse(content));
  expect(persistedState).toEqual(expectedState);

  let persistedMp3 = await mp3.async("text");
  expect(persistedMp3).toEqual(expectedMp3);
});
