import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const seed = () =>
  Array.from({ length: 32 }).map((_, i) => ({
    t: i,
    throughput: 4200 + Math.sin(i / 3) * 700 + Math.random() * 400,
    predicted: 4200 + Math.sin(i / 3) * 700 + 200,
  }));

export function MetricsChart() {
  const [data, setData] = useState(seed);
  useEffect(() => {
    const i = setInterval(() => {
      setData((d) => [
        ...d.slice(1),
        {
          t: d[d.length - 1].t + 1,
          throughput: 4200 + Math.sin(Date.now() / 3000) * 700 + Math.random() * 500,
          predicted: 4500 + Math.sin(Date.now() / 3000) * 600,
        },
      ]);
    }, 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={130}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" hide />
        <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #bae6fd",
            borderRadius: 8,
            fontSize: 11,
          }}
        />
        <Area
          type="monotone"
          dataKey="predicted"
          stroke="#7dd3fc"
          strokeDasharray="3 3"
          fill="url(#g2)"
          strokeWidth={1.5}
        />
        <Area type="monotone" dataKey="throughput" stroke="#0ea5e9" fill="url(#g1)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
