import Log from "components/log/log";
import { EventEmitterForPlayerEvents, PlayerAdapter, Segment } from "peaks.js";
import { now, PitchShift, Player as TonejsPlayer, Transport } from "tone";

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

    Transport.scheduleRepeat(() => {
      eventEmitter.emit("player.timeupdate", this.getCurrentTime());
      if (this.getCurrentTime() >= this.getDuration()) {
        Transport.stop();
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
    Transport.cancel();
    Transport.position = 0;
  };

  play = () => {
    Transport.start(now(), this.getCurrentTime() / this.player.playbackRate);
    this.eventEmitter?.emit(
      "player.play",
      this.getCurrentTime() / this.player.playbackRate
    );
  };

  playSegment = (segment: Segment) => {
    Transport.start(now(), segment.startTime / this.player.playbackRate);
    this.eventEmitter?.emit(
      "player.play",
      this.getCurrentTime() / this.player.playbackRate
    );
  };

  pause = () => {
    Transport.pause();
    this.eventEmitter?.emit("player.pause", this.getCurrentTime());
  };

  isPlaying = () => {
    return Transport.state === "started";
  };

  isSeeking = () => {
    return false;
  };

  getCurrentTime = () => {
    return this.player.toSeconds(Transport.position) * this.player.playbackRate;
  };

  getDuration = () => {
    return this.player.buffer.duration;
  };

  seek = (time: number) => {
    const normalizedTime = time / this.player.playbackRate;

    Transport.seconds = normalizedTime;
    this.eventEmitter?.emit("player.seeked", this.getCurrentTime());
    this.eventEmitter?.emit("player.timeupdate", this.getCurrentTime());
  };
}

export default AudioPlayer;
