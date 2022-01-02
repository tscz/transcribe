import FileSaver, { saveAs } from "file-saver";
import JSZip from "jszip";
import { initialAnalysisState } from "states/analysis/analysisSlice";
import { initialProjectState } from "states/project/projectSlice";
import { PersistedState } from "states/store";

import PersistenceApi from "./persistenceApi";

const expectedAudioContent = "expectedAudioContent";

async function contentOf(blob: Blob) {
  const text = await new Response(blob).text();
  return text;
}

// Mock fetch API by returning a dummy audio blob
type CustomNodeJsGlobal =
  | typeof globalThis
  | {
      fetch: () => Promise<Response>;
    };
declare const global: CustomNodeJsGlobal;

global.fetch = () => {
  return new Promise<Response>((resolve) =>
    resolve(new Response(new Blob([expectedAudioContent])))
  );
};

// Mock file-saver's saveAs() function
jest.mock("file-saver");
const mockedSaveAs = FileSaver.saveAs as unknown as jest.Mock<typeof saveAs>;

it("can save a transcription", async () => {
  const expectedState: PersistedState = {
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
  const zip = await JSZip.loadAsync(createdZip);
  const json = zip.file("state.json");
  const audioBlob = zip.file("song.blob");

  expect(zip.files).toEqual({
    "song.blob": expect.anything(),
    "state.json": expect.anything()
  });

  const persistedState = await json!
    .async("text")
    .then((content) => JSON.parse(content));
  expect(persistedState).toEqual(expectedState);

  const persistedAudioFile = await audioBlob!.async("text");
  expect(persistedAudioFile).toEqual(expectedAudioContent);
});

it("can open a transcription", async () => {
  const expectedState: PersistedState = {
    analysis: initialAnalysisState,
    project: initialProjectState
  };

  const zip = new JSZip();
  zip.file("state.json", JSON.stringify(expectedState));
  zip.file("song.blob", new Blob([expectedAudioContent]));

  const mockedLoadAsync = jest.fn(async () => zip);
  JSZip.loadAsync = mockedLoadAsync;

  //Trigger open API
  const zipFile = new File(
    [await zip.generateAsync({ type: "blob" })],
    "transcription.zip"
  );
  const { audioBlob, state } = await PersistenceApi.open(zipFile);

  //Verify extracted and processed zip
  expect(mockedLoadAsync).toHaveBeenCalledTimes(1);
  expect(mockedLoadAsync).toHaveBeenCalledWith(zipFile);
  expect(state).toEqual(expectedState);
  expect(await contentOf(audioBlob)).toEqual(expectedAudioContent);
});
