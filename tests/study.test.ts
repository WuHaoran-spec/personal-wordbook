import test from "node:test";
import assert from "node:assert/strict";
import {
  addLevels,
  fitBookStorage,
  BOOK_BYTE_LIMIT,
  bookSchema,
  emptyBook,
  HISTORY_LIMIT,
  matchesLevel,
  mergeBackup,
  mergeWords,
  newWord,
  reviewPlan,
  reviewWord,
  type Grade,
} from "../lib/wordbook.ts";

test("legacy data retains progress without inventing review times or categories", () => {
  const original = newWord("apple", "inbox", {
    reviews: 8,
    stage: 3,
    dueAt: 1000,
  });
  const { levels, lastReviewedAt, reviewHistory, ...legacy } = original;
  const parsed = bookSchema.parse({ ...emptyBook(), words: [legacy] }).words[0];
  assert.equal(parsed.lastReviewedAt, null);
  assert.deepEqual(parsed.reviewHistory, []);
  assert.deepEqual(parsed.levels, []);
  assert.equal(parsed.reviews, 8);
  assert.equal(parsed.stage, 3);
  assert.equal(parsed.dueAt, 1000);
});

test("multiple exam categories filter correctly and bulk updates preserve learning", () => {
  const reviewed = reviewWord(
    newWord("apple", "inbox", { levels: ["cet6"] }),
    "good",
    1000,
  );
  const other = newWord("pear", "inbox");
  const words = addLevels([reviewed, other], [reviewed.id], ["ielts", "cet6"]);
  assert.deepEqual(words[0].levels, ["cet6", "ielts"]);
  assert.equal(matchesLevel(words[0], "ielts"), true);
  assert.equal(matchesLevel(words[0], "gre"), false);
  assert.equal(matchesLevel(words[0], "unclassified"), false);
  assert.equal(matchesLevel(other, "unclassified"), true);
  assert.equal(matchesLevel(other, ""), true);
  assert.deepEqual(words[0].reviewHistory, reviewed.reviewHistory);
  assert.equal(words[0].lastReviewedAt, 1000);
  assert.equal(words[0].dueAt, reviewed.dueAt);
  assert.equal(words[1], other);
  assert.deepEqual(reviewed.levels, ["cet6"]);
});

test("PDF import merges categories without touching prior review records", () => {
  const old = reviewWord(
    newWord("apple", "inbox", { levels: ["cet6"], note: "keep" }),
    "easy",
    5000,
  );
  const book = { ...emptyBook(), words: [old] };
  const next = mergeWords(
    book,
    [
      { text: "APPLE", definition: "苹果" },
      { text: "pear", definition: "梨" },
    ],
    "reading",
    ["ielts"],
  );
  assert.deepEqual(next.words[0].levels, ["cet6", "ielts"]);
  assert.deepEqual(next.words[0].reviewHistory, old.reviewHistory);
  assert.equal(next.words[0].lastReviewedAt, 5000);
  assert.equal(next.words[0].dueAt, old.dueAt);
  assert.equal(next.words[0].note, "keep");
  assert.deepEqual(next.words[1].levels, ["ielts"]);
  assert.equal(next.words[1].lastReviewedAt, null);
  assert.deepEqual(old.levels, ["cet6"]);
});

test("all grades store the scoring instant and the previewed next schedule", () => {
  const word = newWord("apple", "inbox", {
    stage: 3,
    reviews: 10,
    levels: ["gre"],
  });
  const now = 1_700_000_000_000;
  for (const grade of ["again", "hard", "good", "easy"] as Grade[]) {
    const plan = reviewPlan(word, grade, now);
    const updated = reviewWord(word, grade, now);
    assert.equal(updated.lastReviewedAt, now);
    assert.equal(updated.dueAt, plan.dueAt);
    assert.equal(updated.stage, plan.stage);
    assert.equal(updated.reviews, 11);
    assert.deepEqual(updated.reviewHistory, [
      { at: now, grade, stage: plan.stage, dueAt: plan.dueAt },
    ]);
    assert.deepEqual(updated.levels, ["gre"]);
  }
  assert.equal(word.lastReviewedAt, null);
});

test("recent history stays chronological and bounded while totals keep growing", () => {
  let word = newWord("apple", "inbox");
  for (let i = 1; i <= HISTORY_LIMIT + 5; i++)
    word = reviewWord(word, "good", i * 86400000);
  assert.equal(word.reviewHistory.length, HISTORY_LIMIT);
  assert.equal(word.reviewHistory[0].at, 6 * 86400000);
  assert.equal(word.reviewHistory.at(-1)?.at, word.lastReviewedAt);
  assert.equal(word.reviews, HISTORY_LIMIT + 5);
  assert.equal(word.stage, 6);
});

