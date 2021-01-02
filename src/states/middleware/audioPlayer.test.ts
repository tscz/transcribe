import { PitchShift, Player, Transport } from "tone";

import AudioPlayer from "./audioPlayer";

jest.mock("tone", () => {
  return {
    Player: jest.fn(),
    PitchShift: jest.fn(),
    Transport: {
      pause: jest.fn(),
      start: jest.fn(),
      state: jest.fn(),
      cancel: jest.fn()
    },
    now: jest.fn()
  };
});

let audioPlayer: AudioPlayer;

beforeEach(() => {
  ((Player as unknown) as jest.Mock).mockImplementation(() => {
    return {
      sync: jest.fn(),
      start: jest.fn(),
      connect: jest.fn(),
      toSeconds: jest.fn(),
      dispose: jest.fn(),
      buffer: { duration: 42 }
    };
  });

  ((PitchShift as unknown) as jest.Mock).mockImplementation(() => {
    return { toDestination: jest.fn(), dispose: jest.fn() };
  });

  (Transport.pause as jest.Mock).mockClear();
  (Transport.start as jest.Mock).mockClear();

  const AudioBufferMock = jest.fn<AudioBuffer, unknown[]>();
  const audioBufferMock: AudioBuffer = new AudioBufferMock();

  const onSongCompleteMock: () => void = jest.fn();

  audioPlayer = new AudioPlayer(audioBufferMock, onSongCompleteMock);
});

it("can pause an audio playback", () => {
  expect(Transport.pause).toHaveBeenCalledTimes(0);

  audioPlayer.pause();

  expect(Transport.pause).toHaveBeenCalledTimes(1);
});

it("can start an audio playback", () => {
  expect(Transport.start).toHaveBeenCalledTimes(0);

  audioPlayer.play();

  expect(Transport.start).toHaveBeenCalledTimes(1);
});

it("can play an audio segement", () => {
  expect(Transport.start).toHaveBeenCalledTimes(0);

  audioPlayer.playSegment({ startTime: 1, endTime: 2, update: jest.fn() });

  expect(Transport.start).toHaveBeenCalledTimes(1);
});
it("change the playbackRate", () => {
  audioPlayer.setPlaybackRate(42);
});

it("can detune a playback", () => {
  audioPlayer.setDetune(1);
});

it("can destroy the player", () => {
  audioPlayer.destroy();
});

it("can return the playback state", () => {
  expect(audioPlayer.isPlaying()).toBeFalsy();
});

it("can return the seeking state", () => {
  expect(audioPlayer.isSeeking()).toBeFalsy();
});

it("can return the duration", () => {
  expect(audioPlayer.getDuration()).toBe(42);
});

it("can seek to a given position", () => {
  expect(audioPlayer.seek(33));
});
