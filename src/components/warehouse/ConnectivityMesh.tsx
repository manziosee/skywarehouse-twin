import { motion } from "framer-motion";
import { Network, Wifi, Activity } from "lucide-react";

const NODES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  status: Math.random() > 0.1 ? "online" : "warning",
  latency: Math.floor(Math.random() * 20) + 5,
  load: Math.floor(Math.random() * 40) + 10,
}));

export function ConnectivityMesh() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-black">
            IT Mesh Reliability
          </div>
          <div className="text-xl font-black mt-1 tracking-tighter text-white uppercase italic">Site <span className="text-primary font-normal">/</span> Network Health</div>
        </div>
        <Network className="w-6 h-6 text-primary" />
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        {NODES.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-2xl border-2 flex flex-col justify-between ${
              n.status === "online" 
                ? "bg-primary/5 border-primary/20" 
                : "bg-white/5 border-white/20 animate-pulse"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-[9px] font-black uppercase tracking-widest ${n.status === 'online' ? 'text-primary' : 'text-white'}`}>
                Srv-{n.id}
              </span>
              <div className={`w-2 h-2 rounded-full ${n.status === 'online' ? 'bg-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'bg-white'}`} />
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-mono text-white/40 mb-1 font-black">
                <span>LAT</span>
                <span className="text-white">{n.latency}ms</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${n.load}%` }}
                  className={`h-full ${n.status === 'online' ? 'bg-primary' : 'bg-white'}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">142 AGVs Synced</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Packet Loss: 0.02%</span>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
          Nominal
        </div>
      </div>
    </div>
  );
}
