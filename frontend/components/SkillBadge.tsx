type SkillTone = "matched" | "missing" | "extra" | "neutral";

const tones: Record<SkillTone, string> = {
  matched: "border-emerald-200 bg-emerald-50 text-emerald-700",
  missing: "border-rose-200 bg-rose-50 text-rose-700",
  extra: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function SkillBadge({
  skill,
  tone = "neutral",
}: {
  skill: string;
  tone?: SkillTone;
}) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {skill}
    </span>
  );
}