test("backup roundtrip retains categories and history, merges without overriding current progress", () => {
  const current = reviewWord(
    newWord("apple", "inbox", { levels: ["cet6"] }),
    "good",
    1000,
  );
  const backedUp = reviewWord(
    newWord("apple", "reading", { levels: ["ielts"] }),
    "easy",
    2000,
  );
  const additional = reviewWord(
    newWord("pear", "exam", { levels: ["gre"] }),
    "hard",
    3000,
  );
  const backup = bookSchema.parse(
    JSON.parse(
      JSON.stringify({ ...emptyBook(), words: [backedUp, additional] }),
    ),
  );
  const result = mergeBackup({ ...emptyBook(), words: [current] }, backup);
  assert.deepEqual(result.words[0].levels, ["cet6", "ielts"]);
  assert.deepEqual(result.words[0].folderIds, ["inbox", "reading"]);
  assert.equal(result.words[0].lastReviewedAt, 1000);
  assert.deepEqual(result.words[0].reviewHistory, current.reviewHistory);
  assert.equal(result.words[1].lastReviewedAt, 3000);
  assert.deepEqual(result.words[1].reviewHistory, additional.reviewHistory);
  assert.deepEqual(result.words[1].levels, ["gre"]);
});

test("invalid categories and out-of-range dates are rejected before rendering", () => {
  const word = newWord("apple", "inbox");
  for (const patch of [
    { levels: ["invented"] },
    { dueAt: 9e15 },
    { createdAt: 9e15 },
    { lastReviewedAt: 9e15 },
    { reviewHistory: [{ at: 1000, grade: "invalid", stage: 0, dueAt: 2000 }] },
  ]) {
    assert.equal(
      bookSchema.safeParse({ ...emptyBook(), words: [{ ...word, ...patch }] })
        .success,
      false,
    );
  }
});

test("large vocabulary reclaims oldest history without blocking future reviews or losing progress", () => {
  const words = Array.from({ length: 1000 }, (_, index) => {
    const suffix = [
      Math.floor(index / 676),
      Math.floor(index / 26) % 26,
      index % 26,
    ]
      .map((n) => String.fromCharCode(97 + n))
      .join("");
    let word = newWord(`word${suffix}`, "inbox", {
      levels: ["cet6"],
      note: "中文笔记",
    });
    for (let i = 0; i < 20; i++)
      word = reviewWord(word, "good", 1_700_000_000_000 + i * 86400000 + index);
    return word;
  });
  const original = bookSchema.parse({ ...emptyBook(), words });
  const size = (book: unknown) =>
    new TextEncoder().encode(JSON.stringify(book)).length;
  assert.ok(size(original) > BOOK_BYTE_LIMIT);
  const result = fitBookStorage(original);
  assert.ok(result.trimmed > 0);
  assert.ok(result.bytes <= BOOK_BYTE_LIMIT * 0.9);
  assert.equal(result.bytes, size(result.book));
  for (let i = 0; i < words.length; i++) {
    const { reviewHistory, ...progress } = result.book.words[i];
    const { reviewHistory: oldHistory, ...oldProgress } = original.words[i];
    assert.deepEqual(progress, oldProgress);
    assert.equal(oldHistory.length, 20);
    assert.deepEqual(reviewHistory, oldHistory.slice(-reviewHistory.length));
    assert.equal(reviewHistory.at(-1)?.at, progress.lastReviewedAt);
  }
  const next = {
    ...result.book,
    words: result.book.words.map((w) =>
      reviewWord(w, "good", 1_800_000_000_000),
    ),
  };
  assert.ok(fitBookStorage(next).bytes <= BOOK_BYTE_LIMIT);
});

test("storage pruning never deletes word content and reports oversized content accurately", () => {
  const word = reviewWord(
    newWord("apple", "inbox", { note: "长笔记".repeat(1000) }),
    "good",
    1000,
  );
  const book = { ...emptyBook(), words: [word] };
  assert.equal(fitBookStorage(book).book, book);
  const result = fitBookStorage(book, 500);
  assert.ok(result.bytes > 500);
  assert.equal(
    result.bytes,
    new TextEncoder().encode(JSON.stringify(result.book)).length,
  );
  assert.equal(result.book.words[0].note, word.note);
  assert.equal(result.book.words[0].lastReviewedAt, 1000);
  assert.equal(result.book.words[0].reviewHistory.length, 0);
  assert.equal(word.reviewHistory.length, 1);
});
