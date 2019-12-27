import { mock } from "jest-mock-extended";
import Tone from "tone";

import AudioPlayer, { PeaksInstanceEmitAware } from "./audioPlayer";

jest.mock("tone");
jest.mock("peaks.js");

it("play an audio file", () => {
  const audioBufferMock = mock<AudioBuffer>();

  const peaksMock = mock<PeaksInstanceEmitAware>();
  let player = new AudioPlayer(peaksMock, audioBufferMock, () => {});

  expect(Tone.Player).toBeCalledTimes(1);
  expect(peaksMock.emit).toHaveBeenCalledWith("player_canplay", player);
});
