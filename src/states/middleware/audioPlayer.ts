import Log from "components/log/log";
import { EventEmitterForPlayerEvents, PlayerAdapter, Segment } from "peaks.js";
import { now, PitchShift, Player as TonejsPlayer, Transport } from "tone";

/**
 * External Tone.js based Player for Peaks.js
 */
class AudioPlayer implements PlayerAdapter {
  shouldLoop: boolean;
  player: TonejsPlayer;
  pitchShift: PitchShift;
  detune: number;
  eventEmitter: EventEmitterForPlayerEvents | undefined;
  loopStart: number;
  loopEnd: number;

  constructor(
    private audioBuffer: AudioBuffer,
    private onSongComplete: () => void
  ) {
    this.player = new TonejsPlayer(this.audioBuffer);
    this.pitchShift = new PitchShift();
    this.detune = 0;
    this.shouldLoop = false;
    this.loopStart = 0;
    this.loopEnd = 0;

    this.player.sync();
    this.player.start();

    this.player.connect(this.pitchShift);
    this.pitchShift.toDestination();
  }

  init = (eventEmitter: EventEmitterForPlayerEvents): void => {
    Log.info("init", AudioPlayer.name);

    this.eventEmitter = eventEmitter;

    Transport.scheduleRepeat(() => {
      eventEmitter.emit("player.timeupdate", this.getCurrentTime());

      if (
        this.shouldLoop &&
        (this.getCurrentTime() >= this.loopEnd ||
          this.getCurrentTime() <= this.loopStart)
      ) {
        this.seek(this.loopStart);
      }

      if (this.getCurrentTime() >= this.getDuration()) {
        Transport.stop();
        this.onSongComplete();
      }
    }, 0.25);

    eventEmitter.emit("player.canplay");
  };

  shiftToSemitones = (shift: number): number => 12 * Math.log2(1 / shift);

  setPlaybackRate(playbackRate: number): void {
    this.player.playbackRate = playbackRate;

    // Detune to keep consistent pitch, even if the playback speed changed
    this.setDetune(this.detune);

    // Adjust playback to new playbackrate
    if (this.isPlaying()) {
      this.seek(this.getCurrentTime());
    }
  }

  setDetune(detune: number): void {
    this.detune = detune;

    this.pitchShift.pitch =
      this.shiftToSemitones(this.player.playbackRate) + detune;
  }

  toggleLoop(): void {
    this.shouldLoop = !this.shouldLoop;
  }

  setLoop(start: number, end: number): void {
    if (this.loopStart < 0 || this.loopStart > this.getDuration())
      throw new Error(
        "Loop start invalid. Must be a millisecond between 0 and " +
          this.getDuration()
      );
    if (this.loopEnd < this.loopStart || this.loopEnd > this.getDuration())
      throw new Error(
        "Loop start invalid. Must be a millisecond between " +
          this.loopStart +
          " and " +
          this.getDuration()
      );

    this.loopStart = start;
    this.loopEnd = end;
  }

  destroy = (): void => {
    Log.info("destroy", AudioPlayer.name);

    this.player.dispose();
    this.pitchShift.dispose();
    Transport.cancel();
    Transport.position = 0;
  };

  play = (): Promise<void> => {
    Transport.start(now(), this.getCurrentTime() / this.player.playbackRate);
    this.eventEmitter?.emit(
      "player.play",
      this.getCurrentTime() / this.player.playbackRate
    );

    return Promise.resolve();
  };

  playSegment = (segment: Segment): void => {
    Transport.start(now(), segment.startTime / this.player.playbackRate);
    this.eventEmitter?.emit(
      "player.play",
      this.getCurrentTime() / this.player.playbackRate
    );
  };

  pause = (): void => {
    Transport.pause();
    this.eventEmitter?.emit("player.pause", this.getCurrentTime());
  };

  isPlaying = (): boolean => {
    return Transport.state === "started";
  };

  isSeeking = (): boolean => {
    return false;
  };

  getCurrentTime = (): number => {
    return this.player.toSeconds(Transport.position) * this.player.playbackRate;
  };

  getDuration = (): number => {
    return this.player.buffer.duration;
  };

  seek = (time: number): void => {
    const normalizedTime = time / this.player.playbackRate;

    Transport.seconds = normalizedTime;
    this.eventEmitter?.emit("player.seeked", this.getCurrentTime());
    this.eventEmitter?.emit("player.timeupdate", this.getCurrentTime());
  };
}

export default AudioPlayer;
