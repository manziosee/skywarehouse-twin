import { useEffect, useState } from "react";
import { Pause, Play, Rewind } from "lucide-react";

type Props = { value: number; onChange: (v: number) => void };

export function TemporalReplay({ value, onChange }: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const i = setInterval(() => {
      onChange(Math.min(1, value + 0.01));
    }, 50);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, value]);

  useEffect(() => {
    if (value >= 1) setPlaying(false);
  }, [value]);

  const hoursAgo = ((1 - value) * 4).toFixed(1);

  return (
    <div className="flex items-center gap-3 w-full">
      <button
        onClick={() => onChange(0)}
        className="p-1.5 rounded-lg hover:bg-primary/10 transition"
        aria-label="Restart"
      >
        <Rewind className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setPlaying((p) => !p)}
        className="p-2 rounded-lg bg-primary text-white hover:opacity-90 glow"
        aria-label="Play"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
      <div className="flex-1 relative">
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-0.5">
          <span>−4h</span>
          <span>−2h</span>
          <span>NOW</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-mono font-semibold tabular-nums text-primary">
          {value >= 0.99 ? "LIVE" : `−${hoursAgo}h`}
        </div>
        <div className="text-[9px] text-muted-foreground uppercase tracking-wider">temporal</div>
      </div>
    </div>
  );
}
