import fs from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

import { normalizePinyin } from "../app/lib/normalize";

const prisma = new PrismaClient();
const FILE_PATH = path.join(process.cwd(), "database", "full-HSK.csv");

type RawRow = Record<string, string>;

function pick(row: RawRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function parseLevel(value: string) {
  const raw = value.trim().toLowerCase();

  if (!raw) return null;

  if (raw.includes("beginner")) return 1;
  if (raw.includes("intermediate")) return 2;
  if (raw.includes("advanced")) return 3;

  if (["1", "2", "3"].includes(raw)) return Number(raw);

  const num = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
  if (Number.isFinite(num)) {
    if (num <= 1) return 1;
    if (num === 2) return 2;
    return 3;
  }

  return null;
}

async function main() {
  const rawCsv = await fs.readFile(FILE_PATH, "utf8");

  const rows = parse(rawCsv, {
    columns: true,
    delimiter: ";",
    bom: true,
    skip_empty_lines: true,
    trim: true,
  }) as RawRow[];

  const data = rows
    .map((row, index) => {
      const sourceId = pick(row, ["ID", "Id", "id"]);
      const levelRaw = pick(row, ["Level", "level", "HSK Level", "HSKLevel", "Group"]);
      const simplified = pick(row, ["Word", "Simplified", "simplified"]);
      const pinyin = pick(row, ["Pinyin", "pinyin"]);
      const normalized = pick(row, ["Normalized", "normalized"]) || normalizePinyin(pinyin);
      const meaning = pick(row, ["Meaning", "Meaning 1", "meaning"]);

      const sentence = pick(row, ["Sentence", "sentence"]);
      const sentencePinyin = pick(row, ["Sentence_Pinyin", "Sentence Pinyin", "sentencePinyin"]);
      const sentenceNormalized =
        pick(row, ["Sentence_Normalized", "Sentence Normalized", "sentenceNormalized"]) ||
        normalizePinyin(sentencePinyin);
      const sentenceMeaning = pick(row, ["Sentence_Meaning", "Sentence Meaning", "sentenceMeaning"]);
      const category = pick(row, ["Category", "category"]);

      const level = parseLevel(levelRaw);

      if (
        !sourceId ||
        !level ||
        !simplified ||
        !pinyin ||
        !meaning ||
        !sentence ||
        !sentencePinyin ||
        !sentenceMeaning ||
        !category
      ) {
        return null;
      }

      return {
        sourceId,
        level,
        simplified,
        pinyin,
        pinyinNormalized: normalized,
        meaning,
        sentence,
        sentencePinyin,
        sentencePinyinNormalized: normalizePinyin(sentencePinyin),
        sentenceNormalized,
        sentenceMeaning,
        category,
      };
    })
    .filter(Boolean) as Array<{
    sourceId: string;
    level: number;
    simplified: string;
    pinyin: string;
    pinyinNormalized: string;
    meaning: string;
    sentence: string;
    sentencePinyin: string;
    sentencePinyinNormalized: string;
    sentenceNormalized: string;
    sentenceMeaning: string;
    category: string;
    rankOrder: number;
  }>;

  if (data.length === 0) {
    throw new Error("Tidak ada row valid yang bisa di-import. Cek kolom CSV kamu.");
  }

  await prisma.hanziEntry.deleteMany();

  const batchSize = 1000;

  for (let i = 0; i < data.length; i += batchSize) {
    await prisma.hanziEntry.createMany({
      data: data.slice(i, i + batchSize),
    });
  }

  console.log(`Imported ${data.length} rows successfully.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    void prisma.$disconnect();
  });