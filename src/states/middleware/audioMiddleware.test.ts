/* eslint-disable no-console */
import { Measures, Sections } from "model/model";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { initialAnalysisState } from "states/analysis/analysisSlice";
import {
  initialAudioState,
  toggledLoop,
  triggeredPause,
  triggeredPlay,
  updatedLoopSettings,
  updatedPlaybackSettings
} from "states/audio/audioSlice";
import { DialogType } from "states/dialog/dialogsSlice";
import {
  createdProject,
  hotReloaded,
  initialProjectState
} from "states/project/projectSlice";
import { ApplicationState } from "states/store";

import AudioMiddleware, { updateWaveform } from "./audioMiddleware";
import AudioPlayer from "./audioPlayer";

jest.mock("./audioPlayer");
let dispatch: (action: AnyAction) => Dispatch<AnyAction>;
let audioMiddleware: AudioMiddleware;
let mockedAudioPlayer: AudioPlayer;
let api: MiddlewareAPI<Dispatch<AnyAction>, ApplicationState>;
beforeEach(() => {
  api = {
    dispatch: jest.fn(),
    getState: jest.fn()
  };

  const AudioPlayerMock = jest.fn<AudioPlayer, unknown[]>();
  mockedAudioPlayer = new AudioPlayerMock();
  mockedAudioPlayer.destroy = jest.fn();
  mockedAudioPlayer.play = jest.fn();
  mockedAudioPlayer.pause = jest.fn();
  mockedAudioPlayer.setPlaybackRate = jest.fn();
  mockedAudioPlayer.setDetune = jest.fn();
  mockedAudioPlayer.seek = jest.fn();

  audioMiddleware = new AudioMiddleware();
  audioMiddleware.player = mockedAudioPlayer;

  const middleware = audioMiddleware.createMiddleware(api);

  const next: Dispatch<AnyAction> = jest.fn();
  dispatch = middleware(next);
});

const MockedResponse = jest.fn<Response, unknown[]>();
const mockResponse = new MockedResponse();

mockResponse.arrayBuffer = () => Promise.resolve(new ArrayBuffer(0));

global.fetch = jest.fn(() => Promise.resolve(mockResponse));

it("throws an error if peaks is undefined", () => {
  dispatch(
    createdProject({
      analysis: initialAnalysisState,
      project: initialProjectState
    })
  );
});

it("throws an error if player is undefined", () => {
  audioMiddleware.player = undefined;

  expect(() => dispatch(triggeredPlay())).toThrowError("player undefined");

  expect(() => dispatch(triggeredPause())).toThrowError("player undefined");

  expect(() =>
    dispatch(updatedLoopSettings({ start: 1, end: 4 }))
  ).toThrowError("player undefined");

  expect(() =>
    dispatch(updatedPlaybackSettings({ detune: 4, playbackRate: 2 }))
  ).toThrowError("player undefined");
});
it("invokes play on audio player", () => {
  expect(mockedAudioPlayer.play).toBeCalledTimes(0);

  dispatch(triggeredPlay());

  expect(mockedAudioPlayer.play).toBeCalledTimes(1);
});

it("invokes pause on audio player", () => {
  expect(mockedAudioPlayer.pause).toBeCalledTimes(0);

  dispatch(triggeredPause());

  expect(mockedAudioPlayer.pause).toBeCalledTimes(1);
});

it("updates playback settings of audio player", () => {
  dispatch(updatedPlaybackSettings({ detune: 4, playbackRate: 2 }));

  expect(mockedAudioPlayer.setDetune).toBeCalledWith(4);
  expect(mockedAudioPlayer.setPlaybackRate).toBeCalledWith(2);
});

it("does not update playback settings if values are missing", () => {
  dispatch(updatedPlaybackSettings({}));

  expect(mockedAudioPlayer.setDetune).not.toBeCalled();
  expect(mockedAudioPlayer.setPlaybackRate).not.toBeCalled();
});

it("toggles loop mode of audio player", () => {
  dispatch(toggledLoop());

  //TODO #11: test
});

it("changes loop settings (start+end) of audio player", () => {
  dispatch(updatedLoopSettings({ start: 1, end: 4 }));
  expect(mockedAudioPlayer.seek).toBeCalledWith(1);
});

it("changes loop settings (start only) of audio player", () => {
  jest.spyOn(api, "getState").mockReturnValue({
    analysis: initialAnalysisState,
    audio: { ...initialAudioState, loopStart: 3 },
    project: initialProjectState,
    dialog: { currentDialog: DialogType.NONE }
  });

  dispatch(updatedLoopSettings({ start: 1 }));
  expect(mockedAudioPlayer.seek).toBeCalledWith(1);
});

it("changes loop settings (end only) of audio player", () => {
  jest.spyOn(api, "getState").mockReturnValue({
    analysis: initialAnalysisState,
    audio: { ...initialAudioState, loopStart: 3 },
    project: initialProjectState,
    dialog: { currentDialog: DialogType.NONE }
  });

  dispatch(updatedLoopSettings({ end: 4 }));
  expect(mockedAudioPlayer.seek).toBeCalledWith(3);
});

it("lets an unknown action pass through", () => {
  const unknownAction: AnyAction = {
    type: "unknown"
  };

  expect(() => dispatch(unknownAction)).not.toThrowError();
});

it("repaints waveform", () => {
  const measures: Measures = { allIds: [], byId: {} };
  const sections: Sections = { allIds: [], byId: {} };

  dispatch(updateWaveform({ measures: measures, sections: sections }));
});

it("inits the audio context", () => {
  dispatch(hotReloaded());
});
