import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Event = { id: number; type: string; zone: string; msg: string; ts: string };

const TYPES = ["PICK", "PACK", "SCAN", "SHIP", "INTAKE", "AGV", "ALERT"];
const ZONES = ["A-12", "B-04", "C-21", "D-09", "DOCK-3", "E-17", "F-02"];
const MSGS = [
  "AGV-204 rerouted around aisle blockage",
  "Pick batch #88421 completed in 2m 14s",
  "Predicted bottleneck at packing line in 8m",
  "Inbound truck T-991 docked",
  "SKU 30091 replenished from reserve",
  "Operator handoff at station 12",
  "Vision-AI flagged damaged carton",
];

export function ActivityStream({ activeZone }: { activeZone?: string | null }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const e: Event = {
        id: id++,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        zone: ZONES[Math.floor(Math.random() * ZONES.length)],
        msg: MSGS[Math.floor(Math.random() * MSGS.length)],
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
      setEvents((prev) => [e, ...prev].slice(0, 8));
    };
    tick();
    const i = setInterval(tick, 1800);
    return () => clearInterval(i);
  }, []);

  const filteredEvents = activeZone
    ? events.filter((e) => e.zone.startsWith(activeZone))
    : events;

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl border border-primary/40 bg-black shadow-lg shadow-primary/5"
            >
              <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
              <span className="font-mono text-[11px] text-white font-black tabular-nums">{e.ts}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-primary text-white shadow-sm shadow-primary/20">
                {e.type}
              </span>
              <span className="text-xs text-white font-bold truncate flex-1 tracking-tight">{e.msg}</span>
              <span className="text-[11px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                {e.zone}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="py-8 text-center text-[11px] font-mono text-white font-black uppercase tracking-widest bg-white/5 rounded-xl border border-white/10 border-dashed italic">
            Waiting for zone telemetry stream…
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
