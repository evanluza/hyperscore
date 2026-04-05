import { SearchBar } from "@/components/search-bar";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { TrendingSection } from "@/components/trending-section";
import { LiveTicker } from "@/components/live-ticker";
import { Nav } from "@/components/nav";
import { getLeaderboard, parseLeaderboard } from "@/lib/hyperliquid";
import type { ParsedLeaderboardRow } from "@/lib/hyperliquid";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HL_REFERRAL_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "HyperScore — Your Trading Reputation. Proven.",
  description:
    "Every trade, every win, every loss — pulled directly from the Hyperliquid order book. No edits. No fake PnL.",
};

export default async function Home() {
  let rows: ParsedLeaderboardRow[] = [];
  try {
    const raw = await getLeaderboard();
    rows = parseLeaderboard(raw);
  } catch {
    rows = [];
  }

  const topTrader = rows.length > 0
    ? [...rows].sort((a, b) => b.allTimePnl - a.allTimePnl)[0]
    : null;

  return (
    <div className="min-h-full bg-bg bg-grid">
      <Nav active="home" />

      {/* Live ticker */}
      {rows.length > 0 && <LiveTicker rows={rows} />}

      {/* Hero — tight, punchy */}
      <section className="pt-16 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-up">
            <h1 className="text-3xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
              Your trading reputation.
              <br />
              <span className="text-gradient">Proven.</span>
            </h1>
            <p className="text-muted text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-3">
              Every trade, every win, every loss — pulled directly from the
              Hyperliquid order book. No edits. No fake PnL.
            </p>
            <p className="text-accent/70 text-sm font-mono">
              Turn your wallet into a public trading profile.
            </p>
          </div>

          <div className="max-w-2xl mx-auto animate-fade-up animate-fade-up-delay-1">
            <SearchBar topTraderAddress={topTrader?.address} topTraderName={topTrader?.displayName || undefined} />
          </div>
        </div>
      </section>

      {/* Top Traders — RIGHT under hero, not buried */}
      {rows.length > 0 && (
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Top Traders Right Now
                </h2>
                <p className="text-muted text-sm mt-1">
                  Real PnL. Real wallets. Updated every minute.
                </p>
              </div>
              <Link
                href="/leaderboard"
                className="text-accent text-sm hover:underline font-medium hidden sm:block"
              >
                Full leaderboard →
              </Link>
            </div>
            <LeaderboardPreview rows={rows} />
          </div>
        </section>
      )}

      {/* Trending highlights */}
      {rows.length > 0 && (
        <section className="py-12 px-4 sm:px-6 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Right Now
                </h2>
                <p className="text-muted text-sm mt-1">
                  Live highlights from the order book.
                </p>
              </div>
              <Link
                href="/trending"
                className="text-accent text-sm hover:underline font-medium hidden sm:block"
              >
                See all trends →
              </Link>
            </div>
            <TrendingSection rows={rows} />
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="py-16 px-4 sm:px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-accent text-2xl font-bold font-mono mb-2">
                Zero
              </div>
              <div className="text-fg text-sm font-medium mb-1">Fake PnL</div>
              <div className="text-muted text-xs">
                Every number verifiable on-chain
              </div>
            </div>
            <div className="text-center">
              <div className="text-accent text-2xl font-bold font-mono mb-2">
                100%
              </div>
              <div className="text-fg text-sm font-medium mb-1">
                Verifiable Trades
              </div>
              <div className="text-muted text-xs">
                Pulled from the Hyperliquid order book
              </div>
            </div>
            <div className="text-center">
              <div className="text-accent text-2xl font-bold font-mono mb-2">
                Built for
              </div>
              <div className="text-fg text-sm font-medium mb-1">
                CT Flexing
              </div>
              <div className="text-muted text-xs">
                Screenshot-worthy share cards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — emotional hook */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-muted text-[10px] uppercase tracking-[0.2em] mb-4">
            Find out in 2 seconds
          </div>
          <h2 className="text-2xl sm:text-5xl font-bold tracking-tight mb-3">
            What&apos;s your{" "}
            <span className="text-gradient">HyperScore</span>?
          </h2>
          <p className="text-muted text-sm mb-8 max-w-md mx-auto">
            Paste your Hyperliquid wallet. Get your verified score, rank, and
            full trading profile instantly.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar topTraderAddress={topTrader?.address} topTraderName={topTrader?.displayName || undefined} />
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <Link
              href="/compare"
              className="text-muted text-sm hover:text-accent transition-colors"
            >
              Compare two traders →
            </Link>
            <Link
              href="/trending"
              className="text-muted text-sm hover:text-accent transition-colors"
            >
              See who&apos;s trending →
            </Link>
          </div>
          <div className="mt-12">
            <a
              href={HL_REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted text-sm hover:text-accent transition-colors border border-border-subtle rounded-lg px-5 py-2.5 hover:border-accent/30"
            >
              Don&apos;t have a Hyperliquid account? Start trading →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="HyperScore" width={20} height={20} className="rounded" />
            <span className="text-accent font-mono font-bold text-sm">
              HyperScore
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted text-xs">
              Data sourced from Hyperliquid L1
            </span>
            <a
              href={HL_REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 text-xs hover:text-accent transition-colors"
            >
              Trade on Hyperliquid
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
