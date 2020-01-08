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

interface EmitAware {
  emit: (id: string, value: any) => void;
}

export interface PeaksInstanceEmitAware extends PeaksInstance, EmitAware {}

/**
 * Tone.js Player replacement for the <audio>-element based Peaks.js player
 */
class AudioPlayer implements Player {
  peaks: PeaksInstanceEmitAware;
  player: Tone.Player;
  pitchShift: Tone.PitchShift;

  constructor(
    peaks: PeaksInstance,
    audioBuffer: AudioBuffer,
    onSongComplete: () => void
  ) {
    this.peaks = peaks as PeaksInstanceEmitAware;

    this.player = new Tone.Player(audioBuffer);
    this.player.sync();
    this.player.start();

    this.pitchShift = new Tone.PitchShift();

    Tone.connectSeries(this.player, this.pitchShift, Tone.Master);

    Tone.Transport.scheduleRepeat(time => {
      this.peaks.emit("player_time_update", this.getCurrentTime());
      if (this.getCurrentTime() >= this.getDuration()) {
        Tone.Transport.stop();
        onSongComplete();
      }
    }, 0.03);

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
    Tone.context.dispose();
    ((Tone as unknown) as Tone & {
      setContext: (ctx: AudioContext) => void;
    }).setContext(new AudioContext());
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
    return (
      this.player.buffer.toSeconds(Tone.Transport.position) *
      this.player.playbackRate
    );
  };

  getDuration = () => {
    return this.player.buffer.duration;
  };

  seek = (time: number) => {
    const normalizedTime = time * this.player.playbackRate;

    if (this.isPlaying()) {
      Tone.Transport.stop();
      Tone.Transport.start(Tone.now(), normalizedTime);
    } else {
      Tone.Transport.start(Tone.now(), normalizedTime);
      Tone.Transport.pause();
    }
    this.peaks.emit("player_time_update", normalizedTime);
    this.peaks.emit("player_seek", normalizedTime);
  };
}

export default AudioPlayer;
