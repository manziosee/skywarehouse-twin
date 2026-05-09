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

export function ActivityStream() {
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

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {events.map((e) => (
          <motion.div
            key={e.id}
            layout
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border/60 bg-white/60"
          >
            <span className="ticker-dot shrink-0" />
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{e.ts}</span>
            <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {e.type}
            </span>
            <span className="text-xs text-foreground/80 truncate flex-1">{e.msg}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{e.zone}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
