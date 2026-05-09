import { motion } from "framer-motion";
import { Boxes, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

const SKUS = [
  { sku: "SKU-30091", name: "Cordless Drill 18V", zone: "A-12", stock: 412, cap: 600, trend: +4.2, status: "ok" },
  { sku: "SKU-21847", name: "Steel Bracket 90°", zone: "B-04", stock: 88, cap: 500, trend: -12.4, status: "low" },
  { sku: "SKU-77210", name: "Polymer Resin 5L", zone: "C-21", stock: 233, cap: 320, trend: +1.1, status: "ok" },
  { sku: "SKU-10456", name: "LED Panel 60x60", zone: "D-09", stock: 14, cap: 240, trend: -28.7, status: "critical" },
  { sku: "SKU-55920", name: "Cable Reel 100m", zone: "E-17", stock: 178, cap: 200, trend: +0.4, status: "ok" },
  { sku: "SKU-33108", name: "Bearing Set M22", zone: "F-02", stock: 67, cap: 400, trend: -8.9, status: "low" },
];

const STATUS = {
  ok: "bg-primary/10 text-primary border-primary/30",
  low: "bg-amber-100 text-amber-700 border-amber-300",
  critical: "bg-red-100 text-red-700 border-red-300",
};

export function InventoryView() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section className="lg:col-span-8 glass-strong rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
              Inventory · live SKU snapshot
            </div>
            <div className="text-sm font-semibold mt-0.5">38 421 SKUs · 6 zones</div>
          </div>
          <Boxes className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-2">
          {SKUS.map((s, i) => {
            const pct = Math.round((s.stock / s.cap) * 100);
            return (
              <motion.div
                key={s.sku}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border/60 bg-white/60"
              >
                <span className="font-mono text-[10px] text-muted-foreground w-20">{s.sku}</span>
                <span className="text-xs font-medium flex-1 truncate">{s.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground w-12">{s.zone}</span>
                <div className="w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono tabular-nums w-16 text-right">
                  {s.stock}/{s.cap}
                </span>
                <span
                  className={`text-[10px] font-mono flex items-center gap-0.5 w-14 justify-end ${
                    s.trend >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {s.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(s.trend)}%
                </span>
                <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${STATUS[s.status as keyof typeof STATUS]}`}>
                  {s.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="lg:col-span-4 glass-strong rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          Replenishment alerts
        </div>
        <div className="text-sm font-semibold mt-0.5 mb-3">2 critical · 2 low</div>
        <div className="space-y-2">
          {SKUS.filter((s) => s.status !== "ok").map((s) => (
            <div key={s.sku} className="flex items-start gap-2 p-2 rounded-lg bg-white/60 border border-border/60">
              <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 ${s.status === "critical" ? "text-red-600" : "text-amber-600"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{s.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {s.sku} · {s.zone} · {s.stock} units left
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
