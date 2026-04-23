import Breadcrumbs from "@/app/components/Breadcrumbs";
import LevelFilterBar from "@/app/components/LevelFilterBar";
import Pagination from "@/app/components/Pagination";
import WordCard from "@/app/components/WordCard";
import { searchEntries, type LevelFilter } from "@/app/lib/search";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    level?: string;
    page?: string;
  }>;
};

const allowedLevels = new Set(["all", "beginner", "intermediate", "advanced"]);

export default async function WordsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q : "";
  const rawLevel = typeof params.level === "string" ? params.level : "all";
  const level = allowedLevels.has(rawLevel) ? rawLevel : "all";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const results = await searchEntries({
    query: q,
    page,
    pageSize: 12,
    level: level as LevelFilter,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Words" },
        ]}
      />

      <section className="mt-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Words
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Search by simplified Hanzi, pinyin, or English meaning.
        </p>

        <form method="GET" action="/words" className="mt-6 space-y-4">
          <input type="hidden" name="page" value="1" />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Search e.g. 爱, ai, love"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#ff9900] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-[#ff9900] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e68a00]"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="mt-4 rounded-4xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Filter Level
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Narrow the list by HSK level.
        </p>

        <div className="mt-4">
          <LevelFilterBar q={q} level={level as LevelFilter} basePath="/words" />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3">
        {results.items.length > 0 ? (
          results.items.map((item) => <WordCard key={item.id} item={item} compact />)
        ) : (
          <div className="col-span-full rounded-4xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            No results found.
          </div>
        )}
      </section>

      <Pagination
        q={q}
        currentPage={results.currentPage}
        totalPages={results.totalPages}
        basePath="/words"
        extraParams={level !== "all" ? { level } : {}}
      />
    </div>
  );
}