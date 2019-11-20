import { PeaksInstance } from "peaks.js";
import Tone from "tone";

interface Player {
  destroy: () => void;
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
  isSeeking: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  seek: (time: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
  setDetune: (pitch: number) => void;
}

/**
 * Tone.js Player replacement for the <audio>-element based Peaks.js player
 */
class AudioPlayer implements Player {
  peaks: PeaksInstance & { emit: (id: string, value: any) => void };
  player: Tone.Player;
  pitchShift: Tone.PitchShift;

  constructor(
    peaks: PeaksInstance,
    audioBuffer: AudioBuffer,
    onSongComplete: () => void
  ) {
    console.log("AudioPlayer constructor");

    //@ts-ignore because we allow the internal emit function in the instance variable peaks
    this.peaks = peaks;

    this.player = new Tone.Player(audioBuffer).sync().start();

    this.pitchShift = new Tone.PitchShift();

    //@ts-ignore because connect method is not defined in TS definition
    Tone.connect(this.player, this.pitchShift);
    this.pitchShift.toMaster();

    Tone.Transport.scheduleRepeat(time => {
      this.peaks.emit("player_time_update", this.getCurrentTime());
      if (this.getCurrentTime() >= this.getDuration()) {
        Tone.Transport.stop();
        onSongComplete();
      }
    }, 0.03);

    this.peaks.emit("player_load", this);
    this.peaks.emit("player_canplay", this);
  }

  shiftToSemitones = (shift: number) => 12 * Math.log2(1 / shift);

  setPlaybackRate(playbackRate: number) {
    this.player.playbackRate = playbackRate;

    this.pitchShift.pitch = this.shiftToSemitones(playbackRate);
  }

  setDetune(detune: number) {
    this.pitchShift.pitch =
      this.shiftToSemitones(this.player.playbackRate) + detune;
  }

  destroy = () => {
    console.log("AudioPlayer destroy()");
  };

  play = () => {
    Tone.Transport.start(Tone.now(), this.getCurrentTime());
    this.peaks.emit("player_play", this.getCurrentTime());
  };

  pause = () => {
    Tone.Transport.pause();
    this.peaks.emit("player_pause", this.getCurrentTime());
  };

  isPlaying = () => {
    return Tone.Transport.state === "started";
  };

  isSeeking = () => {
    return false;
  };

  getCurrentTime = () => {
    return this.player.buffer.toSeconds(Tone.Transport.position);
  };

  getDuration = () => {
    return this.player.buffer.duration;
  };

  seek = (time: number) => {
    if (this.isPlaying()) {
      Tone.Transport.stop();
      Tone.Transport.start(Tone.now(), time);
    } else {
      Tone.Transport.start(Tone.now(), time);
      Tone.Transport.pause();
    }
    this.peaks.emit("player_seek", time);
    this.peaks.emit("player_time_update", time);
  };
}

export default AudioPlayer;
