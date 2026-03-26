import {
  Gauge,
  MusicIcon,
  Pause,
  Play,
  Repeat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";
import {
  DETUNE_MAX,
  DETUNE_MIN,
  DETUNE_STEP,
  PLAYBACK_RATE_MAX,
  PLAYBACK_RATE_MIN,
  PLAYBACK_RATE_STEP,
} from "@/lib/constants";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

export function PlayerControls() {
  const {
    isPlaying,
    playbackRate,
    detune,
    isLooping,
    currentTime,
    duration,
    setPlaying,
    setPlaybackRate,
    setDetune,
    setLooping,
  } = useStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      playbackRate: s.playbackRate,
      detune: s.detune,
      isLooping: s.isLooping,
      currentTime: s.currentTime,
      duration: s.duration,
      setPlaying: s.setPlaying,
      setPlaybackRate: s.setPlaybackRate,
      setDetune: s.setDetune,
      setLooping: s.setLooping,
    }))
  );

  // The hook manages the Tone.js engine side-effects
  useAudioPlayer();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Play / Pause */}
      <Button
        variant="default"
        size="icon"
        onClick={() => setPlaying(!isPlaying)}
        className="shrink-0"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Loop toggle */}
      <Button
        variant={isLooping ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setLooping(!isLooping)}
        className={cn("shrink-0", isLooping && "ring-1 ring-primary")}
        title="Toggle loop"
      >
        <Repeat className="h-4 w-4" />
      </Button>

      {/* Current time */}
      <span className="text-xs text-muted-foreground tabular-nums min-w-[72px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {/* Playback rate popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 px-2.5">
            <Gauge className="h-3.5 w-3.5" />
            <span className="text-xs tabular-nums">{playbackRate.toFixed(2)}x</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Speed</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {playbackRate.toFixed(2)}x
              </span>
            </div>
            <Slider
              min={PLAYBACK_RATE_MIN * 100}
              max={PLAYBACK_RATE_MAX * 100}
              step={PLAYBACK_RATE_STEP * 100}
              value={[Math.round(playbackRate * 100)]}
              onValueChange={([v]) => setPlaybackRate(v / 100)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-7"
              onClick={() => setPlaybackRate(1)}
            >
              Reset to 1.00x
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Detune popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 px-2.5">
            <MusicIcon className="h-3.5 w-3.5" />
            <span className="text-xs tabular-nums">
              {detune >= 0 ? "+" : ""}
              {detune.toFixed(1)} st
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Pitch</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {detune >= 0 ? "+" : ""}
                {detune.toFixed(1)} semitones
              </span>
            </div>
            <Slider
              min={DETUNE_MIN / DETUNE_STEP}
              max={DETUNE_MAX / DETUNE_STEP}
              step={1}
              value={[Math.round(detune / DETUNE_STEP)]}
              onValueChange={([v]) => setDetune(v * DETUNE_STEP)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-7"
              onClick={() => setDetune(0)}
            >
              Reset to 0
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
