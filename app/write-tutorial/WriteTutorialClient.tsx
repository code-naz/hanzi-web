"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";

type PracticeLevel = "beginner" | "intermediate" | "advanced";

type PracticeCharacter = {
  sourceId: string;
  character: string;
  pinyin: string;
  meaning: string;
  level: PracticeLevel;
};

type WriterInstance = ReturnType<typeof HanziWriter.create>;

type CharacterData = {
  strokes: string[];
  medians: number[][][];
  radStrokes?: number[];
};

type QuizMistakeInfo = {
  strokeNum: number;
};

type QuizCompleteInfo = {
  totalMistakes: number;
};

const PAGE_SIZE = 40;

async function fetchStrokeData(char: string): Promise<CharacterData> {
  const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodeURIComponent(char)}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Stroke data not found for "${char}".`);
  }

  return response.json() as Promise<CharacterData>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
        {value}
      </p>
    </div>
  );
}

type Props = {
  characters: PracticeCharacter[];
  initialCharacter: string;
};

export default function WriteTutorialClient({ characters, initialCharacter }: Props) {
  const writerId = useId().replace(/:/g, "");
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<WriterInstance | null>(null);

  const [character, setCharacter] = useState(initialCharacter);
  const [revision, setRevision] = useState(0);

  const [status, setStatus] = useState("Ready to practice?");
  const [message, setMessage] = useState("Pick a character below to begin.");
  const [strokeCount, setStrokeCount] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);

  const selectedEntry = useMemo(
    () => characters.find((item) => item.character === character) ?? null,
    [characters, character],
  );

  const totalPages = Math.max(1, Math.ceil(characters.length / PAGE_SIZE));

  const pagedCharacters = useMemo(() => {
    const safePage = Math.min(page, totalPages - 1);
    const start = safePage * PAGE_SIZE;
    return characters.slice(start, start + PAGE_SIZE);
  }, [characters, page, totalPages]);

  useEffect(() => {
    setPage(0);
  }, [characters, initialCharacter]);

  useEffect(() => {
    let cancelled = false;

    async function setupWriter() {
      try {
        setIsLoading(true);
        setIsRunning(false);
        setError(null);
        setStatus("Ready to practice?");
        setMessage("Loading selection...");
        setStrokeCount(null);

        const target = targetRef.current;
        const wrapper = canvasWrapRef.current;

        if (!target || !wrapper) return;

        target.innerHTML = "";

        const availableWidth = wrapper.clientWidth || 280;
        const canvasSize = Math.max(240, Math.min(384, availableWidth));

        const strokeData = await fetchStrokeData(character);
        if (cancelled) return;

        setStrokeCount(strokeData.strokes.length);

        const instance = HanziWriter.create(target, character, {
          width: canvasSize,
          height: canvasSize,
          padding: 24,
          showOutline: true,
          showCharacter: false,
          strokeAnimationSpeed: 1.2,
          delayBetweenStrokes: 55,
          outlineColor: "#cbd5e1",
          strokeColor: "#94a3b8",
          radicalColor: "#ff9900",
          charDataLoader: () => strokeData,
        });

        if (cancelled) return;

        writerRef.current = instance;
        setStatus("Ready to practice?");
        setMessage("Tap Animate or Start Exercize.");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load character.");
        setStatus("Ready to practice?");
        setMessage("Try another character.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void setupWriter();

    return () => {
      cancelled = true;
      writerRef.current = null;
    };
  }, [character, revision]);

  const handlePick = (item: string) => {
    setCharacter(item);
    setRevision((value) => value + 1);
    setError(null);
    setIsLoading(true);
    setStatus("Ready to practice?");
    setMessage("Loading selection...");
  };

  const handleAnimate = async () => {
    const writer = writerRef.current;
    if (!writer) return;

    setIsRunning(true);
    setError(null);
    setStatus("Animating...");
    setMessage("Watch the stroke order carefully.");

    try {
      await writer.animateCharacter();
      setStatus("Finished.");
      setMessage("Run it again or start the exercise.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Animation failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleQuiz = async () => {
    const writer = writerRef.current;
    if (!writer) return;

    setIsRunning(true);
    setError(null);
    setStatus("Exercise mode.");
    setMessage("Draw each stroke in order.");

    try {
      await writer.quiz({
        showHintAfterMisses: 1,
        onMistake: (strokeData: QuizMistakeInfo) => {
          setStatus("Keep trying.");
          setMessage(`Mistake on stroke ${strokeData.strokeNum + 1}. Try again.`);
        },
        onComplete: ({ totalMistakes }: QuizCompleteInfo) => {
          setStatus("Completed.");
          setMessage(`Great job. Mistakes: ${totalMistakes}.`);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quiz failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-2">
      <section className="min-w-0 rounded-4xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Select Character
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Browse the list and pick one to practice.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={page === 0}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff9900] hover:text-[#ff9900] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              Prev
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {Math.min(page, totalPages - 1) + 1} of {totalPages}
            </p>

            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff9900] hover:text-[#ff9900] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              Next
            </button>
          </div>

          <div className="grid grid-cols-4 justify-items-center gap-2 sm:grid-cols-5 lg:grid-cols-8">
            {pagedCharacters.map((item) => {
              const active = item.character === character;

              return (
                <button
                  key={item.sourceId}
                  type="button"
                  onClick={() => handlePick(item.character)}
                  title={`${item.character} · ${item.pinyin} · ${item.meaning}`}
                  className={[
                    "flex h-11 min-w-11 items-center justify-center rounded-2xl px-3 text-base font-semibold transition",
                    active
                      ? "bg-[#ff9900] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                  ].join(" ")}
                >
                  {item.character}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{status}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</p>
            {error ? <p className="mt-2 text-sm font-medium text-red-500">{error}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAnimate}
              disabled={isLoading || isRunning}
              className="inline-flex items-center justify-center rounded-2xl bg-[#ff9900] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e68a00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Animate
            </button>

            <button
              type="button"
              onClick={handleQuiz}
              disabled={isLoading || isRunning}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[#ff9900] hover:text-[#ff9900] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              Start Exercize
            </button>
          </div>
        </div>
      </section>

      <section className="min-w-0 self-start rounded-4xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Canvas
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Learning lab to explore all characters.
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <div
            ref={canvasWrapRef}
            className="flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-4xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              ref={targetRef}
              id={writerId}
              className="flex h-full w-full items-center justify-center"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoCard
            label="Selected Character"
            value={selectedEntry ? `${selectedEntry.character} · ${selectedEntry.pinyin}` : character}
          />
          <InfoCard
            label="Stroke"
            value={strokeCount === null ? "Loading" : String(strokeCount)}
          />
        </div>
      </section>
    </div>
  );
}