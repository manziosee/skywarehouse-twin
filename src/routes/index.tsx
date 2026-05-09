import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  Cpu,
  Gauge,
  MapPin,
  Radio,
  Truck,
  Zap,
} from "lucide-react";
import logo from "@/assets/aerion-logo.png";
import { WarehouseTwin3D } from "@/components/warehouse/WarehouseTwin3D";
import { ActivityStream } from "@/components/warehouse/ActivityStream";
import { Heatmap } from "@/components/warehouse/Heatmap";
import { SystemMap } from "@/components/warehouse/SystemMap";
import { AICopilot } from "@/components/warehouse/AICopilot";
import { TemporalReplay } from "@/components/warehouse/TemporalReplay";
import { MetricsChart } from "@/components/warehouse/MetricsChart";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AERION — Warehouse Activity Twin" },
      {
        name: "description",
        content:
          "Live 3D digital twin of warehouse operations. Predictive overlays, AI copilot, voice navigation, temporal replay.",
      },
    ],
  }),
});

const ZONES = ["A", "B", "C", "D", "E", "F", "DOCK"];

function Index() {
  const [replay, setReplay] = useState(1);
  const [zone, setZone] = useState<string | null>("E");

  return (
    <div className="min-h-screen relative grid-bg">
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 px-6 py-3 flex items-center gap-4 glass-strong border-b border-border/60">
        <div className="flex items-center gap-3">
          <img src={logo} alt="AERION" width={36} height={36} className="rounded-lg" />
          <div>
            <div className="text-base font-bold tracking-tight leading-none">
              <span className="text-gradient">AERION</span>
              <span className="text-muted-foreground font-normal ml-2">/ Warehouse Twin</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
              Site · STK‑07 · Stockholm North
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 ml-6 text-[11px] font-mono">
          <span className="ticker-dot" />
          <span className="text-muted-foreground">WS connected · 142 AGVs · 38 421 SKU</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {[
            { icon: Activity, label: "Operations" },
            { icon: Boxes, label: "Inventory" },
            { icon: Truck, label: "Logistics" },
            { icon: Cpu, label: "AI" },
          ].map((item, i) => (
            <button
              key={item.label}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
                i === 0
                  ? "bg-primary text-primary-foreground border-primary glow"
                  : "border-border/70 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="p-4 lg:p-6 grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
        {/* HERO TWIN */}
        <section className="lg:col-span-8 lg:row-span-2 relative h-[520px] rounded-2xl overflow-hidden glass-strong scanline">
          <WarehouseTwin3D replayProgress={replay} activeZone={zone} />

          {/* overlay HUD */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 pointer-events-auto">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/80">
                Spatial Twin · Live
              </div>
              <h1 className="text-3xl font-bold tracking-tight mt-1">
                Floor <span className="text-gradient">in motion</span>
              </h1>
              <div className="text-xs text-muted-foreground mt-1 max-w-sm">
                Every particle is a real event — orders, AGVs, scans — flowing through the building right now.
              </div>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
              {[
                { label: "Throughput", value: "4.8k", unit: "u/hr", icon: Zap },
                { label: "Dwell", value: "12.4", unit: "min", icon: Gauge },
                { label: "Accuracy", value: "99.7", unit: "%", icon: Radio },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl px-3 py-2 min-w-[130px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </span>
                    <s.icon className="w-3 h-3 text-primary" />
                  </div>
                  <div className="font-mono text-lg font-semibold tabular-nums">
                    {s.value}
                    <span className="text-[10px] text-muted-foreground ml-1 font-normal">{s.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Zone selector */}
            <div className="absolute bottom-20 left-4 right-4 pointer-events-auto flex flex-wrap gap-1.5">
              {ZONES.map((z) => (
                <button
                  key={z}
                  onClick={() => setZone(z === zone ? null : z)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md border transition ${
                    zone === z
                      ? "bg-primary text-white border-primary glow"
                      : "bg-white/60 border-border/60 hover:border-primary/50"
                  }`}
                >
                  ZONE {z}
                </button>
              ))}
            </div>

            {/* temporal replay */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-auto glass rounded-xl px-4 py-2.5">
              <TemporalReplay value={replay} onChange={setReplay} />
            </div>
          </div>
        </section>

        {/* AI COPILOT */}
        <aside className="lg:col-span-4 lg:row-span-2 h-[520px] glass-strong rounded-2xl p-4 flex flex-col">
          <AICopilot />
        </aside>

        {/* METRICS */}
        <section className="lg:col-span-5 glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                Throughput · predicted vs actual
              </div>
              <div className="text-sm font-semibold mt-0.5">Last 60 min</div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" /> actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" /> predicted
              </span>
            </div>
          </div>
          <MetricsChart />
        </section>

        {/* HEATMAP */}
        <section className="lg:col-span-4 glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                Predictive heatmap
              </div>
              <div className="text-sm font-semibold mt-0.5">Bottleneck risk · next 30 min</div>
            </div>
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <Heatmap />
        </section>

        {/* SYSTEM MAP */}
        <section className="lg:col-span-3 glass-strong rounded-2xl p-4 min-h-[210px]">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            System map
          </div>
          <div className="text-sm font-semibold mt-0.5 mb-2">Service flow</div>
          <div className="h-[140px]">
            <SystemMap />
          </div>
        </section>

        {/* ACTIVITY STREAM */}
        <section className="lg:col-span-8 glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                Live activity stream · WebSocket
              </div>
              <div className="text-sm font-semibold mt-0.5">Floor events</div>
            </div>
            <span className="text-[10px] font-mono text-primary flex items-center gap-1.5">
              <span className="ticker-dot" /> streaming
            </span>
          </div>
          <ActivityStream />
        </section>

        {/* SIMULATION CARD */}
        <section className="lg:col-span-4 glass-strong rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            Drag‑to‑simulate
          </div>
          <div className="text-sm font-semibold mt-0.5 mb-3">What if?</div>

          <div className="space-y-3">
            {[
              { label: "AGV fleet", value: 142, max: 200 },
              { label: "Pack stations", value: 18, max: 32 },
              { label: "Pick batch size", value: 24, max: 60 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-mono font-semibold text-primary">{s.value}</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.value / s.max) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full text-xs font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition glow">
            Run forecast →
          </button>
          <div className="text-[10px] text-muted-foreground mt-2 font-mono">
            ETA throughput +9.4% · cost −3.1%
          </div>
        </section>
      </main>

      <footer className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground flex items-center justify-between border-t border-border/60">
        <span>AERION v1.0 · spatial twin engine</span>
        <span>{new Date().toISOString()}</span>
      </footer>
    </div>
  );
}
