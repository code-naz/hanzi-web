"use client";

import { useHanziSpeech } from "@/app/hooks/useHanziSpeech";
import type { HanziEntryItem } from "@/app/lib/search";

type Props = {
  item: HanziEntryItem;
  compact?: boolean;
};

export default function WordCard({ item, compact = false }: Props) {
  const { speak } = useHanziSpeech();

  return (
    <button
      type="button"
      onClick={() => speak(item.simplified)}
      aria-label={`Play pronunciation for ${item.simplified}`}
      className={[
        "group w-full rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900",
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5",
      ].join(" ")}
    >
      <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-center sm:min-h-40">
        <h3
          className={[
            "font-semibold leading-tight text-slate-900 dark:text-white",
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl",
          ].join(" ")}
        >
          {item.simplified}
        </h3>

        <p className={compact ? "text-xs font-medium text-slate-700 dark:text-slate-300 sm:text-sm" : "text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-base"}>
          {item.pinyin}
        </p>

        <p
          className={[
            "line-clamp-2 max-w-full text-slate-600 dark:text-slate-400",
            compact ? "text-[11px] leading-5 sm:text-xs" : "text-xs sm:text-sm",
          ].join(" ")}
        >
          {item.meaning}
        </p>
      </div>
    </button>
  );
}