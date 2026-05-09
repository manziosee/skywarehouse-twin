import { motion } from "framer-motion";
import { Truck, Plane, Ship } from "lucide-react";

const SHIPMENTS = [
  { id: "T-991", carrier: "DHL", mode: "truck", from: "Hamburg", to: "STK-07", eta: "12m", progress: 0.92, status: "docking" },
  { id: "T-1024", carrier: "Maersk", mode: "ship", from: "Rotterdam", to: "Göteborg", eta: "4h 12m", progress: 0.41, status: "in-transit" },
  { id: "T-1188", carrier: "FedEx", mode: "plane", from: "Memphis", to: "ARN", eta: "1h 38m", progress: 0.74, status: "in-transit" },
  { id: "T-1201", carrier: "DSV", mode: "truck", from: "Oslo", to: "STK-07", eta: "55m", progress: 0.62, status: "in-transit" },
  { id: "T-1340", carrier: "PostNord", mode: "truck", from: "STK-07", to: "Malmö", eta: "departed", progress: 0.08, status: "outbound" },
];

const ICONS = { truck: Truck, plane: Plane, ship: Ship };

export function LogisticsView() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section className="lg:col-span-8 glass-strong rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
              Logistics · live shipments
            </div>
            <div className="text-sm font-semibold mt-0.5">5 active · 1 docking now</div>
          </div>
          <Truck className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-3">
          {SHIPMENTS.map((s, i) => {
            const Icon = ICONS[s.mode as keyof typeof ICONS];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-2.5 rounded-xl border border-border/60 bg-white/60"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 grid place-items-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold">{s.id}</span>
                  <span className="text-[10px] text-muted-foreground">{s.carrier}</span>
                  <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {s.status}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-foreground/80">ETA {s.eta}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mb-1">
                  <span>{s.from}</span>
                  <span className="flex-1 h-px bg-border" />
                  <span>{s.to}</span>
                </div>
                <div className="relative h-1 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="lg:col-span-4 glass-strong rounded-2xl p-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          Dock utilization
        </div>
        <div className="text-sm font-semibold mt-0.5 mb-3">8 dock doors</div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => {
            const busy = [0, 2, 3, 6].includes(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`aspect-square rounded-lg grid place-items-center text-[10px] font-mono border ${
                  busy ? "bg-primary text-white border-primary glow" : "bg-white/60 border-border/60 text-muted-foreground"
                }`}
              >
                D{i + 1}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-muted-foreground">On-time rate</span><span className="font-mono font-semibold text-primary">96.3%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Avg dock turn</span><span className="font-mono font-semibold">28 min</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Carbon / parcel</span><span className="font-mono font-semibold">0.41 kg</span></div>
        </div>
      </section>
    </div>
  );
}
