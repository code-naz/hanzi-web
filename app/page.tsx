import Link from "next/link";

import WordCard from "@/app/components/WordCard";
import { searchEntries } from "@/app/lib/search";

export default async function HomePage() {
  const sample = await searchEntries({
    query: "",
    page: 1,
    pageSize: 6,
    level: "all",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <section className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950 md:p-10">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#ff9900]/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-slate-200/60 blur-3xl dark:bg-slate-700/30" />

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl md:leading-[1.12] dark:text-white">
              Understanding Hanzi isn&apos;t just about reading, it&apos;s about connecting
              with the world&apos;s largest community of speakers.
            </h1>

            <div className="mt-8 flex flex-nowrap gap-3">
              <Link
                href="/words"
                className="inline-flex flex-1 min-w-0 items-center justify-center rounded-2xl bg-[#ff9900] px-4 py-3 font-semibold text-white transition hover:bg-[#e68a00] sm:px-6"
              >
                Start learning
              </Link>

              <Link
                href="/sentences"
                className="inline-flex flex-1 min-w-0 items-center justify-center rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:border-[#ff9900] hover:text-[#ff9900] dark:bg-slate-950 dark:text-white sm:px-6"
              >
                Browse sentences
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
            <div className="absolute h-44 w-44 rounded-full bg-[#ff9900]/10 blur-2xl" />

            <div className="relative flex w-full items-center justify-center gap-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
                  👩
                </div>
                <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  你好！
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="rounded-3xl bg-[#ff9900] px-4 py-2 text-sm font-medium text-white">
                  学习
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
                  👨
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sample.items.map((item) => (
            <WordCard key={item.id} item={item} compact />
          ))}
        </div>

        <aside className="flex h-full flex-col justify-center rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-8">
          <div>
            <p className="text-2xl font-semibold leading-tight text-slate-900 dark:text-white">
              Specially designed for anyone starting to learn Chinese.
            </p>

            <div className="mt-8">
              <StepBars />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function StepBars() {
  const items = [
    { heightClass: "h-16", label: "Core fundamentals" },
    { heightClass: "h-28", label: "Improve writing" },
    { heightClass: "h-40", label: "Speak naturally" },
  ];

  return (
    <div className="grid grid-cols-3 items-end gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-3">
          <div className={`w-full max-w-14 rounded-none bg-[#ff9900] ${item.heightClass}`} />
          <p className="text-center text-xs font-medium leading-5 text-slate-700 dark:text-slate-300">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}