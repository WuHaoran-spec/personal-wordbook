import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeAffixes,
  normalizeWord,
  extractCandidates,
  emptyBook,
  newWord,
  mergeWords,
  reviewWord,
  bookSchema,
} from "../lib/wordbook.ts";
import { signYoudao, parseYoudao } from "../lib/youdao.ts";
import { createHash } from "node:crypto";

test("normalization keeps meaningful hyphens and spaces", () => {
  assert.equal(normalizeWord("  Don’t  "), "don't");
  assert.notEqual(normalizeWord("re-sign"), normalizeWord("resign"));
  assert.notEqual(normalizeWord("make up"), normalizeWord("makeup"));
});
test("reviewed affixes and protected exceptions", () => {
  assert.deepEqual(analyzeAffixes("unhappy").confirmed, ["un-"]);
  assert.deepEqual(analyzeAffixes("carefully").confirmed, ["-ful", "-ly"]);
  for (const word of [
    "union",
    "university",
    "result",
    "flower",
    "corner",
    "constructor",
  ])
    assert.deepEqual(analyzeAffixes(word).confirmed, []);
  assert.deepEqual(analyzeAffixes("rexyz").confirmed, []);
});
test("unknown affixes stay suggestions until confirmed", () => {
  assert.equal(analyzeAffixes("unconfirmedword").confirmed.length, 0);
  assert.ok(analyzeAffixes("unconfirmedword").suggested.includes("un-"));
  assert.deepEqual(analyzeAffixes("unconfirmedword", ["un-"]).confirmed, [
    "un-",
  ]);
  assert.deepEqual(analyzeAffixes("unconfirmedword", []).suggested, []);
});
test("vocabulary extraction deduplicates and preserves Chinese meaning", () => {
  const cs = extractCandidates([
    "1. Apple n. 苹果\nAPPLE 苹果\n2. re-sign v. 重新签名\nresign v. 辞职\nhttps://example.com",
  ]);
  assert.equal(cs.length, 3);
  assert.equal(cs[0].count, 2);
  assert.equal(cs[0].definition, "苹果");
});
test("article extraction filters stopwords and retains contractions", () => {
  const cs = extractCandidates(
    ["The reader can't rewrite the letter."],
    "article",
  );
  assert.deepEqual(
    cs.map((c: { text: string }) => c.text),
    ["reader", "can't", "rewrite", "letter"],
  );
});
test("imports merge folders, fill missing definition and preserve progress", () => {
  const b = emptyBook();
  const word = newWord("apple", "inbox", {
    stage: 3,
    reviews: 5,
    note: "my note",
    dueAt: 12345,
  });
  b.words = [word];
  const next = mergeWords(
    b,
    [{ text: "APPLE", definition: "苹果" }],
    "reading",
  );
  assert.equal(next.words.length, 1);
  assert.deepEqual(next.words[0].folderIds, ["inbox", "reading"]);
  assert.equal(next.words[0].definition, "苹果");
  assert.equal(next.words[0].reviews, 5);
  assert.equal(next.words[0].dueAt, 12345);
  assert.equal(next.words[0].note, "my note");
  const again = mergeWords(
    next,
    [{ text: "apple", definition: "replacement" }],
    "reading",
  );
  assert.equal(again.words[0].definition, "苹果");
  assert.equal(again.words[0].folderIds.length, 2);
});
test("review intervals and lapses", () => {
  const w = newWord("apple", "inbox");
  const now = 1_000_000;
  assert.equal(reviewWord(w, "good", now).dueAt, now + 86400000);
  const forgot = reviewWord({ ...w, stage: 3 }, "again", now);
  assert.equal(forgot.stage, 0);
  assert.equal(forgot.lapses, 1);
  assert.equal(forgot.dueAt, now + 600000);
  assert.equal(reviewWord({ ...w, stage: 6 }, "easy", now).stage, 6);
  assert.equal(reviewWord(w, "hard", now).dueAt, now + 86400000);
});
test("invalid backups, duplicate words and orphan folders are rejected", () => {
  const b = emptyBook();
  const w = newWord("apple", "inbox");
  assert.equal(
    bookSchema.safeParse({
      ...b,
      words: [w, { ...w, id: "other", text: "APPLE" }],
    }).success,
    false,
  );
  assert.equal(
    bookSchema.safeParse({ ...b, words: [{ ...w, folderIds: ["missing"] }] })
      .success,
    false,
  );
  assert.equal(
    bookSchema.safeParse({ ...b, words: [{ ...w, stage: 99 }] }).success,
    false,
  );
});
test("v3 signatures use Unicode code points and exact concatenation", async () => {
  const q = "abcdefghij🙂klmnopqrstuv";
  const a = Array.from(q);
  const expected = createHash("sha256")
    .update(
      "key" +
        a.slice(0, 10).join("") +
        a.length +
        a.slice(-10).join("") +
        "salt" +
        "123" +
        "secret",
    )
    .digest("hex");
  assert.equal(await signYoudao(q, "key", "secret", "salt", "123"), expected);
  assert.equal(
    await signYoudao("apple", "key", "secret", "salt", "123"),
    createHash("sha256").update("keyapplesalt123secret").digest("hex"),
  );
});
test("documented dictionary containers and translation mode", () => {
  const result = parseYoudao(
    {
      errorCode: "0",
      result: [
        {
          ec: {
            basic: { ukPhonetic: "test", explains: "n. 测试" },
            web: [{ phrase: "unit test", meaning: "单元测试" }],
            sentenceSample: [
              { sentence: "This is a test.", translation: "这是一个测试。" },
            ],
          },
        },
      ],
    },
    "dictionary",
  );
  assert.deepEqual(result.definitions, ["n. 测试"]);
  assert.equal(result.phonetic, "test");
  assert.equal(result.examples.length, 1);
  assert.equal(result.phrases[0].phrase, "unit test");
  assert.deepEqual(
    parseYoudao({ errorCode: "0", translation: ["苹果"] }, "translation")
      .definitions,
    ["苹果"],
  );
  assert.deepEqual(
    parseYoudao({ unexpected: true }, "dictionary").definitions,
    [],
  );
});
