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
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="1" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.8" result="b" />
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
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#bae6fd" strokeWidth="0.4" />
            <motion.circle
              r="0.8"
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
            r="2.8"
            fill="white"
            stroke="#0ea5e9"
            strokeWidth="0.6"
            filter="url(#glow)"
            animate={{ r: [2.8, 3.4, 2.8] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <text
            x={n.x}
            y={n.y - 4}
            fontSize="2.6"
            textAnchor="middle"
            fill="#0c4a6e"
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
