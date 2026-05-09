import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
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
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis dataKey="t" hide />
        <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
        <Tooltip
          contentStyle={{
            background: "#000000",
            border: "2px solid #0ea5e9",
            borderRadius: "12px",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#ffffff",
            boxShadow: "0 10px 20px rgba(14, 165, 233, 0.2)"
          }}
          itemStyle={{ color: "#ffffff" }}
          cursor={{ stroke: "#0ea5e9", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="predicted"
          stroke="#ffffff"
          strokeDasharray="5 5"
          fill="url(#g2)"
          strokeWidth={2}
          animationDuration={1000}
        />
        <Area 
          type="monotone" 
          dataKey="throughput" 
          stroke="#0ea5e9" 
          fill="url(#g1)" 
          strokeWidth={3} 
          dot={{ r: 2, fill: "#0ea5e9", strokeWidth: 2, stroke: "#000" }}
          activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
