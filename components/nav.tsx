import Link from "next/link";
import Image from "next/image";

interface NavProps {
  active?: "home" | "leaderboard" | "trending" | "compare";
}

export function Nav({ active }: NavProps) {
  return (
    <header className="border-b border-border-subtle sticky top-0 z-50 bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="HyperScore"
            width={120}
            height={22}
            className="sm:w-[140px]"
            priority
          />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/leaderboard"
            className={`text-xs sm:text-sm transition-colors ${active === "leaderboard" ? "text-fg font-medium" : "text-muted hover:text-fg"}`}
          >
            Leaderboard
          </Link>
          <Link
            href="/trending"
            className={`text-xs sm:text-sm transition-colors hidden sm:block ${active === "trending" ? "text-fg font-medium" : "text-muted hover:text-fg"}`}
          >
            Trending
          </Link>
          <Link
            href="/compare"
            className={`text-xs sm:text-sm transition-colors ${active === "compare" ? "text-fg font-medium" : "text-muted hover:text-fg"}`}
          >
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
