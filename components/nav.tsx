import Link from "next/link";

interface NavProps {
  active?: "home" | "leaderboard" | "trending" | "compare";
}

export function Nav({ active }: NavProps) {
  return (
    <header className="border-b border-border-subtle sticky top-0 z-50 bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-accent font-bold text-xl font-mono tracking-tight"
        >
          HyperScore
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/leaderboard"
            className={`text-sm transition-colors ${active === "leaderboard" ? "text-fg font-medium" : "text-muted hover:text-fg"}`}
          >
            Leaderboard
          </Link>
          <Link
            href="/trending"
            className={`text-sm transition-colors ${active === "trending" ? "text-fg font-medium" : "text-muted hover:text-fg"}`}
          >
            Trending
          </Link>
          <Link
            href="/compare"
            className={`text-sm transition-colors ${active === "compare" ? "text-fg font-medium" : "text-muted hover:text-fg"}`}
          >
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
