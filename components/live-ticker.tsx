"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { shortenAddress, formatPnl } from "@/lib/utils";
import type { ParsedLeaderboardRow } from "@/lib/hyperliquid";

interface Props {
  rows: ParsedLeaderboardRow[];
}

interface TickerItem {
  text: string;
  color: string;
  href?: string;
}

function buildItems(rows: ParsedLeaderboardRow[]): TickerItem[] {
  const items: TickerItem[] = [];
  const topDay = [...rows].sort((a, b) => b.dayPnl - a.dayPnl);
  const bottomDay = [...rows].sort((a, b) => a.dayPnl - b.dayPnl);

  if (topDay[0] && topDay[0].dayPnl > 0) {
    const r = topDay[0];
    items.push({
      text: `${r.displayName || shortenAddress(r.address)} just hit ${formatPnl(r.dayPnl)} today`,
      color: "text-green",
      href: `/trader/${r.address}`,
    });
  }
  if (topDay[1] && topDay[1].dayPnl > 0) {
    const r = topDay[1];
    items.push({
      text: `${r.displayName || shortenAddress(r.address)} up ${formatPnl(r.dayPnl)} in 24h`,
      color: "text-green",
      href: `/trader/${r.address}`,
    });
  }
  if (bottomDay[0] && bottomDay[0].dayPnl < 0) {
    const r = bottomDay[0];
    items.push({
      text: `Biggest loss today: ${formatPnl(r.dayPnl)} by ${r.displayName || shortenAddress(r.address)}`,
      color: "text-red",
      href: `/trader/${r.address}`,
    });
  }

  const topWeek = [...rows].sort((a, b) => b.weekPnl - a.weekPnl)[0];
  if (topWeek && topWeek.weekPnl > 0) {
    items.push({
      text: `${topWeek.displayName || shortenAddress(topWeek.address)} made ${formatPnl(topWeek.weekPnl)} this week`,
      color: "text-green",
      href: `/trader/${topWeek.address}`,
    });
  }

  const topRoi = [...rows].sort((a, b) => b.allTimeRoi - a.allTimeRoi)[0];
  if (topRoi) {
    items.push({
      text: `${topRoi.displayName || shortenAddress(topRoi.address)} all-time ROI: +${topRoi.allTimeRoi.toFixed(0)}%`,
      color: "text-accent",
      href: `/trader/${topRoi.address}`,
    });
  }

  return items;
}

export function LiveTicker({ rows }: Props) {
  const items = buildItems(rows);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let raf: number;
    function step() {
      pos -= speed;
      if (pos <= -(el!.scrollWidth / 2)) pos = 0;
      el!.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (items.length === 0) return null;

  // Double the items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="border-b border-border-subtle bg-surface/50 overflow-hidden">
      <div className="flex items-center py-2">
        <div className="shrink-0 px-4 border-r border-border-subtle mr-4">
          <span className="text-[9px] uppercase tracking-widest text-accent font-mono font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div ref={scrollRef} className="flex items-center gap-8 whitespace-nowrap w-fit">
            {doubled.map((item, i) => (
              <Link
                key={i}
                href={item.href || "/"}
                className={`text-xs font-mono ${item.color} hover:opacity-80 transition-opacity flex items-center gap-2`}
              >
                <span className="text-muted/40">///</span>
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
