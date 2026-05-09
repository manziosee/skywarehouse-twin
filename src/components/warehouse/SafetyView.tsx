import { motion } from "framer-motion";
import { ShieldAlert, Users, HardHat, Siren, Clock } from "lucide-react";

export function SafetyView({ activeZone }: { activeZone?: string | null }) {
  const alerts = [
    { id: "S-882", zone: "DOCK", type: "Pedestrian", severity: "low", time: "12m ago", msg: "Human proximity detected in AGV lane 4" },
    { id: "S-879", zone: "E", type: "Obstruction", severity: "med", time: "44m ago", msg: "Loose packing material on conveyor E-02" },
    { id: "S-875", zone: "B", type: "PPE Check", severity: "low", time: "2h ago", msg: "Vision-AI flagged missing safety vest station B-4" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12 h-full">
      <section className="lg:col-span-8 bg-black rounded-[2rem] p-8 border border-primary/30 shadow-2xl shadow-primary/5 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Safety · Active monitoring
            </div>
            <div className="text-3xl font-black mt-2 tracking-tighter text-white uppercase italic">Shield <span className="text-primary">Ops</span> Console</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/40 grid place-items-center">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          {alerts.filter(a => !activeZone || a.zone === activeZone).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-6 p-5 rounded-2xl border-2 ${a.severity === "med" ? "border-white bg-white/10 animate-pulse shadow-lg shadow-white/5" : "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"}`}
            >
              <div className={`w-14 h-14 rounded-xl grid place-items-center shrink-0 shadow-inner ${a.severity === "med" ? "bg-white text-black" : "bg-primary text-white"}`}>
                <Siren className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-sm font-black uppercase tracking-widest ${a.severity === "med" ? "text-white" : "text-primary"}`}>{a.type} Alert</span>
                  <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-md border border-white/30 text-white font-bold">{a.id}</span>
                  <span className="text-[11px] font-mono text-white/60 ml-auto font-bold">{a.time}</span>
                </div>
                <div className="text-sm text-white font-medium leading-relaxed">{a.msg}</div>
              </div>
              <div className="text-[12px] font-mono font-black text-white px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 uppercase tracking-widest">
                ZONE {a.zone}
              </div>
            </motion.div>
          ))}
          
          {activeZone && alerts.filter(a => a.zone === activeZone).length === 0 && (
            <div className="py-20 text-center text-xs text-white font-mono bg-white/5 rounded-[2rem] border-2 border-white/20 border-dashed">
              <span className="opacity-60">NO ACTIVE SAFETY ALERTS IN ZONE</span> <span className="text-primary font-black ml-1">{activeZone}</span>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6">
          {[
            { label: "Personnel", value: "42", unit: "on floor", icon: Users },
            { label: "Compliance", value: "99.8", unit: "%", icon: HardHat, color: "text-primary" },
            { label: "Accident-Free", value: "142", unit: "days", icon: Clock, color: "text-white" },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-2xl border border-primary/20 bg-primary/5 shadow-inner">
              <div className="flex items-center gap-2 text-white text-[11px] uppercase font-black tracking-widest mb-3">
                <s.icon className="w-4 h-4 text-primary" /> {s.label}
              </div>
              <div className={`text-3xl font-black font-mono ${s.color || "text-white"}`}>
                {s.value} <span className="text-[12px] font-bold text-white/50 ml-1 uppercase">{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lg:col-span-4 bg-black rounded-[2rem] p-8 flex flex-col border border-primary/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] -z-10" />
        <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary mb-6 font-bold">
          Hazard Distribution
        </div>
        <div className="flex-1 rounded-2xl bg-white/5 relative overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 animate-pulse" />
          <div className="relative text-center p-8">
            <div className="w-24 h-24 rounded-full bg-white/10 grid place-items-center mx-auto mb-6 shadow-2xl border border-white/20 relative">
               <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
               <ShieldAlert className="w-10 h-10 text-primary" />
            </div>
            <div className="text-sm font-black text-white uppercase tracking-widest">Spatial Awareness Mesh</div>
            <div className="text-[11px] text-primary mt-2 uppercase tracking-[0.3em] font-bold italic">Lidar Fusion Active</div>
          </div>
          
          <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-primary/40 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/20 rounded-full blur-2xl animate-pulse" />
        </div>
        
        <button className="mt-8 w-full py-5 rounded-2xl bg-white text-black text-xs font-black shadow-2xl shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.4em] border-2 border-white">
          <Siren className="w-5 h-5" /> Trigger Floor Evac
        </button>
      </section>
    </div>
  );
}
