import {
  AudioLines,
  Gauge,
  Maximize2,
  MusicIcon,
  Play,
  Repeat,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Row({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex items-center justify-center w-7 h-7 rounded bg-secondary shrink-0 mt-0.5">
        <span className="text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-secondary/50 border border-border px-3 py-2 text-sm text-muted-foreground leading-relaxed">
      {children}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <AudioLines className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Transcribe — Help</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          A browser-based tool for analysing and transcribing music from audio files.
        </p>
      </div>

      {/* Getting started */}
      <Section title="Getting Started">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Transcribe works entirely in your browser — no account or installation needed.
          Your audio files never leave your device.
        </p>
        <div className="space-y-4">
          <Row
            icon={<Play />}
            label="New project"
            description="Click the + button in the top bar, give your project a name, and pick an audio file (MP3, WAV, FLAC, etc.). The waveform will load and measures will be distributed automatically."
          />
          <Row
            icon={<MusicIcon />}
            label="Open project"
            description="Load a previously saved .zip project file to continue where you left off. All sections, measures, and settings are restored exactly."
          />
          <Row
            icon={<Gauge />}
            label="Save project"
            description="Click the save icon to download a .zip containing your audio and all analysis data. Keep this file — it is the only way to reload your work."
          />
        </div>
        <Note>
          Projects are saved as a .zip file containing your audio and a JSON state file.
          The app has no server-side storage.
        </Note>
      </Section>

      {/* Waveform */}
      <Section title="Waveform">
        <p className="text-sm text-muted-foreground leading-relaxed">
          The waveform is the main visual timeline of your audio. The coloured overview strip below it shows named sections at a glance.
        </p>
        <div className="space-y-4">
          <Row
            icon={<Play />}
            label="Seek"
            description="Click anywhere on the waveform to jump playback to that position."
          />
          <Row
            icon={<ZoomIn />}
            label="Zoom in"
            description="Zoom into the waveform for finer detail. Scroll wheel also works when hovering over the waveform."
          />
          <Row
            icon={<ZoomOut />}
            label="Zoom out"
            description="Zoom out to see more of the song at once."
          />
          <Row
            icon={<Maximize2 />}
            label="Fit to window"
            description="Reset zoom so the entire song fits in the visible area."
          />
        </div>
        <Note>
          When you select a region in the Measures grid, the waveform automatically zooms to fit that selection.
        </Note>
      </Section>

      {/* Playback controls */}
      <Section title="Playback Controls">
        <div className="space-y-4">
          <Row
            icon={<Play />}
            label="Play / Pause"
            description="Start or pause audio playback at the current position."
          />
          <Row
            icon={<Repeat />}
            label="Loop"
            description="Toggle looping. When a region is selected in the Measures grid, playback loops between the start and end of that selection. Without a selection, the entire song loops."
          />
          <Row
            icon={<Gauge />}
            label="Playback speed"
            description="Slow down or speed up playback without changing pitch. Useful for transcribing fast passages. Range: 0.25× to 2×."
          />
          <Row
            icon={<MusicIcon />}
            label="Pitch shift"
            description="Transpose the audio up or down in semitones without affecting speed. Useful when a recording is slightly out of tune. Range: −12 to +12 semitones."
          />
        </div>
      </Section>

      {/* Song structure */}
      <Section title="Song Structure">
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Structure page lets you map out the song by marking sections (intro, verse, chorus…)
          and navigating individual measures.
        </p>
        <div className="space-y-4">
          <Row
            icon={<SlidersHorizontal />}
            label="Song properties"
            description="Set the BPM (tempo) and time signature. Measures are distributed automatically across the full duration. Drag the amber M0 marker on the waveform to align the first measure with the beat."
          />
          <Row
            icon={<MusicIcon />}
            label="Sections"
            description="Add named sections (Intro, Verse, Chorus, Bridge, Outro) by selecting a measure range and clicking Add Section. Sections appear as coloured regions on the waveform."
          />
          <Row
            icon={<Repeat />}
            label="Measures grid"
            description="Click a measure to select it and set the loop region. Click a later measure to extend the selection. Click the × to clear the selection."
          />
        </div>
        <Note>
          The amber <span className="text-amber-400 font-medium">M0</span> marker on the waveform marks the downbeat of the first measure.
          Drag it left or right to correct the beat alignment if the auto-detected position is off.
        </Note>
      </Section>

      {/* Keyboard shortcuts */}
      <Section title="Tips">
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed list-disc list-inside">
          <li>Use the scroll wheel over the waveform to zoom without clicking the zoom buttons.</li>
          <li>Slow playback to 0.5× while looping a tricky passage to hear every note clearly.</li>
          <li>Use pitch shift to match a recording to a reference instrument that may be tuned differently.</li>
          <li>Save frequently — the browser has no auto-save and a page refresh will lose unsaved changes.</li>
        </ul>
      </Section>
    </div>
  );
}
