"use client";

import { useHanziSpeech } from "@/app/hooks/useHanziSpeech";
import type { HanziEntryItem } from "@/app/lib/search";

type Props = {
  item: HanziEntryItem;
};

export default function HanziCard({ item }: Props) {
  const { speak } = useHanziSpeech();

  return (
    <button
      type="button"
      onClick={() => speak(item.simplified)}
      className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-full flex-col justify-between gap-3">
        <h3 className="text-3xl font-semibold">{item.simplified}</h3>
        <p className="text-sm font-medium text-slate-700">{item.pinyin}</p>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {item.meaning}
        </p>
      </div>
    </button>
  );
}