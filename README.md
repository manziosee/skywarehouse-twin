# AERION — Warehouse Activity Twin

A futuristic, real‑time digital twin for warehouse operations. AERION fuses a live 3D model of the floor with predictive overlays, AI copilots, voice control, and temporal replay — letting operators see, simulate, and steer activity across every zone.

![AERION logo](src/assets/aerion-logo.png)

## ✦ The Experience

- **Live 3D twin** — orbiting WebGL view of racks, AGVs, and dock activity
- **Particle flows** — every order, scan and AGV is a glowing particle between services
- **Interactive system map** — zoomable graph from Intake → Sort → Pick → Pack → Ship
- **Predictive heatmap** — bottlenecks visualised before they happen
- **AI copilot** — streaming, spatial‑aware assistant with voice input
- **Drag‑to‑simulate** futures and **temporal replay** ("show me the floor 2 hours ago")
- **Real‑time metrics** — throughput, dwell time, accuracy, predicted vs actual

## ✦ Stack

Frontend‑only futurism, built with:

| Capability | Tech |
|---|---|
| Framework | **React 19 + TypeScript** (TanStack Start, SSR‑ready) |
| 3D / WebGL | **Three.js** |
| Motion | **Framer Motion** |
| Data viz | **D3.js** + **Recharts** |
| Live updates | Simulated **WebSocket** stream (swap for real WS) |
| AI UI | Streaming token UI · voice input · prompt chips |
| Spatial nav | Canvas + SVG, keyboard & pointer |
| Styling | Tailwind v4 with semantic sky‑blue / white design system |

> The brief mentioned Next.js — this template ships with TanStack Start (also React + TS + SSR + file‑based routing). All listed frontend capabilities are implemented; the platform layer is interchangeable.

## ✦ Run it

```bash
bun install
bun run dev
```

Open http://localhost:5173.

## ✦ Logo

The mark is an isometric cube of light beams orbited by a thin ring — a warehouse made of data. Sky blue (`#38bdf8`) on white. See `src/assets/aerion-logo.png`.

## ✦ Design system

All colour, motion and depth tokens live in `src/styles.css` (`oklch`). Never hardcode colours in components — use `bg-primary`, `text-foreground`, `glass`, `glow`, etc.
