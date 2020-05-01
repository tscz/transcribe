import Log from "components/log/log";
import { EventEmitterForPlayerEvents, PlayerAdapter, Segment } from "peaks.js";
import * as Tone from "tone";
import { PitchShift, Player as TonejsPlayer } from "tone";

/**
 * External Tone.js based Player for Peaks.js
 */
class AudioPlayer implements PlayerAdapter {
  player: TonejsPlayer;
  pitchShift: PitchShift;
  detune: number;
  eventEmitter: EventEmitterForPlayerEvents | undefined;

  constructor(
    private audioBuffer: AudioBuffer,
    private onSongComplete: () => void
  ) {
    this.player = new TonejsPlayer(this.audioBuffer);
    this.pitchShift = new PitchShift();
    this.detune = 0;

    this.player.sync();
    this.player.start();

    this.player.connect(this.pitchShift);
    this.pitchShift.toDestination();
  }

  init = (eventEmitter: EventEmitterForPlayerEvents) => {
    Log.info("init", AudioPlayer.name);

    this.eventEmitter = eventEmitter;

    Tone.Transport.scheduleRepeat(() => {
      eventEmitter.emit("player.timeupdate", this.getCurrentTime());
      if (this.getCurrentTime() >= this.getDuration()) {
        Tone.Transport.stop();
        this.onSongComplete();
      }
    }, 0.25);

    eventEmitter.emit("player.canplay");
  };

  shiftToSemitones = (shift: number) => 12 * Math.log2(1 / shift);

  setPlaybackRate(playbackRate: number) {
    this.player.playbackRate = playbackRate;

    // Detune to keep consistent pitch, even if the playback speed changed
    this.setDetune(this.detune);

    // Adjust playback to new playbackrate
    if (this.isPlaying()) {
      this.seek(this.getCurrentTime());
    }
  }

  setDetune(detune: number) {
    this.detune = detune;

    this.pitchShift.pitch =
      this.shiftToSemitones(this.player.playbackRate) + detune;
  }

  destroy = () => {
    Log.info("destroy", AudioPlayer.name);

    this.player.dispose();
    this.pitchShift.dispose();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
  };

  play = () => {
    Tone.Transport.start(
      Tone.now(),
      this.getCurrentTime() / this.player.playbackRate
    );
    this.eventEmitter?.emit(
      "player.play",
      this.getCurrentTime() / this.player.playbackRate
    );
  };

  playSegment = (segment: Segment) => {
    Tone.Transport.start(
      Tone.now(),
      segment.startTime / this.player.playbackRate
    );
    this.eventEmitter?.emit(
      "player.play",
      this.getCurrentTime() / this.player.playbackRate
    );
  };

  pause = () => {
    Tone.Transport.pause();
    this.eventEmitter?.emit("player.pause", this.getCurrentTime());
  };

  isPlaying = () => {
    return Tone.Transport.state === "started";
  };

  isSeeking = () => {
    return false;
  };

  getCurrentTime = () => {
    return (
      this.player.toSeconds(Tone.Transport.position) * this.player.playbackRate
    );
  };

  getDuration = () => {
    return this.player.buffer.duration;
  };

  seek = (time: number) => {
    const normalizedTime = time / this.player.playbackRate;

    Tone.Transport.seconds = normalizedTime;
    this.eventEmitter?.emit("player.seeked", this.getCurrentTime());
    this.eventEmitter?.emit("player.timeupdate", this.getCurrentTime());
  };
}

export default AudioPlayer;
