import Link from "next/link";

function buildHref(basePath: string, q: string, category: string) {
  const params = new URLSearchParams();

  if (q.trim()) params.set("q", q.trim());
  if (category !== "all") params.set("category", category);
  params.set("page", "1");

  return `${basePath}?${params.toString()}`;
}

export default function CategoryFilterBar({
  q,
  category,
  categories,
  basePath = "/sentences",
}: {
  q: string;
  category: string;
  categories: string[];
  basePath?: string;
}) {
  const options = ["all", ...categories];

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {options.map((item) => {
        const active = category === item;
        const label = item === "all" ? "All Categories" : item;

        return (
          <Link
            key={item}
            href={buildHref(basePath, q, item)}
            className={[
              "flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition",
              active
                ? "border-[#ff9900] bg-[#ff9900] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}