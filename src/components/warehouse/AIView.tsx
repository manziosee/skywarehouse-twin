import { motion } from "framer-motion";
import { Brain, Eye, Zap, Network } from "lucide-react";

const MODELS = [
  { name: "FlowForecaster-XL", role: "Throughput prediction", load: 0.62, latency: "14ms", acc: "94.2%" },
  { name: "VisionGuard-v3", role: "Carton damage detection", load: 0.81, latency: "22ms", acc: "98.7%" },
  { name: "RouteSolver-Q", role: "AGV path optimization", load: 0.47, latency: "8ms", acc: "—" },
  { name: "DemandSense-7", role: "Replenishment forecast", load: 0.34, latency: "120ms", acc: "91.4%" },
];

const INSIGHTS = [
  { icon: Zap, text: "Reroute 12% of orders through Pack-3 to recover 4.2k u/hr (confidence 88%)" },
  { icon: Eye, text: "Vision-AI detected anomaly pattern in Zone B — possible mislabel batch #88421" },
  { icon: Network, text: "Predictive: Dock door D2 will free in 6 min, schedule T-1024 there" },
];

const ZONE_INSIGHTS: Record<string, typeof INSIGHTS> = {
  A: [
    { icon: Zap, text: "Vision-AI optimizing bulk intake flow from Dock door D1 (confidence 94%)" },
    { icon: Eye, text: "High variance detected in pallet dimensions at intake station A-12" },
  ],
  B: [
    { icon: Network, text: "Predicted 14% increase in reserve retrieval for tomorrow's batch" },
    { icon: Zap, text: "Relocate top-moving SKUs to Zone C during low-activity window (02:00)" },
  ],
  C: [
    { icon: Zap, text: "Dynamic re-slotting recommended for SKU-77211 to reduce travel time" },
    { icon: Eye, text: "Pick-path optimization complete: average 12s saved per batch" },
  ],
  D: [
    { icon: Network, text: "Cooling unit #4 maintenance suggested in next 48h (predictive)" },
    { icon: Eye, text: "Temperature stability in Zone D remains within nominal range (±0.2°C)" },
  ],
  E: [
    { icon: Zap, text: "Reroute 12% of orders through Pack-3 to recover 4.2k u/hr" },
    { icon: Network, text: "Predictive bottleneck at packing station E-01 in 8 min" },
  ],
  F: [
    { icon: Eye, text: "Anomaly detection: unexpected SKU return pattern at station F-02" },
    { icon: Network, text: "Recategorize Return Pallet PX as 'Restock-Ready' (confidence 91%)" },
  ],
  DOCK: [
    { icon: Network, text: "Predictive: Dock door D2 will free in 6 min, schedule T-1024 there" },
    { icon: Zap, text: "Optimize inbound buffer to handle surge from ship T-1024" },
  ],
};

const ZONE_MODELS: Record<string, typeof MODELS> = {
  A: [
    { name: "IntakeOptimizer-v2", role: "Pallet scanning", load: 0.42, latency: "18ms", acc: "99.2%" },
    { name: "VisionGuard-v3", role: "Damage detection", load: 0.75, latency: "22ms", acc: "98.7%" },
  ],
  E: [
    { name: "PackBalancer-X", role: "Load distribution", load: 0.88, latency: "12ms", acc: "96.4%" },
    { name: "FlowForecaster-XL", role: "Throughput pred", load: 0.62, latency: "14ms", acc: "94.2%" },
  ],
};

export function AIView({ activeZone }: { activeZone?: string | null }) {
  const displayInsights = activeZone ? (ZONE_INSIGHTS[activeZone] || INSIGHTS.slice(0, 2)) : INSIGHTS;
  const displayModels = activeZone ? (ZONE_MODELS[activeZone] || MODELS.slice(0, 2)) : MODELS;

  return (
    <div className="grid gap-6 lg:grid-cols-12 h-full">
      <section className="lg:col-span-7 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black">
              AI Intelligence Mesh · {activeZone ? `Sector ${activeZone} Focus` : `${displayModels.length} Models Active`}
            </div>
            <div className="text-xl font-black mt-2 tracking-tighter text-white uppercase italic italic">Neural <span className="text-primary font-normal">/</span> Inference Deck</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/40 grid place-items-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          {displayModels.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all shadow-lg shadow-primary/5 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary border border-primary/40 grid place-items-center shadow-lg shadow-primary/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white tracking-tight uppercase italic">{m.name}</span>
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest">{m.role}</span>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-[11px] font-mono font-black text-white bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                    {m.latency}
                  </span>
                  <span className="text-[11px] font-mono font-black text-primary bg-primary/20 px-3 py-1 rounded-lg border border-primary/30">
                    ACC {m.acc}
                  </span>
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-white/10 overflow-hidden shadow-inner mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.load * 100}%` }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Compute Load</span>
                <span className="text-[12px] text-white font-black font-mono">{Math.round(m.load * 100)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="lg:col-span-5 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] -z-10" />
        <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black mb-6">
          Predictive Insight Stream
        </div>
        <div className="text-2xl font-black text-white uppercase italic mb-8">
          {activeZone ? `Sector ${activeZone} Telemetry` : "Site Forecast T-30M"}
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {displayInsights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 border-2 border-white/20 shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center shrink-0 border border-white/20">
                <ins.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[13px] leading-relaxed text-white font-bold">{ins.text}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 pt-8 border-t border-primary/20 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-xl font-black font-mono text-primary">
              {activeZone ? (activeZone === "DOCK" ? "4.8k" : "1.2k") : "12.4k"}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Inference</div>
          </div>
          <div>
            <div className="text-xl font-black font-mono text-white">
              {activeZone ? (activeZone === "E" ? "1" : "0") : "3"}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Anomalies</div>
          </div>
          <div>
            <div className="text-xl font-black font-mono text-primary">0.42ms</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Latency</div>
          </div>
        </div>
      </section>
    </div>
  );
}
