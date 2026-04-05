"use client";

import { useEffect, useRef } from "react";

interface EquityChartProps {
  data: [number, number][];
  height?: number;
}

export function EquityChart({ data, height = 200 }: EquityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 10, right: 10, bottom: 10, left: 10 };

    const values = data.map((d) => d[1]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const startVal = values[0];
    const endVal = values[values.length - 1];
    const isPositive = endVal >= startVal;

    const lineColor = isPositive ? "#97fce4" : "#f0444c";
    const fillColor = isPositive
      ? "rgba(151, 252, 228, 0.08)"
      : "rgba(240, 68, 76, 0.08)";

    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    function xPos(i: number) {
      return padding.left + (i / (data.length - 1)) * chartW;
    }
    function yPos(val: number) {
      return padding.top + chartH - ((val - min) / range) * chartH;
    }

    ctx.clearRect(0, 0, w, h);

    // Fill area
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(values[0]));
    for (let i = 1; i < values.length; i++) {
      ctx.lineTo(xPos(i), yPos(values[i]));
    }
    ctx.lineTo(xPos(values.length - 1), h - padding.bottom);
    ctx.lineTo(xPos(0), h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(values[0]));
    for (let i = 1; i < values.length; i++) {
      ctx.lineTo(xPos(i), yPos(values[i]));
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [data, height]);

  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-muted text-sm"
        style={{ height }}
      >
        No chart data available
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height }}
    />
  );
}
