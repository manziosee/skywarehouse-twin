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

export function LogisticsView({ activeZone }: { activeZone?: string | null }) {
  const isDock = activeZone === "DOCK";
  
  const displayShipments = isDock 
    ? SHIPMENTS.filter(s => s.status === "docking" || s.id === "T-991" || s.id === "T-1340")
    : activeZone 
      ? [
          { id: `AGV-${activeZone}-1`, carrier: "Internal", mode: "truck", from: activeZone, to: "Reserve", eta: "4m", progress: 0.35, status: "transfer" },
          { id: `AGV-${activeZone}-2`, carrier: "Internal", mode: "truck", from: "Intake", to: activeZone, eta: "2m", progress: 0.88, status: "inbound" },
        ]
      : SHIPMENTS;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-8 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black">
              {isDock ? "Terminal · Dock Intelligence" : activeZone ? `Logistics · Sector ${activeZone}` : "Logistics · Live Telemetry"}
            </div>
            <div className="text-xl font-black mt-2 tracking-tighter text-white uppercase italic">
              {isDock ? "3 Vessels Moored" : activeZone ? "2 Active Sector Transfers" : "5 Shipments In-Transit"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/40 grid place-items-center">
            <Truck className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          {displayShipments.map((s, i) => {
            const Icon = ICONS[s.mode as keyof typeof ICONS] || Truck;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all shadow-lg shadow-primary/5 group"
              >
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary border border-primary/40 grid place-items-center shadow-lg shadow-primary/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[12px] font-black text-white tracking-widest">{s.id}</span>
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest">{s.carrier}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20">
                      {s.status}
                    </span>
                    <span className="text-[12px] font-mono font-black tabular-nums text-white bg-primary/20 px-3 py-1 rounded-lg border border-primary/30 min-w-[100px] text-center">
                      {s.status === "departed" ? "DEPARTED" : `ETA ${s.eta}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-white/60 font-black font-mono mb-2 uppercase">
                  <span className="text-white">{s.from}</span>
                  <div className="flex-1 h-px bg-primary/30 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  </div>
                  <span className="text-white">{s.to}</span>
                </div>
                <div className="relative h-2 rounded-full bg-white/10 overflow-hidden shadow-inner mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="lg:col-span-4 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] -z-10" />
        <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black mb-6">
          Bay Utilization
        </div>
        <div className="text-2xl font-black text-white uppercase italic mb-8">8 TERMINAL BAYS</div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => {
            const busy = [0, 2, 3, 6].includes(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`aspect-square rounded-xl grid place-items-center text-[12px] font-mono font-black border-2 transition-all ${
                  busy ? "bg-primary text-white border-primary shadow-xl shadow-primary/30" : "bg-white/5 border-white/20 text-white/40"
                }`}
              >
                B{i + 1}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-10 pt-8 border-t border-primary/20">
          <div className="text-[11px] font-mono uppercase text-primary mb-6 font-black tracking-[0.4em]">FLEET ENERGY TELEMETRY</div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">TRUCK FUEL (SITE AVG)</span>
                <span className="text-sm font-black text-white font-mono shadow-glow">84%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/20 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  className="h-full bg-white shadow-[0_0_15px_white]"
                />
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-black uppercase text-white/30 tracking-tighter italic">
                <span>12 Active Vessels</span>
                <span>4.2k L Remaining</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">AGV MESH ENERGY</span>
                <span className="text-sm font-black text-primary font-mono shadow-glow">91%</span>
              </div>
              <div className="h-3 bg-primary/10 rounded-full overflow-hidden border border-primary/20 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "91%" }}
                  className="h-full bg-primary shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                />
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-black uppercase text-primary/40 tracking-tighter italic">
                <span>142 Active Nodes</span>
                <span>Grid Stable</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
