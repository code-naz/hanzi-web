import Link from "next/link";

type Props = {
  q: string;
  currentPage: number;
  totalPages: number;
  basePath?: string;
  extraParams?: Record<string, string>;
};

function buildHref(
  basePath: string,
  q: string,
  page: number,
  extraParams: Record<string, string> = {},
) {
  const params = new URLSearchParams();

  if (q.trim()) params.set("q", q.trim());

  for (const [key, value] of Object.entries(extraParams)) {
    if (value && value !== "all") params.set(key, value);
  }

  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

export default function Pagination({
  q,
  currentPage,
  totalPages,
  basePath = "/words",
  extraParams = {},
}: Props) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  const buttonClass =
    "inline-flex h-11 items-center justify-center rounded-2xl border px-3 text-xs font-medium whitespace-nowrap transition sm:px-4 sm:text-sm";

  return (
    <nav className="mt-8 grid grid-cols-[auto_1fr_auto] items-center gap-2">
      <div className="justify-self-start">
        {prevDisabled ? (
          <span className={`${buttonClass} border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600`}>
            ← Prev
          </span>
        ) : (
          <Link
            href={buildHref(basePath, q, currentPage - 1, extraParams)}
            className={`${buttonClass} border-slate-200 bg-white text-slate-900 hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-700 dark:bg-slate-900 dark:text-white`}
          >
            ← Prev
          </Link>
        )}
      </div>

      <div className="inline-flex h-11 min-w-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-center text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:text-sm">
        Showing {currentPage} of {totalPages}
      </div>

      <div className="justify-self-end">
        {nextDisabled ? (
          <span className={`${buttonClass} border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600`}>
            Next →
          </span>
        ) : (
          <Link
            href={buildHref(basePath, q, currentPage + 1, extraParams)}
            className={`${buttonClass} border-slate-200 bg-white text-slate-900 hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-700 dark:bg-slate-900 dark:text-white`}
          >
            Next →
          </Link>
        )}
      </div>
    </nav>
  );
}