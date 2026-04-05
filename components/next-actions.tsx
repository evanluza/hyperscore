import Link from "next/link";

interface NextActionsProps {
  currentAddress?: string;
  exclude?: string[];
}

export function NextActions({ currentAddress, exclude = [] }: NextActionsProps) {
  const actions = [
    !exclude.includes("compare") && currentAddress && {
      href: `/compare?a=${currentAddress}`,
      label: "Compare with another trader",
      icon: "vs",
    },
    !exclude.includes("leaderboard") && {
      href: "/leaderboard",
      label: "View full leaderboard",
      icon: "#",
    },
    !exclude.includes("trending") && {
      href: "/trending",
      label: "See who's trending",
      icon: "^",
    },
  ].filter(Boolean) as { href: string; label: string; icon: string }[];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="glass glass-hover rounded-lg px-4 py-2.5 text-sm text-muted hover:text-accent transition-all flex items-center gap-2"
        >
          <span className="font-mono text-accent text-xs">{a.icon}</span>
          {a.label}
        </Link>
      ))}
    </div>
  );
}
