import { motion } from "framer-motion";

const NODES = [
  { id: "INTAKE", x: 10, y: 50, label: "Intake" },
  { id: "SORT", x: 30, y: 25, label: "Sortation" },
  { id: "STORE", x: 30, y: 75, label: "Storage" },
  { id: "PICK", x: 55, y: 50, label: "Pick" },
  { id: "PACK", x: 75, y: 30, label: "Pack" },
  { id: "SHIP", x: 90, y: 60, label: "Ship" },
];
const LINKS = [
  ["INTAKE", "SORT"],
  ["INTAKE", "STORE"],
  ["SORT", "PICK"],
  ["STORE", "PICK"],
  ["PICK", "PACK"],
  ["PACK", "SHIP"],
];

export function SystemMap() {
  const map = Object.fromEntries(NODES.map((n) => [n.id, n]));
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="link" x1="0" x2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="1" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {LINKS.map(([a, b], i) => {
        const A = map[a];
        const B = map[b];
        return (
          <g key={i}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#0ea5e9" strokeOpacity="0.4" strokeWidth="0.6" />
            <motion.circle
              r="1"
              fill="#0ea5e9"
              filter="url(#glow)"
              initial={{ cx: A.x, cy: A.y }}
              animate={{ cx: [A.x, B.x], cy: [A.y, B.y] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
            />
          </g>
        );
      })}
      {NODES.map((n) => (
        <g key={n.id}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r="3"
            fill="#0ea5e9"
            stroke="white"
            strokeWidth="1"
            filter="url(#glow)"
            animate={{ r: [3, 3.8, 3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <text
            x={n.x}
            y={n.y - 5}
            fontSize="3.5"
            textAnchor="middle"
            fill="white"
            fontWeight="900"
            className="uppercase tracking-widest"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
