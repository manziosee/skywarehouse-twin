import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Boxes,
  Cpu,
  Gauge,
  MapPin,
  Radio,
  Truck,
  Zap,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/aerion-logo.png";
import { WarehouseTwin3D } from "@/components/warehouse/WarehouseTwin3D";
import { ActivityStream } from "@/components/warehouse/ActivityStream";
import { Heatmap } from "@/components/warehouse/Heatmap";
import { ConnectivityMesh } from "@/components/warehouse/ConnectivityMesh";
import { SystemMap } from "@/components/warehouse/SystemMap";
import { AICopilot } from "@/components/warehouse/AICopilot";
import { TemporalReplay } from "@/components/warehouse/TemporalReplay";
import { MetricsChart } from "@/components/warehouse/MetricsChart";
import { InventoryView } from "@/components/warehouse/InventoryView";
import { LogisticsView } from "@/components/warehouse/LogisticsView";
import { AIView } from "@/components/warehouse/AIView";
import { SustainabilityView } from "@/components/warehouse/SustainabilityView";
import { SafetyView } from "@/components/warehouse/SafetyView";
import { Leaf, ShieldAlert, CloudRain, Wind } from "lucide-react";

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

type Tab = "Operations" | "Inventory" | "Logistics" | "AI" | "Sustainability" | "Safety";

type ZoneMetrics = {
  label: string;
  throughput: { value: string; unit: string };
  dwell: { value: string; unit: string };
  accuracy: { value: string; unit: string };
  agvs: number;
  skus: string;
  status: string;
};

const ZONE_DATA: Record<string, ZoneMetrics> = {
  ALL: { label: "All zones", throughput: { value: "4.8k", unit: "u/hr" }, dwell: { value: "12.4", unit: "min" }, accuracy: { value: "99.7", unit: "%" }, agvs: 142, skus: "38 421", status: "nominal" },
  A:   { label: "Zone A · Bulk intake", throughput: { value: "1.2k", unit: "u/hr" }, dwell: { value: "8.1",  unit: "min" }, accuracy: { value: "99.9", unit: "%" }, agvs: 24, skus: "5 211",  status: "nominal" },
  B:   { label: "Zone B · Reserve",     throughput: { value: "0.9k", unit: "u/hr" }, dwell: { value: "21.4", unit: "min" }, accuracy: { value: "99.4", unit: "%" }, agvs: 18, skus: "12 080", status: "elevated" },
  C:   { label: "Zone C · Fast pick",   throughput: { value: "2.1k", unit: "u/hr" }, dwell: { value: "4.7",  unit: "min" }, accuracy: { value: "99.8", unit: "%" }, agvs: 31, skus: "6 940",  status: "nominal" },
  D:   { label: "Zone D · Cold chain",  throughput: { value: "0.6k", unit: "u/hr" }, dwell: { value: "18.9", unit: "min" }, accuracy: { value: "99.6", unit: "%" }, agvs: 12, skus: "2 184",  status: "nominal" },
  E:   { label: "Zone E · Pack lines",  throughput: { value: "3.4k", unit: "u/hr" }, dwell: { value: "6.2",  unit: "min" }, accuracy: { value: "98.9", unit: "%" }, agvs: 27, skus: "—",      status: "bottleneck" },
  F:   { label: "Zone F · Returns",     throughput: { value: "0.4k", unit: "u/hr" }, dwell: { value: "32.1", unit: "min" }, accuracy: { value: "97.8", unit: "%" }, agvs: 9,  skus: "1 504",  status: "elevated" },
  DOCK:{ label: "Dock · Outbound",      throughput: { value: "5.2k", unit: "u/hr" }, dwell: { value: "2.8",  unit: "min" }, accuracy: { value: "99.9", unit: "%" }, agvs: 21, skus: "—",      status: "nominal" },
};

const ZONES = ["A", "B", "C", "D", "E", "F", "DOCK"];

const STATUS_COLOR: Record<string, string> = {
  nominal: "text-primary bg-primary/10 border-primary/30",
  elevated: "text-white bg-white/10 border-white/30",
  bottleneck: "text-white bg-white/20 border-white/50 animate-pulse",
};

