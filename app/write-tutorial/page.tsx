import fs from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

import Breadcrumbs from "@/app/components/Breadcrumbs";

import WriteTutorialClient from "./WriteTutorialClient";

type RawRow = Record<string, string>;

type PracticeLevel = "beginner" | "intermediate" | "advanced";

type PracticeCharacter = {
  sourceId: string;
  character: string;
  pinyin: string;
  meaning: string;
  level: PracticeLevel;
};

const FILE_PATH = path.join(process.cwd(), "database", "full-HSK.csv");

function normalizeLevel(value: string): PracticeLevel | null {
  const raw = value.trim().toLowerCase();

  if (raw.includes("beginner")) return "beginner";
  if (raw.includes("intermediate")) return "intermediate";
  if (raw.includes("advanced")) return "advanced";

  return null;
}

function pick(row: RawRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function isSingleCharacter(value: string) {
  return Array.from(value).length === 1;
}

async function loadPracticeCharacters(): Promise<PracticeCharacter[]> {
  const rawCsv = await fs.readFile(FILE_PATH, "utf8");

  const rows = parse(rawCsv, {
    columns: true,
    delimiter: ";",
    bom: true,
    skip_empty_lines: true,
    trim: true,
  }) as RawRow[];

  const seen = new Set<string>();
  const characters: PracticeCharacter[] = [];

  for (const row of rows) {
    const sourceId = pick(row, ["ID", "Id", "id"]);
    const levelRaw = pick(row, ["Level", "level", "HSK Level", "HSKLevel", "Group"]);
    const character = pick(row, ["Word", "Simplified", "simplified"]);
    const pinyin = pick(row, ["Pinyin", "pinyin"]);
    const meaning = pick(row, ["Meaning", "Meaning 1", "meaning"]);
    const level = normalizeLevel(levelRaw);

    if (!sourceId || !level || !character || !pinyin || !meaning) continue;
    if (!isSingleCharacter(character)) continue;
    if (seen.has(character)) continue;

    seen.add(character);
    characters.push({
      sourceId,
      character,
      pinyin,
      meaning,
      level,
    });
  }

  return characters;
}

export default async function WriteTutorialPage() {
  const characters = await loadPracticeCharacters();
  const initialCharacter = characters[0]?.character ?? "我";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Write Tutorial" },
        ]}
      />

      <section className="mt-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Write Tutorial
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 md:text-base md:whitespace-nowrap whitespace-normal">
          Browse single-character below, then practice stroke order with animation or exercise mode.
        </p>
      </section>

      <WriteTutorialClient
        characters={characters}
        initialCharacter={initialCharacter}
      />
    </div>
  );
}