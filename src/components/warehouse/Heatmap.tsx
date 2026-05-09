import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Cell = { x: number; y: number; v: number };

export function Heatmap() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const cols = 14;
    const rows = 7;
    const data: Cell[] = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const cx = (x - cols / 2) / cols;
        const cy = (y - rows / 2) / rows;
        const v = Math.exp(-(cx * cx + cy * cy) * 4) + Math.random() * 0.35;
        data.push({ x, y, v });
      }

    const w = 380;
    const h = 180;
    const cw = w / cols;
    const ch = h / rows;
    svg.attr("viewBox", `0 0 ${w} ${h}`).selectAll("*").remove();
    const color = d3.scaleSequential(d3.interpolateRgbBasis(["#000000", "#0c4a6e", "#0ea5e9"])).domain([0, 1.3]);

    const g = svg.append("g");
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => d.x * cw + 1)
      .attr("y", (d) => d.y * ch + 1)
      .attr("width", cw - 2)
      .attr("height", ch - 2)
      .attr("rx", 3)
      .attr("fill", (d) => color(d.v))
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => i * 8)
      .duration(400)
      .attr("opacity", 1);

    let t = 0;
    const interval = setInterval(() => {
      t += 1;
      g.selectAll<SVGRectElement, Cell>("rect")
        .data(data.map((d) => ({ ...d, v: d.v * (0.85 + Math.sin(t * 0.3 + d.x + d.y) * 0.3) })))
        .transition()
        .duration(800)
        .attr("fill", (d) => color(d.v));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return <svg ref={ref} className="w-full h-auto" />;
}
