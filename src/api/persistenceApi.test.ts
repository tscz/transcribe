import FileSaver from "file-saver";
import JSZip from "jszip";

import { initialAnalysisState } from "../states/analysisSlice";
import { initialProjectState } from "../states/projectSlice";
import { PersistedState } from "../states/store";
import PersistenceApi from "./persistenceApi";

const expectedAudioContent = "expectedAudioContent";

async function contentOf(blob: Blob) {
  let text = await new Response(blob).text();
  return text;
}

// Mock fetch API by returning a dummy audio blob
(global as any).fetch = (url: string) => {
  return new Promise<Response>(resolve =>
    resolve(new Response(new Blob([expectedAudioContent])))
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
    audioFileUrl: "song.blob",
    state: expectedState
  });

  // Verify produced Zip file
  const createdZip = mockedSaveAs.mock.calls[0][0];
  let zip = await JSZip.loadAsync(createdZip);
  let json = zip.file("state.json");
  let audioBlob = zip.file("song.blob");

  expect(zip.files).toEqual({
    "song.blob": expect.anything(),
    "state.json": expect.anything()
  });

  let persistedState = await json
    .async("text")
    .then(content => JSON.parse(content));
  expect(persistedState).toEqual(expectedState);

  let persistedAudioFile = await audioBlob.async("text");
  expect(persistedAudioFile).toEqual(expectedAudioContent);
});

it("can open a transcription", async () => {
  let expectedState: PersistedState = {
    analysis: initialAnalysisState,
    project: initialProjectState
  };

  let zip = new JSZip();
  zip.file("state.json", JSON.stringify(expectedState));
  zip.file("song.blob", new Blob([expectedAudioContent]));

  let mockedLoadAsync = jest.fn(async (url: string) => zip);
  JSZip.loadAsync = mockedLoadAsync;

  //Trigger open API
  let zipFile = new File(
    [await zip.generateAsync({ type: "blob" })],
    "transcription.zip"
  );
  let { audioBlob, state } = await PersistenceApi.open(zipFile);

  //Verify extracted and processed zip
  expect(mockedLoadAsync).toHaveBeenCalledTimes(1);
  expect(mockedLoadAsync).toHaveBeenCalledWith(zipFile);
  expect(state).toEqual(expectedState);
  expect(await contentOf(audioBlob)).toEqual(expectedAudioContent);
});