function Index() {
  const [replay, setReplay] = useState(1);
  const [zone, setZone] = useState<string | null>("E");
  const [tab, setTab] = useState<Tab>("Operations");
  const [forecast, setForecast] = useState<null | { throughput: number; cost: number; co2: number }>(null);
  const [forecasting, setForecasting] = useState(false);

  const m = useMemo(() => ZONE_DATA[zone ?? "ALL"] ?? ZONE_DATA.ALL, [zone]);

  const stats = [
    { label: "Throughput", value: m.throughput.value, unit: m.throughput.unit, icon: Zap },
    { label: "Dwell",      value: m.dwell.value,      unit: m.dwell.unit,      icon: Gauge },
    { label: "Accuracy",   value: m.accuracy.value,   unit: m.accuracy.unit,   icon: Radio },
  ];

  const runForecast = () => {
    setForecasting(true);
    setForecast(null);
    setTimeout(() => {
      setForecast({
        throughput: 8 + Math.random() * 6,
        cost: -(2 + Math.random() * 3),
        co2: -(1 + Math.random() * 4),
      });
      setForecasting(false);
    }, 1400);
  };

  const tabs: { label: Tab; icon: any }[] = [
    { label: "Operations", icon: Activity },
    { label: "Inventory", icon: Boxes },
    { label: "Logistics", icon: Truck },
    { label: "AI", icon: Cpu },
    { label: "Sustainability", icon: Leaf },
    { label: "Safety", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-50 font-sans selection:bg-primary selection:text-white">
      {/* PHASE 1: GLOBAL EVENT TICKER */}
      <div className="h-6 bg-primary/10 border-b border-primary/30 flex items-center overflow-hidden z-50">
        <div className="flex whitespace-nowrap animate-marquee py-0.5">
          {[
            "🛰️ SHIP T-1024 ARRIVING AT DOCK BAY 12 IN 14M",
            "⚠️ ZONE E BOTTLE-NECK DETECTED — AGV-204 REROUTED",
            "⚡ SOLAR ARRAY OUTPUT: 104% CAPACITY",
            "🛡️ SITE-WIDE COMPLIANCE: 99.8% (OPTIMAL)",
            "📦 INBOUND SURGE FROM PORT ROTTERDAM",
            "🛰️ AGV FLEET SYNC · 142 NODES",
            "🔋 BATTERY MESH 87% AVG · 4 CHARGING",
            "🌡️ COLD CHAIN ZONE D · -18°C STABLE",
          ].concat([
            "🛰️ SHIP T-1024 ARRIVING AT DOCK BAY 12 IN 14M",
            "⚠️ ZONE E BOTTLE-NECK DETECTED — AGV-204 REROUTED",
            "⚡ SOLAR ARRAY OUTPUT: 104% CAPACITY",
            "🛡️ SITE-WIDE COMPLIANCE: 99.8% (OPTIMAL)",
            "📦 INBOUND SURGE FROM PORT ROTTERDAM",
            "🛰️ AGV FLEET SYNC · 142 NODES",
            "🔋 BATTERY MESH 87% AVG · 4 CHARGING",
            "🌡️ COLD CHAIN ZONE D · -18°C STABLE",
          ]).map((text, i) => (
            <span key={i} className="text-[8px] font-black uppercase tracking-[0.35em] text-primary mx-8">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header className="h-12 shrink-0 flex items-center px-5 bg-black border-b border-primary/30 z-40 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary shadow shadow-primary/20 grid place-items-center">
            <img src={logo} alt="AERION" width={18} height={18} className="brightness-0 invert" />
          </div>
          <div className="text-[13px] font-black tracking-tighter leading-none">
            <span className="text-primary uppercase italic">AERION</span>
            <span className="text-white font-normal ml-2 uppercase tracking-widest text-[8px]">/ STK‑07</span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-6 ml-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[9px] font-mono text-white font-black uppercase tracking-widest">
              {m.agvs} NODES · {m.skus} SKUS · {m.label}
            </span>
          </div>

          <div className="h-4 w-px bg-primary/20" />

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Weather</span>
                <span className="text-[9px] font-mono text-primary font-black uppercase">Rain · 8°C</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Wind</span>
                <span className="text-[9px] font-mono text-primary font-black uppercase">12 km/h NE</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Power</span>
                <span className="text-[9px] font-mono text-primary font-black uppercase">2.4 MW · 104%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20">
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">Efficiency</span>
                <span className="text-[11px] font-black text-primary font-mono">-8.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-2.5 py-1 rounded-md bg-primary/5 border border-primary/20">
            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Orders</span>
            <span className="text-[10px] font-mono font-black text-primary">1 284 ▲</span>
            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">SLA</span>
            <span className="text-[10px] font-mono font-black text-primary">98.6%</span>
          </div>
          <div className="flex flex-col items-end leading-tight">
            <div className="text-[10px] font-mono text-white font-black tracking-[0.2em]">
              {new Date().toISOString().split('T')[1].split('.')[0]} UTC
            </div>
            <div className="text-[8px] text-primary font-black uppercase tracking-widest">Live Link</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/40 grid place-items-center cursor-pointer hover:bg-primary hover:text-white transition-all group">
             <Radio className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* SIDEBAR TABS */}
        <aside className="w-14 shrink-0 flex flex-col items-center py-3 gap-1.5 border-r border-white/10 bg-black z-30">
          {tabs.map((item) => {
            const active = tab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setTab(item.label)}
                title={item.label}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all group relative ${
                  active
                    ? "bg-primary text-primary-foreground glow shadow-primary/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${active ? "scale-110" : "group-hover:scale-110 transition-transform"}`} />
                <span className="text-[6px] uppercase tracking-tight font-bold">{item.label.slice(0, 4)}</span>
                {active && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute -left-0.5 w-0.5 h-4 bg-primary rounded-r-full"
                  />
                )}
              </button>
            );
          })}
          <div className="mt-auto pt-3 border-t border-white/10 w-8 flex flex-col gap-2.5 items-center opacity-60">
            <MapPin className="w-3 h-3 cursor-pointer hover:text-white transition" />
            <Activity className="w-3 h-3 cursor-pointer hover:text-white transition" />
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-black relative">
          {/* FLOW ACTIVITY - BIG 3D VIEWER */}
          <div className="h-[85vh] relative overflow-hidden">
            <WarehouseTwin3D replayProgress={replay} activeZone={zone} />
            
            {/* HUD OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none p-8 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="bg-black p-6 rounded-[2rem] border-2 border-primary/40 shadow-2xl">
                  <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black">
                    Spatial Intelligence · v1.0.4
                  </div>
                  <h1 className="text-5xl font-black tracking-tighter text-white mt-2 uppercase italic">
                    Floor <span className="text-primary">Activity</span>
                  </h1>
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`text-[11px] uppercase tracking-[0.3em] font-black px-3 py-1 rounded-lg border-2 ${STATUS_COLOR[m.status]}`}>
                      {m.status}
                    </span>
                    <span className="text-[12px] text-white font-mono tracking-tight font-black uppercase">{m.label}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pointer-events-auto">
                  {stats.map((s) => (
                    <motion.div
                      key={s.label + s.value}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-black rounded-[2rem] px-8 py-6 border-2 border-primary/40 min-w-[240px] shadow-2xl"
                    >
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-[12px] uppercase tracking-[0.4em] text-white font-black">{s.label}</span>
                        <s.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="font-mono text-4xl font-black tabular-nums text-white tracking-tighter">
                        {s.value}
                        <span className="text-sm text-primary ml-2 font-black uppercase">{s.unit}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between">
                {/* Zone Select */}
                <div className="flex flex-wrap gap-3 pointer-events-auto max-w-lg">
                  <button
                    onClick={() => setZone(null)}
                    className={`text-[11px] font-black font-mono px-6 py-3 rounded-2xl border-2 transition-all tracking-widest ${
                      zone === null
                        ? "bg-primary text-white border-primary shadow-2xl shadow-primary/40"
                        : "bg-black border-white/20 text-white/60 hover:border-primary hover:text-white"
                    }`}
                  >
                    ALL SECTORS
                  </button>
                  {ZONES.map((z) => (
                    <button
                      key={z}
                      onClick={() => setZone(z)}
                      className={`text-[11px] font-black font-mono px-6 py-3 rounded-2xl border-2 transition-all tracking-widest ${
                        zone === z
                          ? "bg-primary text-white border-primary shadow-2xl shadow-primary/40"
                          : "bg-black border-white/20 text-white/60 hover:border-primary hover:text-white"
                    }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>

                {/* Replay */}
                <div className="w-[450px] pointer-events-auto bg-black rounded-[2rem] px-8 py-6 border-2 border-primary/30 shadow-2xl">
                  <TemporalReplay value={replay} onChange={setReplay} />
                </div>
              </div>
            </div>
          </div>

          {/* CONTEXTUAL ANALYSIS - BROUGHT DOWN */}
          <div className="p-12 space-y-12 bg-black">
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-12">
                <div className="mb-8 border-b-2 border-primary/20 pb-6">
                  <div className="text-[12px] font-mono uppercase tracking-[0.5em] text-primary mb-3 font-black">
                    Operational Intelligence Deck
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">{tab} <span className="text-primary font-normal">/</span> Analysis</h2>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tab === "Operations" && (
                      <div className="grid grid-cols-12 gap-8">
                        <section className="col-span-4 bg-black rounded-[2.5rem] p-10 border-2 border-primary/30 shadow-2xl">
                          <div className="text-[12px] font-mono uppercase tracking-[0.4em] text-primary mb-8 font-black">Real-Time Activity Stream</div>
                          <ActivityStream activeZone={zone} />
                        </section>
                        
                        <section className="col-span-4 bg-black rounded-[2.5rem] p-10 border-2 border-primary/30 relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                          <div className="text-[12px] font-mono uppercase tracking-[0.4em] text-primary mb-8 font-black">Fleet Simulation Control</div>
                          <div className="space-y-8">
                            {[
                              { label: "Active AGV Deployment", value: m.agvs, max: 200 },
                              { label: "Station Load Distribution", value: zone === "E" ? 12 : 18, max: 32 },
                            ].map((s) => (
                              <div key={s.label}>
                                <div className="flex justify-between text-[11px] mb-3 uppercase font-black tracking-widest">
                                  <span className="text-white/60">{s.label}</span>
                                  <span className="font-mono font-black text-primary text-sm">{s.value}</span>
                                </div>
                                <div className="h-3 rounded-full bg-white/10 overflow-hidden shadow-inner">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(s.value / s.max) * 100}%` }}
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={runForecast} disabled={forecasting} className="mt-12 w-full py-5 rounded-[1.5rem] bg-white text-black text-xs font-black shadow-2xl shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.4em] border-2 border-white">
                            {forecasting ? "Neural Processing..." : "Execute Strategic Forecast"}
                          </button>
                        </section>

                        <section className="col-span-4 bg-black rounded-[2.5rem] p-10 border-2 border-primary/30 shadow-2xl">
                          <ConnectivityMesh />
                        </section>
                      </div>
                    )}
                    {tab === "Inventory" && <InventoryView activeZone={zone} />}
                    {tab === "Logistics" && <LogisticsView activeZone={zone} />}
                    {tab === "AI" && <AIView activeZone={zone} />}
                    {tab === "Sustainability" && <SustainabilityView activeZone={zone} />}
                    {tab === "Safety" && <SafetyView activeZone={zone} />}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            <div className="grid grid-cols-12 gap-8 pt-12 border-t border-primary/20">
              <section className="col-span-5 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl relative overflow-hidden flex flex-col h-[350px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-white font-black">Throughput Stream</div>
                  <div className="flex gap-6 text-[10px] font-mono uppercase font-bold">
                    <span className="text-primary tracking-widest">● Actual</span>
                    <span className="text-white tracking-widest opacity-60">○ Predicted</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <MetricsChart />
                </div>
              </section>

              <section className="col-span-4 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl flex flex-col h-[350px]">
                 <div className="flex items-center justify-between mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-white font-black">Bottleneck Heatmap</div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 grid place-items-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <Heatmap />
                </div>
              </section>

              <section className="col-span-3 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl flex flex-col h-[350px]">
                <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-white font-black mb-6">Service Mesh</div>
                <div className="flex-1 min-h-0">
                  <SystemMap />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <footer className="h-10 shrink-0 flex items-center justify-between px-8 border-t border-primary/40 bg-black text-[10px] font-mono uppercase tracking-[0.3em] text-white font-bold">
        <span className="text-primary">AERION Twin Engine v1.04</span>
        <span className="opacity-100">· STOCKHOLM SITE 7 · SCALE 1:1</span>
        <div className="flex gap-8">
           <span className="text-white">Lat: 59.3293° N</span>
           <span className="text-white">Lon: 18.0686° E</span>
           <span className="text-primary">Alt: 24m MSL</span>
           <span className="text-white underline decoration-primary/50 underline-offset-4">Local Time: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>

      {/* PHASE 4: NEURAL WAVEFORM VOICE UI */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-black/80 border-2 border-primary/30 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Link Active</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, Math.random() * 24, 4] }}
                transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]"
              />
            ))}
          </div>
          <div className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">AERION AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
