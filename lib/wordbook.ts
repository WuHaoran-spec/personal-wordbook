import { z } from "zod";

export const normalizeWord = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑–—]/g, "-")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
export const wordPattern = /^[a-z]+(?:[' -][a-z]+)*$/;
const id = z.string().min(1).max(80);
export const folderSchema = z.object({
  id,
  name: z.string().trim().min(1).max(40),
});
export const wordSchema = z.object({
  id,
  text: z
    .string()
    .min(1)
    .max(100)
    .refine((s) => wordPattern.test(normalizeWord(s)), "请输入英文单词或短语"),
  definition: z.string().max(2000).default(""),
  phonetic: z.string().max(200).default(""),
  example: z.string().max(2000).default(""),
  translation: z.string().max(2000).default(""),
  phrases: z.string().max(2000).default(""),
  note: z.string().max(4000).default(""),
  folderIds: z.array(id).min(1).max(50),
  starred: z.boolean().default(false),
  createdAt: z.number().int().nonnegative(),
  dueAt: z.number().int().nonnegative(),
  stage: z.number().int().min(0).max(6).default(0),
  lapses: z.number().int().nonnegative().default(0),
  reviews: z.number().int().nonnegative().default(0),
  affixes: z
    .array(z.string().regex(/^(?:[a-z]{1,12}-|-[a-z]{1,12})$/))
    .max(8)
    .optional(),
});
export const bookSchema = z
  .object({
    folders: z.array(folderSchema).min(1).max(50),
    words: z.array(wordSchema).max(5000),
  })
  .superRefine((b, ctx) => {
    const folders = new Set(b.folders.map((f) => f.id));
    if (
      folders.size !== b.folders.length ||
      new Set(b.folders.map((f) => f.name)).size !== b.folders.length
    )
      ctx.addIssue({ code: "custom", message: "文件夹重复" });
    if (
      new Set(b.words.map((w) => w.id)).size !== b.words.length ||
      new Set(b.words.map((w) => normalizeWord(w.text))).size !== b.words.length
    )
      ctx.addIssue({ code: "custom", message: "单词重复" });
    if (b.words.some((w) => w.folderIds.some((f) => !folders.has(f))))
      ctx.addIssue({ code: "custom", message: "单词的文件夹不存在" });
  });
export type Word = z.infer<typeof wordSchema>;
export type Folder = z.infer<typeof folderSchema>;
export type Book = z.infer<typeof bookSchema>;
export function emptyBook(): Book {
  return {
    folders: [
      { id: "inbox", name: "日常积累" },
      { id: "reading", name: "阅读与写作" },
      { id: "exam", name: "考试词汇" },
    ],
    words: [],
  };
}
export function newWord(
  text: string,
  folderId: string,
  fields: Partial<Word> = {},
): Word {
  return {
    id: crypto.randomUUID(),
    text: normalizeWord(text),
    definition: "",
    phonetic: "",
    example: "",
    translation: "",
    phrases: "",
    note: "",
    folderIds: [folderId],
    starred: false,
    createdAt: Date.now(),
    dueAt: Date.now(),
    stage: 0,
    lapses: 0,
    reviews: 0,
    ...fields,
  };
}
export const intervals = [0, 1, 3, 7, 14, 30, 60];
export type Grade = "again" | "hard" | "good" | "easy";
export function reviewWord(word: Word, grade: Grade, now = Date.now()): Word {
  const stage =
    grade === "again"
      ? 0
      : Math.min(
          6,
          word.stage + (grade === "easy" ? 2 : grade === "good" ? 1 : 0),
        );
  const delay =
    grade === "again"
      ? 600000
      : (grade === "hard"
          ? Math.max(1, Math.floor(intervals[stage] / 2))
          : intervals[stage]) * 86400000;
  return {
    ...word,
    stage,
    dueAt: now + delay,
    lapses: word.lapses + (grade === "again" ? 1 : 0),
    reviews: word.reviews + 1,
  };
}
export const affixMeanings: Record<string, string> = {
  "un-": "不；相反",
  "re-": "再次；重新",
  "dis-": "不；相反",
  "mis-": "错误地",
  "pre-": "之前；预先",
  "im-": "不",
  "in-": "不",
  "ir-": "不",
  "il-": "不",
  "over-": "过度",
  "under-": "不足；在下",
  "inter-": "之间",
  "sub-": "在下",
  "non-": "非",
  "anti-": "反对",
  "-ful": "充满……的",
  "-less": "没有……的",
  "-ness": "状态；性质",
  "-ment": "行为；结果",
  "-able": "能够……的",
  "-ible": "能够……的",
  "-ly": "以……方式",
  "-er": "做某事的人",
  "-or": "做某事的人",
  "-tion": "行为；状态",
  "-sion": "行为；状态",
  "-ity": "性质；状态",
  "-ive": "具有……性质的",
  "-al": "与……有关的",
  "-ous": "充满……的",
  "-ize": "使成为",
};
// Small, reviewed learning dictionary. Unknown matches remain suggestions.
const curated: Record<string, string[]> = Object.create(null);
for (const [affix, words] of Object.entries({
  "un-":
    "unhappy unfair unknown unable unusual unforgettable uncomfortable unnecessary unbelievable unbearable unlock undo unpack",
  "re-":
    "rewrite reconnect rebuild reread reuse restart replay review renew rethink",
  "dis-": "disagree dislike disappear dishonest disconnect disapprove",
  "mis-": "misunderstand mislead mistake misuse misread",
  "pre-": "preview preheat preschool prepay",
  "im-": "impossible impatient impolite imperfect",
  "in-": "inactive incorrect incomplete invisible",
  "ir-": "irregular irresponsible",
  "il-": "illegal illogical",
  "over-": "overcook overwork overestimate",
  "under-": "underestimate underpay",
  "inter-": "international interpersonal",
  "sub-": "submarine subtitle",
  "non-": "nonfiction nonprofit",
  "anti-": "antivirus antisocial",
  "-ful": "helpful useful careful beautiful wonderful hopeful thankful mindful",
  "-less": "useless careless hopeless fearless homeless endless",
  "-ness": "happiness kindness darkness sadness awareness mindfulness",
  "-ment": "movement development improvement agreement achievement",
  "-able":
    "readable washable comfortable acceptable unforgettable understandable unbearable",
  "-ible": "possible impossible visible invisible",
  "-ly": "quickly slowly happily carefully beautifully clearly suddenly",
  "-er": "teacher learner reader writer worker singer player",
  "-or": "actor creator visitor inventor",
  "-tion": "education information creation communication imagination",
  "-sion": "decision discussion expression revision",
  "-ity": "possibility creativity activity ability responsibility",
  "-ive": "creative active attractive productive effective",
  "-al": "personal natural national cultural educational",
  "-ous": "dangerous famous nervous curious",
  "-ize": "modernize realize organize",
}))
  for (const word of words.split(" ")) (curated[word] ??= []).push(affix);
curated.carefully = ["-ful", "-ly"];
curated.mindfulness = ["-ful", "-ness"];
const protectedWords = new Set([
  "union",
  "university",
  "unit",
  "universe",
  "result",
  "reason",
  "real",
  "flower",
  "corner",
  "mother",
  "other",
  "brother",
  "sister",
  "water",
  "summer",
  "winter",
  "understand",
  "interest",
  "reply",
  "return",
  "regret",
]);
export function analyzeAffixes(text: string, override?: string[]) {
  const word = normalizeWord(text);
  if (override)
    return { confirmed: override, suggested: [] as string[], source: "user" };
  if (curated[word])
    return {
      confirmed: curated[word],
      suggested: [] as string[],
      source: "curated",
    };
  if (protectedWords.has(word) || word.includes(" ") || word.length < 6)
    return { confirmed: [], suggested: [], source: "none" };
  const suggested = Object.keys(affixMeanings).filter((a) =>
    a.endsWith("-")
      ? word.startsWith(a.slice(0, -1)) && word.length - a.length >= 3
      : word.endsWith(a.slice(1)) && word.length - a.length >= 3,
  );
  return { confirmed: [], suggested, source: "heuristic" };
}
const stopwords = new Set(
  "a an the and or but if so of to in on at by for from with as is are was were be been being it its this that these those i you he she we they my your their our his her not no do does did have has had will would can could should may might page chapter unit www http https com english vocabulary words word".split(
    " ",
  ),
);
export type Candidate = {
  text: string;
  definition: string;
  count: number;
  page: number;
  sourceLine: string;
  selected: boolean;
};
export function extractCandidates(
  pages: string[],
  mode: "entries" | "article" = "entries",
): Candidate[] {
  const map = new Map<string, Candidate>();
  function add(text: string, definition: string, page: number, line: string) {
    const word = normalizeWord(text);
    if (
      !wordPattern.test(word) ||
      word.length > 100 ||
      word.length < 2 ||
      stopwords.has(word)
    )
      return;
    const existing = map.get(word);
    if (existing) {
      existing.count++;
      if (!existing.definition && definition) existing.definition = definition;
      return;
    }
    map.set(word, {
      text: word,
      definition: definition.slice(0, 2000),
      count: 1,
      page,
      sourceLine: line.slice(0, 250),
      selected: true,
    });
  }
  pages.forEach((page, i) =>
    page.split(/\r?\n/).forEach((raw) => {
      const line = raw.replace(/^\s*\d+[.)、\s]+/, "").trim();
      if (!line || /https?:\/\/|www\./i.test(line)) return;
      if (mode === "article") {
        for (const w of line.match(/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g) ?? [])
          add(w, "", i + 1, line);
      } else {
        const entry = line.match(
          /^([a-zA-Z]+(?:['’\-][a-zA-Z]+)*(?:\s+[a-zA-Z]+(?:['’\-][a-zA-Z]+)*){0,4}?)(?=\s*(?:[\u3400-\u9fff]|\/(?!\/)|\[|\b(?:n|v|adj|adv|vt|vi|prep|pron|conj|int)\.|[\t:：]|$))/,
        );
        if (entry) {
          const chinese = line.search(/[\u3400-\u9fff]/);
          add(entry[1], chinese >= 0 ? line.slice(chinese) : "", i + 1, line);
        }
      }
    }),
  );
  return [...map.values()].slice(0, 5000);
}
export function mergeWords(
  book: Book,
  items: Pick<Candidate, "text" | "definition">[],
  folderId: string,
): Book {
  if (!book.folders.some((f) => f.id === folderId))
    throw new Error("请先选择文件夹");
  const words = book.words.map((w) => ({ ...w, folderIds: [...w.folderIds] }));
  const map = new Map(words.map((w) => [normalizeWord(w.text), w]));
  for (const item of items) {
    const text = normalizeWord(item.text);
    if (!wordPattern.test(text)) continue;
    const existing = map.get(text);
    if (existing) {
      if (!existing.definition && item.definition)
        existing.definition = item.definition;
      if (!existing.folderIds.includes(folderId))
        existing.folderIds.push(folderId);
    } else {
      const word = newWord(text, folderId, { definition: item.definition });
      words.push(word);
      map.set(text, word);
    }
  }
  return bookSchema.parse({ ...book, words });
}
export function demoWords(): Word[] {
  return [
    newWord("serendipity", "inbox", {
      id: "demo-serendipity",
      definition: "n. 意外发现美好事物的幸运",
      phonetic: "/ˌserənˈdɪpəti/",
      example: "Finding this little bookshop was pure serendipity.",
      translation: "偶然发现这间小书店，真是美妙的缘分。",
      phrases: "by serendipity — 机缘巧合地",
    }),
    newWord("unforgettable", "reading", {
      id: "demo-unforgettable",
      definition: "adj. 难以忘记的",
      example: "We had an unforgettable evening by the lake.",
      translation: "我们在湖畔度过了一个难忘的夜晚。",
      phrases: "an unforgettable experience — 一次难忘的经历",
    }),
    newWord("reconnect", "inbox", {
      id: "demo-reconnect",
      definition: "v. 重新建立联系",
      example: "The trip helped me reconnect with old friends.",
      translation: "这趟旅行让我与老朋友重新联系起来。",
      phrases: "reconnect with someone — 与某人重新联系",
    }),
    newWord("mindfulness", "inbox", {
      id: "demo-mindfulness",
      definition: "n. 正念；专注当下",
      example: "She practices mindfulness before starting her day.",
      translation: "她在一天开始前练习正念。",
    }),
    newWord("possibility", "exam", {
      id: "demo-possibility",
      definition: "n. 可能性；机会",
      example: "Every conversation opens up a new possibility.",
      translation: "每一次交谈都带来一种新的可能。",
      phrases: "a real possibility — 切实的可能性",
    }),
    newWord("creative", "reading", {
      id: "demo-creative",
      definition: "adj. 有创造力的",
      example: "A small notebook can hold many creative ideas.",
      translation: "一本小小的笔记本也能装下许多创意。",
      phrases: "creative thinking — 创造性思维",
    }),
  ];
}
