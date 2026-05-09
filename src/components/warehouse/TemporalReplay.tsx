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
    <div className="flex items-center gap-4 w-full bg-black p-4 rounded-2xl border-2 border-primary/30 shadow-xl shadow-primary/5">
      <button
        onClick={() => onChange(0)}
        className="p-2.5 rounded-xl border-2 border-white/20 hover:border-white transition-all text-white"
        aria-label="Restart"
      >
        <Rewind className="w-4 h-4" />
      </button>
      <button
        onClick={() => setPlaying((p) => !p)}
        className="p-3 rounded-xl bg-primary text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] border-2 border-primary"
        aria-label="Play"
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <div className="flex-1 relative mx-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full accent-primary h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono text-white font-black mt-2 tracking-widest opacity-60">
          <span>−4H</span>
          <span>−2H</span>
          <span className="text-primary opacity-100">LIVE</span>
        </div>
      </div>
      <div className="text-right pl-4 border-l border-primary/20">
        <div className="text-lg font-mono font-black tabular-nums text-primary shadow-glow">
          {value >= 0.99 ? "LIVE" : `−${hoursAgo}H`}
        </div>
        <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Temporal</div>
      </div>
    </div>
  );
}
