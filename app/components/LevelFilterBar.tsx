import Link from "next/link";

import type { LevelFilter } from "@/app/lib/search";

const options: { label: string; value: LevelFilter }[] = [
  { label: "All HSK Levels", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

function buildHref(basePath: string, q: string, level: LevelFilter) {
  const params = new URLSearchParams();

  if (q.trim()) params.set("q", q.trim());
  if (level !== "all") params.set("level", level);
  params.set("page", "1");

  return `${basePath}?${params.toString()}`;
}

export default function LevelFilterBar({
  q,
  level,
  basePath = "/words",
}: {
  q: string;
  level: LevelFilter;
  basePath?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {options.map((option) => {
        const active = level === option.value;

        return (
          <Link
            key={option.value}
            href={buildHref(basePath, q, option.value)}
            className={[
              "flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition",
              active
                ? "border-[#ff9900] bg-[#ff9900] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
            ].join(" ")}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}