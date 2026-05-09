import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Sparkles } from "lucide-react";

const PROMPTS = [
  "Why is throughput dropping in zone E?",
  "Simulate adding 2 AGVs to dock 3",
  "Show heatmap from 2 hours ago",
];

const RESPONSES: Record<string, string> = {
  default:
    "Pack-line 2 is forecast to bottleneck in ~8 min. I can reroute 12% of orders through Pack-3 to recover 4.2k units/hr. Want me to draft the change?",
};

export function AICopilot() {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [thread, setThread] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "I'm AERION. Watching 6 zones, 142 AGVs, 38k SKUs in real time." },
  ]);
  const [listening, setListening] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [thread, streaming]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setThread((t) => [...t, { role: "user", text: q }]);
    setInput("");
    const full = RESPONSES[q] ?? RESPONSES.default;
    let i = 0;
    setStreaming("");
    const id = setInterval(() => {
      i += 2;
      setStreaming(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setThread((t) => [...t, { role: "ai", text: full }]);
        setStreaming("");
      }
    }, 22);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center text-white">
          <Sparkles className="w-4 h-4" />
          <span className="absolute inset-0 rounded-lg pulse-ring" />
        </div>
        <div>
          <div className="text-sm font-semibold">AERION Copilot</div>
          <div className="text-[10px] text-muted-foreground font-mono">streaming · spatial-aware</div>
        </div>
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3 min-h-0">
        {thread.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-xs"
                : "max-w-[90%] text-xs text-foreground/85 leading-relaxed"
            }
          >
            {m.text}
          </motion.div>
        ))}
        {streaming && (
          <div className="max-w-[90%] text-xs text-foreground/85 leading-relaxed">
            {streaming}
            <span className="inline-block w-1.5 h-3 bg-primary ml-0.5 align-middle animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => ask(p)}
            className="text-[10px] px-2 py-1 rounded-full border border-border/70 bg-white/70 hover:bg-primary/10 hover:border-primary/40 transition"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 glass rounded-xl px-2 py-1.5"
      >
        <button
          type="button"
          onClick={() => setListening((v) => !v)}
          className={`p-1.5 rounded-lg transition ${listening ? "bg-primary text-white" : "hover:bg-primary/10"}`}
          aria-label="Voice"
        >
          <Mic className="w-3.5 h-3.5" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening…" : "Ask AERION anything…"}
          className="flex-1 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
        />
        <button type="submit" className="p-1.5 rounded-lg bg-primary text-white hover:opacity-90">
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
