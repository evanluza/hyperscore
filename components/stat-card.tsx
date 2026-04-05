interface StatCardProps {
  label: string;
  value: string;
  color?: "green" | "red" | "default";
}

export function StatCard({ label, value, color = "default" }: StatCardProps) {
  const colorClass =
    color === "green"
      ? "text-green"
      : color === "red"
        ? "text-red"
        : "text-fg";

  return (
    <div className="glass glass-hover rounded-xl p-4 transition-all duration-300">
      <div className="text-muted text-[10px] uppercase tracking-widest mb-1.5">
        {label}
      </div>
      <div className={`text-lg font-mono font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
