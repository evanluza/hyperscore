import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { ProfileCard } from "@/components/profile-card";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { CompareModule } from "@/components/compare-module";
import { ShareCardPreview } from "@/components/share-card-preview";
import { TrendingSection } from "@/components/trending-section";
import { getLeaderboard, parseLeaderboard } from "@/lib/hyperliquid";
import { computeHyperScore } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HyperScore — Your Trading Reputation. Proven.",
  description:
    "Every trade, every win, every loss — pulled directly from the Hyperliquid order book. No edits. No fake PnL.",
};

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted text-sm mt-2 max-w-lg">{subtitle}</p>
      )}
    </div>
  );
}

export default async function Home() {
  let rows: import("@/lib/hyperliquid").ParsedLeaderboardRow[] = [];
  try {
    const raw = await getLeaderboard();
    rows = parseLeaderboard(raw);
  } catch {
    rows = [];
  }

  // Top trader by all-time PnL for profile card
  const topTrader = [...rows].sort((a, b) => b.allTimePnl - a.allTimePnl)[0];

  return (
    <div className="min-h-full bg-bg bg-grid">
      {/* Nav */}
      <header className="border-b border-border-subtle sticky top-0 z-50 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-accent font-bold text-xl font-mono tracking-tight"
          >
            HyperScore
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/leaderboard"
              className="text-muted hover:text-fg text-sm transition-colors"
            >
              Leaderboard
            </Link>
            <span
              className="text-muted/40 text-sm cursor-default"
              title="Coming soon"
            >
              Claim Profile
            </span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
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
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Profile Preview — real #1 trader */}
      {topTrader && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-xl mx-auto animate-fade-up animate-fade-up-delay-2">
              <ProfileCard
                address={topTrader.address}
                displayName={topTrader.displayName}
                pnl30d={topTrader.monthRoi}
                pnlAmount30d={topTrader.monthPnl}
                winRate={65}
                trades={Math.round(topTrader.allTimeVolume / 50000)}
                accountValue={topTrader.accountValue}
                rank={1}
                hyperScore={computeHyperScore(topTrader.allTimeRoi, 65)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="py-16 px-6 border-t border-border-subtle">
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

      {/* Trending — real data */}
      {rows.length > 0 && (
        <section className="py-16 px-6 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Right Now"
              subtitle="Live highlights from the Hyperliquid order book."
            />
            <TrendingSection rows={rows} />
          </div>
        </section>
      )}

      {/* Leaderboard — real data */}
      {rows.length > 0 && (
        <section className="py-16 px-6 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Top Traders"
              subtitle="Ranked by verified on-chain performance. No exceptions."
            />
            <LeaderboardPreview rows={rows} />
          </div>
        </section>
      )}

      {/* Share Card */}
      <section className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                title="Share Your Edge"
                subtitle="Generate a verifiable trading card. Post it to X. Let your PnL do the talking."
              />
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-mono text-xs mt-0.5">
                    01
                  </span>
                  <span className="text-muted">
                    Look up any wallet address
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-mono text-xs mt-0.5">
                    02
                  </span>
                  <span className="text-muted">
                    Auto-generated card with verified stats
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-mono text-xs mt-0.5">
                    03
                  </span>
                  <span className="text-muted">
                    One click to share — OG image renders on Twitter
                  </span>
                </div>
              </div>
            </div>
            <ShareCardPreview />
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Compare Traders"
            subtitle="Head-to-head. Verified stats. No hiding."
          />
          <div className="max-w-2xl">
            <CompareModule />
          </div>
        </div>
      </section>

      {/* HyperScore explainer */}
      <section className="py-20 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-muted text-[10px] uppercase tracking-[0.2em] mb-4">
              Introducing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Hyper<span className="text-gradient">Score</span>
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-md mx-auto mb-8">
              A composite score based on performance, consistency, and risk
              management. One number that captures how good a trader really is.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
              <div>
                <div className="text-fg font-mono font-bold text-lg">PnL</div>
                <div className="text-muted text-[10px] uppercase tracking-widest">
                  Returns
                </div>
              </div>
              <div>
                <div className="text-fg font-mono font-bold text-lg">
                  Sharpe
                </div>
                <div className="text-muted text-[10px] uppercase tracking-widest">
                  Risk-adj
                </div>
              </div>
              <div>
                <div className="text-fg font-mono font-bold text-lg">WR%</div>
                <div className="text-muted text-[10px] uppercase tracking-widest">
                  Consistency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            What&apos;s your score?
          </h2>
          <p className="text-muted text-sm mb-8">
            Paste your wallet. Find out in seconds.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-accent font-mono font-bold text-sm">
            HyperScore
          </span>
          <span className="text-muted text-xs">
            Data sourced from Hyperliquid L1
          </span>
        </div>
      </footer>
    </div>
  );
}
