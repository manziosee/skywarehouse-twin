import { motion } from "framer-motion";
import { Sun, Zap, Leaf, Droplets } from "lucide-react";

export function SustainabilityView({ activeZone }: { activeZone?: string | null }) {
  const stats = [
    { label: "Solar Output", value: "242", unit: "kW", icon: Sun, trend: +12, color: "text-primary" },
    { label: "Energy Intensity", value: "0.84", unit: "kWh/m²", icon: Zap, trend: -4, color: "text-white" },
    { label: "Carbon Offset", value: "14.2", unit: "tons/mo", icon: Leaf, trend: +8, color: "text-primary" },
    { label: "Water Recovery", value: "88", unit: "%", icon: Droplets, trend: +2, color: "text-white" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12 h-full">
      <section className="lg:col-span-8 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black">
              Sustainability · Live Environmental Telemetry
            </div>
            <div className="text-3xl font-black mt-2 tracking-tighter text-white uppercase italic">Sky <span className="text-primary font-normal">/</span> Net-Zero Console</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/40 grid place-items-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[1.5rem] border-2 border-primary/20 bg-primary/5 relative overflow-hidden shadow-xl shadow-primary/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-primary shadow-lg shadow-primary/20`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-[12px] font-mono font-black text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20`}>
                  {s.trend > 0 ? "+" : ""}{s.trend}%
                </span>
              </div>
              <div className="text-sm text-white/60 font-black uppercase tracking-widest mb-2">{s.label}</div>
              <div className="text-3xl font-black font-mono text-white">
                {s.value}
                <span className="text-xs font-bold text-primary ml-2 uppercase tracking-widest">{s.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-[1.5rem] bg-primary border-2 border-primary flex items-center gap-6 shadow-2xl shadow-primary/20">
          <div className="w-16 h-16 rounded-full bg-white/20 grid place-items-center shrink-0 border border-white/30">
            <Leaf className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-lg font-black text-white uppercase tracking-widest">Net-Zero Pathway</div>
            <div className="text-sm text-white font-bold leading-relaxed mt-1 opacity-90">
              This facility is operating at 84% renewable capacity. {activeZone ? `Zone ${activeZone} is contributing 12% above efficiency.` : "AERION AI is optimizing HV loads."}
            </div>
          </div>
        </div>
      </section>

      <section className="lg:col-span-4 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] -z-10" />
        <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black mb-6">
          Resource Intensity
        </div>
        <div className="text-2xl font-black text-white uppercase italic mb-8">Asset Breakdown</div>
        <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { label: "AGV Fleet", value: 42, color: "bg-primary" },
            { label: "Conveyors", value: 28, color: "bg-white" },
            { label: "HVAC & Lights", value: 18, color: "bg-white/40" },
            { label: "IT Mesh", value: 12, color: "bg-primary/60" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-[11px] mb-2 uppercase font-black tracking-widest">
                <span className="text-white/60">{item.label}</span>
                <span className="font-mono font-black text-white">{item.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${item.color} shadow-[0_0_15px_rgba(14,165,233,0.3)]`}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 pt-8 border-t border-primary/20">
          <div className="text-[11px] font-mono uppercase text-primary mb-3 font-black tracking-[0.3em]">ESG SCORECARD</div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-white tracking-tighter">A+</span>
            <span className="text-[12px] text-primary mb-2 font-black uppercase tracking-[0.4em] italic shadow-glow">ELITE STATUS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
