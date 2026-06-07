import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  label: string;
  score: number;
  icon: LucideIcon;
  description?: string;
}

export default function ScoreCard({
  label,
  score,
  icon: Icon,
  description,
}: ScoreCardProps) {
  const color =
    score >= 75
      ? "text-emerald-600 bg-emerald-50"
      : score >= 50
        ? "text-amber-600 bg-amber-50"
        : "text-rose-600 bg-rose-50";

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {Math.round(score)}
            <span className="text-lg text-slate-400">/100</span>
          </p>
        </div>
        <span className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </span>
      </div>
      {description && <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>}
    </div>
  );
}

