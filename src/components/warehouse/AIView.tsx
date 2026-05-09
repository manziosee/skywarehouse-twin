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

export function AIView() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section className="lg:col-span-7 glass-strong rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
              AI fleet · 4 models live
            </div>
            <div className="text-sm font-semibold mt-0.5">Inference mesh</div>
          </div>
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-3">
          {MODELS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-2.5 rounded-xl border border-border/60 bg-white/60"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold">{m.name}</span>
                <span className="text-[10px] text-muted-foreground">{m.role}</span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                  {m.latency} · acc {m.acc}
                </span>
              </div>
              <div className="relative h-1 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.load * 100}%` }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-1">
                GPU load {Math.round(m.load * 100)}%
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="lg:col-span-5 glass-strong rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          Predictive insights
        </div>
        <div className="text-sm font-semibold mt-0.5 mb-3">Next 30 min</div>
        <div className="space-y-2">
          {INSIGHTS.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-white/70 border border-border/60"
            >
              <div className="w-6 h-6 rounded-md bg-primary/10 grid place-items-center shrink-0">
                <ins.icon className="w-3 h-3 text-primary" />
              </div>
              <p className="text-xs leading-relaxed text-foreground/85">{ins.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-base font-mono font-bold text-primary">12.4k</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">infer/min</div>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-primary">3</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">anomalies</div>
          </div>
          <div>
            <div className="text-base font-mono font-bold text-primary">0.42 ms</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">p50 lat</div>
          </div>
        </div>
      </section>
    </div>
  );
}
