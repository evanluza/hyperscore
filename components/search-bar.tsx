"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isValidAddress } from "@/lib/utils";

interface SearchBarProps {
  topTraderAddress?: string;
  topTraderName?: string;
}

export function SearchBar({ topTraderAddress, topTraderName }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!isValidAddress(trimmed)) {
      setError("Enter a valid Ethereum address (0x...)");
      return;
    }
    setError("");
    router.push(`/trader/${trimmed}`);
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Enter wallet or ENS (0x... or name.eth)"
            className="w-full bg-surface border border-border rounded-xl px-5 py-4 pr-28 font-mono text-sm text-fg placeholder:text-muted/50 focus:outline-none focus:border-accent/40 focus:shadow-[0_0_20px_rgba(34,214,138,0.06)] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-bg font-semibold px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Look up
          </button>
        </div>
      </form>
      {error && <p className="text-red text-xs mt-2 ml-1">{error}</p>}
      <div className="flex items-center gap-4 mt-3 ml-1">
        {topTraderAddress && (
          <Link
            href={`/trader/${topTraderAddress}`}
            className="text-muted text-xs hover:text-accent transition-colors"
          >
            Try a top trader{topTraderName ? ` (${topTraderName})` : ""} →
          </Link>
        )}
        <Link
          href="/leaderboard"
          className="text-muted text-xs hover:text-accent transition-colors"
        >
          View leaderboard →
        </Link>
      </div>
    </div>
  );
}
