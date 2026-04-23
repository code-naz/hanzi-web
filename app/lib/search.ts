import { prisma } from "@/app/lib/prisma";
import { normalizePinyin } from "@/app/lib/normalize";

export type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

export type HanziEntryItem = {
  id: number;
  sourceId: string;
  level: number;
  simplified: string;
  pinyin: string;
  pinyinNormalized: string;
  meaning: string;
};

export type SentenceEntryItem = {
  id: number;
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
};

export type SearchResult<TItem> = {
  items: TItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

type WordSearchArgs = {
  query: string;
  page: number;
  pageSize: number;
  level?: LevelFilter;
};

type SentenceSearchArgs = {
  query: string;
  page: number;
  pageSize: number;
  category?: string;
};

function levelToNumber(level: LevelFilter) {
  if (level === "beginner") return 1;
  if (level === "intermediate") return 2;
  if (level === "advanced") return 3;
  return null;
}

function buildLevelWhere(level: LevelFilter) {
  const levelNumber = levelToNumber(level);

  return levelNumber === null
    ? {}
    : {
        level: levelNumber,
      };
}

function scoreWordItem(item: HanziEntryItem, q: string, qNorm: string) {
  const simplified = item.simplified.toLowerCase();
  const pinyin = item.pinyin.toLowerCase();
  const pinyinNorm = item.pinyinNormalized.toLowerCase();
  const meaning = item.meaning.toLowerCase();
  const qLower = q.toLowerCase();

  if (simplified === qLower) return 0;
  if (pinyinNorm === qNorm) return 1;
  if (simplified.startsWith(qLower)) return 2;
  if (pinyinNorm.startsWith(qNorm)) return 3;
  if (simplified.includes(qLower)) return 4;
  if (pinyin.includes(qLower)) return 5;
  if (pinyinNorm.includes(qNorm)) return 6;
  if (meaning.includes(qLower)) return 7;

  return 99;
}

function scoreSentenceItem(item: SentenceEntryItem, q: string, qNorm: string) {
  const simplified = item.simplified.toLowerCase();
  const pinyin = item.pinyin.toLowerCase();
  const pinyinNorm = item.pinyinNormalized.toLowerCase();
  const sentence = item.sentence.toLowerCase();
  const sentencePinyin = item.sentencePinyin.toLowerCase();
  const sentencePinyinNorm = item.sentencePinyinNormalized.toLowerCase();
  const sentenceNormalized = item.sentenceNormalized.toLowerCase();
  const meaning = item.meaning.toLowerCase();
  const sentenceMeaning = item.sentenceMeaning.toLowerCase();
  const category = item.category.toLowerCase();
  const qLower = q.toLowerCase();

  if (sentence === qLower) return 0;
  if (sentencePinyinNorm === qNorm) return 1;
  if (sentence.startsWith(qLower)) return 2;
  if (sentencePinyinNorm.startsWith(qNorm)) return 3;
  if (simplified === qLower) return 4;
  if (pinyinNorm === qNorm) return 5;
  if (sentence.includes(qLower)) return 6;
  if (sentencePinyin.includes(qLower)) return 7;
  if (sentenceNormalized.includes(qLower)) return 8;
  if (sentencePinyinNorm.includes(qNorm)) return 9;
  if (sentenceMeaning.includes(qLower)) return 10;
  if (meaning.includes(qLower)) return 11;
  if (category.includes(qLower)) return 12;

  return 99;
}

const WORD_SELECT = {
  id: true,
  sourceId: true,
  level: true,
  simplified: true,
  pinyin: true,
  pinyinNormalized: true,
  meaning: true,
} as const;

const SENTENCE_SELECT = {
  id: true,
  sourceId: true,
  level: true,
  simplified: true,
  pinyin: true,
  pinyinNormalized: true,
  meaning: true,
  sentence: true,
  sentencePinyin: true,
  sentencePinyinNormalized: true,
  sentenceNormalized: true,
  sentenceMeaning: true,
  category: true,
} as const;

export async function searchEntries({
  query,
  page,
  pageSize,
  level = "all",
}: WordSearchArgs): Promise<SearchResult<HanziEntryItem>> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const take = pageSize;
  const skip = (safePage - 1) * take;
  const q = query.trim();
  const whereBase = buildLevelWhere(level);

  if (!q) {
    const [items, total] = await Promise.all([
      prisma.hanziEntry.findMany({
        where: whereBase,
        orderBy: [{ sourceId: "asc" }],
        skip,
        take,
        select: WORD_SELECT,
      }),
      prisma.hanziEntry.count({ where: whereBase }),
    ]);

    return {
      items,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
      currentPage: safePage,
      pageSize: take,
    };
  }

  const qNorm = normalizePinyin(q);

  const rows = await prisma.hanziEntry.findMany({
    where: {
      ...whereBase,
      OR: [
        { simplified: { contains: q } },
        { pinyin: { contains: q } },
        { pinyinNormalized: { contains: qNorm } },
        { meaning: { contains: q } },
      ],
    },
    select: WORD_SELECT,
  });

  const items = rows
    .sort(
      (a, b) =>
        scoreWordItem(a, q, qNorm) - scoreWordItem(b, q, qNorm) ||
        a.sourceId.localeCompare(b.sourceId),
    )
    .slice(skip, skip + take);

  return {
    items,
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / take)),
    currentPage: safePage,
    pageSize: take,
  };
}

export async function getSentenceCategories(): Promise<string[]> {
  const rows = await prisma.hanziEntry.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category).filter(Boolean);
}

export async function searchSentences({
  query,
  page,
  pageSize,
  category = "all",
}: SentenceSearchArgs): Promise<SearchResult<SentenceEntryItem>> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const take = pageSize;
  const skip = (safePage - 1) * take;
  const q = query.trim();

  const categoryWhere =
    category === "all"
      ? {}
      : {
          category,
        };

  if (!q) {
    const [items, total] = await Promise.all([
      prisma.hanziEntry.findMany({
        where: categoryWhere,
        orderBy: [{ sourceId: "asc" }],
        skip,
        take,
        select: SENTENCE_SELECT,
      }),
      prisma.hanziEntry.count({ where: categoryWhere }),
    ]);

    return {
      items,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
      currentPage: safePage,
      pageSize: take,
    };
  }

  const qNorm = normalizePinyin(q);

  const rows = await prisma.hanziEntry.findMany({
    where: {
      ...categoryWhere,
      OR: [
        { simplified: { contains: q } },
        { pinyin: { contains: q } },
        { pinyinNormalized: { contains: qNorm } },
        { meaning: { contains: q } },
        { sentence: { contains: q } },
        { sentencePinyin: { contains: q } },
        { sentencePinyinNormalized: { contains: qNorm } },
        { sentenceNormalized: { contains: q } },
        { sentenceMeaning: { contains: q } },
        { category: { contains: q } },
      ],
    },
    select: SENTENCE_SELECT,
  });

  const items = rows
    .sort(
      (a, b) =>
        scoreSentenceItem(a, q, qNorm) - scoreSentenceItem(b, q, qNorm) ||
        a.sourceId.localeCompare(b.sourceId),
    )
    .slice(skip, skip + take);

  return {
    items,
    total: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / take)),
    currentPage: safePage,
    pageSize: take,
  };
}