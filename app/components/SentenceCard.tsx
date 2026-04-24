"use client";

import { useHanziSpeech } from "@/app/hooks/useHanziSpeech";
import type { SentenceEntryItem } from "@/app/lib/search";

type Props = {
  item: SentenceEntryItem;
};

export default function SentenceCard({ item }: Props) {
  const { speak } = useHanziSpeech();

  return (
    <button
      type="button"
      onClick={() => speak(item.sentence)}
      aria-label={`Play pronunciation for ${item.sentence}`}
      className="group w-full rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-3xl">
          {item.sentence}
        </h3>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-base">
          {item.sentencePinyin}
        </p>

        <p className="text-xs leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">
          {item.sentenceMeaning}
        </p>
      </div>
    </button>
  );
}