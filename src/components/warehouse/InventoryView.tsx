import { motion } from "framer-motion";
import { Boxes, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

const SKUS = [
  // Zone A: Bulk intake
  { sku: "SKU-30091", name: "Cordless Drill 18V", zone: "A-12", stock: 412, cap: 600, trend: +4.2, status: "ok" },
  { sku: "SKU-30092", name: "Impact Driver Pro", zone: "A-05", stock: 120, cap: 200, trend: -2.1, status: "ok" },
  // Zone B: Reserve
  { sku: "SKU-21847", name: "Steel Bracket 90°", zone: "B-04", stock: 88, cap: 500, trend: -12.4, status: "low" },
  { sku: "SKU-21848", name: "Steel Bolt M8 x 50", zone: "B-09", stock: 1200, cap: 2000, trend: +5.4, status: "ok" },
  // Zone C: Fast pick
  { sku: "SKU-77210", name: "Polymer Resin 5L", zone: "C-21", stock: 233, cap: 320, trend: +1.1, status: "ok" },
  { sku: "SKU-77211", name: "Epoxy Hardener B", zone: "C-11", stock: 45, cap: 100, trend: -15.2, status: "low" },
  // Zone D: Cold chain
  { sku: "SKU-10456", name: "Thermal Paste TG", zone: "D-09", stock: 14, cap: 240, trend: -28.7, status: "critical" },
  { sku: "SKU-10457", name: "Coolant Fluid R-4", zone: "D-02", stock: 180, cap: 200, trend: +0.2, status: "ok" },
  // Zone E: Pack lines
  { sku: "SKU-55920", name: "Cable Reel 100m", zone: "E-17", stock: 178, cap: 200, trend: +0.4, status: "ok" },
  { sku: "SKU-55921", name: "Packing Tape High-G", zone: "E-01", stock: 42, cap: 300, trend: -42.1, status: "critical" },
  // Zone F: Returns
  { sku: "SKU-33108", name: "Bearing Set M22", zone: "F-02", stock: 67, cap: 400, trend: -8.9, status: "low" },
  { sku: "SKU-33109", name: "Return Pallet PX", zone: "F-10", stock: 12, cap: 50, trend: +0.0, status: "ok" },
  // Dock
  { sku: "SKU-99001", name: "Master Carton C3", zone: "DOCK-1", stock: 840, cap: 1000, trend: +12.1, status: "ok" },
];

const STATUS = {
  ok: "bg-primary/20 text-white border-primary/40 font-bold",
  low: "bg-white/10 text-white border-white/30 font-black animate-pulse shadow-lg shadow-white/5",
  critical: "bg-primary text-white border-primary font-black animate-pulse shadow-xl shadow-primary/20",
};

export function InventoryView({ activeZone }: { activeZone?: string | null }) {
  const filteredSkus = activeZone
    ? SKUS.filter((s) => s.zone.startsWith(activeZone))
    : SKUS;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-8 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black">
              Inventory Intelligence · {activeZone ? `Zone ${activeZone}` : "Site-Wide Snapshot"}
            </div>
            <div className="text-xl font-black mt-2 tracking-tighter text-white uppercase italic">
              {filteredSkus.length} Items Live <span className="text-primary font-normal">/</span> {activeZone ? `Zone ${activeZone}` : "6 Zones"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/40 grid place-items-center">
            <Boxes className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredSkus.length > 0 ? (
            filteredSkus.map((s, i) => {
              const pct = Math.round((s.stock / s.cap) * 100);
              return (
                <motion.div
                  key={s.sku}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-6 px-5 py-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group shadow-lg shadow-primary/5"
                >
                  <span className="font-mono text-[11px] text-white font-black w-24 tracking-wider">{s.sku}</span>
                  <span className="text-sm font-black text-white flex-1 truncate uppercase tracking-tight">{s.name}</span>
                  <span className="text-[11px] font-mono text-primary font-black w-14 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{s.zone}</span>
                  <div className="w-40 h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className={`h-full ${s.status === 'critical' ? 'bg-white' : 'bg-primary'}`}
                    />
                  </div>
                  <span className="text-[12px] font-mono font-black tabular-nums w-20 text-right text-white">
                    {s.stock} <span className="text-[9px] text-white/40 font-normal">/ {s.cap}</span>
                  </span>
                  <span
                    className={`text-[11px] font-mono font-black flex items-center gap-1 w-16 justify-end ${
                      s.trend >= 0 ? "text-primary" : "text-white"
                    }`}
                  >
                    {s.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(s.trend)}%
                  </span>
                  <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-lg border ${STATUS[s.status as keyof typeof STATUS]}`}>
                    {s.status}
                  </span>
                </motion.div>
              );
            })
          ) : (
            <div className="py-20 text-center text-xs text-white font-mono bg-white/5 rounded-[2rem] border-2 border-white/20 border-dashed">
              NO INVENTORY TELEMETRY FOR THIS SECTOR
            </div>
          )}
        </div>
      </section>

      <section className="lg:col-span-4 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] -z-10" />
        <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black mb-6">
          Replenishment Queue
        </div>
        <div className="text-2xl font-black text-white uppercase italic mb-8">
          2 <span className="text-primary font-normal">CRITICAL</span> · 2 LOW
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          {SKUS.filter((s) => s.status !== "ok").map((s) => (
            <div key={s.sku} className={`flex items-start gap-4 p-4 rounded-2xl border-2 shadow-xl ${s.status === 'critical' ? 'bg-primary border-primary' : 'bg-white/10 border-white'}`}>
              <AlertTriangle className={`w-5 h-5 mt-1 ${s.status === "critical" ? "text-white" : "text-white"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white uppercase tracking-tight truncate">{s.name}</div>
                <div className="text-[11px] text-white/80 font-mono font-black mt-1">
                  {s.sku} · {s.zone} · {s.stock} UNITS
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-primary/20">
          <div className="text-[11px] font-mono uppercase text-primary mb-6 font-black tracking-[0.4em]">LIVE FLOW TELEMETRY</div>
          <div className="space-y-6">
            <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">INBOUND PULSE</span>
                </div>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-4xl font-black text-white font-mono flex items-baseline gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  142
                </motion.span>
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Units / Min</span>
              </div>
              <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </div>
            </div>

            <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />
                  <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">OUTBOUND VELOCITY</span>
                </div>
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <div className="text-4xl font-black text-white font-mono flex items-baseline gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  98
                </motion.span>
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Units / Min</span>
              </div>
              <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
