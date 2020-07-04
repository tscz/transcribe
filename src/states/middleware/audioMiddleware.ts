import { createAction } from "@reduxjs/toolkit";
import PersistenceApi from "api/persistenceApi";
import Log from "components/log/log";
import { Measures, Sections } from "model/model";
import Peaks, { PeaksInstance } from "peaks.js";
import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { updatedRhythm } from "states/analysis/analysisSlice";
import {
  toggledLoop,
  triggeredPause,
  triggeredPlay,
  updatedLoopSettings,
  updatedPlaybackSettings
} from "states/audio/audioSlice";
import AudioPlayer from "states/middleware/audioPlayer";
import PeaksConfig from "states/middleware/peaksConfig";
import {
  createdProject,
  hotReloaded,
  initializedProject
} from "states/project/projectSlice";
import { ApplicationState } from "states/store";
import * as Tone from "tone";

export const switchAudioFile = createAction<{ url: string }>("switchAudioFile");
export const updateWaveform = createAction<{
  sections: Sections;
  measures: Measures;
}>("updateWaveform");

/**
 * Redux Middleware for handling audio related actions (sync and async).
 *
 * This middleware is basically the glue code between internal app state changes
 * and the major 3rd party libraries Peaks.js (the audio waveform) and Tone.js (the audio player).
 *
 */
class AudioMiddleware {
  peaks: PeaksInstance | undefined;
  player: AudioPlayer | undefined;
  url: string | undefined;

  private getPlayer = () => {
    if (!this.player) throw new Error("player undefined");
    return this.player;
  };

  /**
   * Redux Middleware function. Intercepts all audio related actions.
   */
  createMiddleware: Middleware<Dispatch, ApplicationState> = (dispatch) => (
    next
  ) => (action: Action<string>) => {
    Log.info("action " + action.type, AudioMiddleware.name);

    //Case: Audio file changed and Peaks.js and Tone.js should be initialized
    if (createdProject.match(action)) {
      this.initAudioContext(action.payload.project.audioUrl, dispatch);

      return next(action);
    }

    //Case: Application hot reloaded during development
    if (hotReloaded.match(action)) {
      //TODO: support Hot reload for audio files https://github.com/tscz/transcribe/issues/39
      //this.initAudioContext(dispatch.getState().project.audioUrl, dispatch);

      return next(action);
    }

    // Case: Play was triggered
    if (triggeredPlay.match(action)) {
      this.getPlayer().play();
      return next(action);
    }

    // Case: Pause was triggered
    if (triggeredPause.match(action)) {
      this.getPlayer().pause();
      return next(action);
    }

    // Case: Waveform needs to be updated
    if (updateWaveform.match(action)) {
      this.repaintWaveform(action.payload.sections, action.payload.measures);

      return next(action);
    }

    // Case: playback settings need to be updated
    if (updatedPlaybackSettings.match(action)) {
      if (action.payload.playbackRate)
        this.getPlayer().setPlaybackRate(action.payload.playbackRate);

      if (action.payload.detune)
        this.getPlayer().setDetune(action.payload.detune);

      return next(action);
    }

    // Case: Looping needs to be toggled
    if (toggledLoop.match(action)) {
      // TODO toggle looping mode (https://github.com/tscz/transcribe/issues/11)

      return next(action);
    }

    // Case: Looping settings should be updated
    if (updatedLoopSettings.match(action)) {
      const start = action.payload.start ?? dispatch.getState().audio.loopStart;
      const end = action.payload.end ?? dispatch.getState().audio.loopEnd;

      this.getPlayer().seek(start);
      this.setZoom(start, end);

      return next(action);
    }

    // Case: given action does not trigger audio related side effects
    return next(action);
  };

  private cleanupPreviousInit() {
    this.peaks?.destroy();
    this.player?.destroy();

    if (this.url) PersistenceApi.revokeLocalFile(this.url);
  }

  private initAudioContext(
    url: string,
    dispatch: MiddlewareAPI<Dispatch<AnyAction>, ApplicationState>
  ) {
    this.cleanupPreviousInit();

    // Read local audio file url into an audiobuffer
    this.url = url;

    Log.info(
      "start fetch audio file into audiobuffer from " + this.url,
      AudioMiddleware.name
    );
    fetch(this.url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => Tone.context.decodeAudioData(buffer))
      .then((audioBuffer) => {
        Log.info("audiobuffer loaded from " + this.url, AudioMiddleware.name);
        initTonejsAndPeaksjs(audioBuffer);
      });

    const initTonejsAndPeaksjs = (audioBuffer: AudioBuffer) => {
      Log.info("init peaks start", AudioMiddleware.name);

      this.player = new AudioPlayer(audioBuffer, () => {});

      Peaks.init(PeaksConfig.create(audioBuffer, this.player), (err, peaks) => {
        // eslint-disable-next-line no-console
        console.log("body=" + document.body.innerHTML);
        if (err) throw new Error("Peaks could not be initialized: " + err);

        if (!peaks)
          throw new Error("Peaks instance is not correctly initialized.");

        Log.info("init peaks end", AudioMiddleware.name);

        peaks.on("player.seeked", (time: number) => {
          if (dispatch.getState().project.syncFirstMeasureStart)
            dispatch.dispatch(updatedRhythm({ firstMeasureStart: time }));
        });

        this.peaks = peaks;

        dispatch.dispatch(initializedProject());
        dispatch.dispatch(updatedRhythm({ duration: audioBuffer.duration }));
      });
    };
  }

  private repaintWaveform(sections: Sections, measures: Measures) {
    const timePerMeasure = this.computeSecondsPerMeasure(measures);

    this.peaks?.segments.removeAll();
    this.peaks?.segments.add(
      PeaksConfig.sectionsToSegment(sections, measures, timePerMeasure)
    );
    this.peaks?.points.removeAll();
    this.peaks?.points.add(PeaksConfig.measuresToPoints(measures));
  }

  private computeSecondsPerMeasure = (measures: Measures) => {
    if (!measures || !measures.byId["1"] || !measures.byId["0"]) return 0;
    return measures.byId["1"].time - measures.byId["0"].time;
  };

  private setZoom(start: number, end: number) {
    const zoomview:
      | Peaks.WaveformView
      | null
      | undefined = this.peaks?.views.getView("zoomview");

    if (zoomview) {
      const duration = end - start;
      zoomview.setZoom({ seconds: duration });
      zoomview.setStartTime(start);
    }
  }
}

export default AudioMiddleware;
