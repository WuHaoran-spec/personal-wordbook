import assert from "node:assert/strict";
// Run explicitly against the loopback development server only.
const origin = "http://localhost:5173";
const anon = await fetch(origin + "/api/book");
assert.equal(anon.status, 401);
const signIn = await fetch(origin + "/signin-with-chatgpt?return_to=%2F", {
  redirect: "manual",
});
const cookie = signIn.headers
  .getSetCookie()
  .map((c) => c.split(";")[0])
  .join("; ");
assert.ok(cookie, "Local mock sign-in must be enabled");
const headers = {
  "Content-Type": "application/json",
  Cookie: cookie,
  Origin: origin,
};
const read = async () => {
  const r = await fetch(origin + "/api/book", { headers });
  assert.equal(r.status, 200);
  return r.json();
};
const original = await read();
let current = original;
const write = async (book, version, extra = {}) =>
  fetch(origin + "/api/book", {
    method: "PUT",
    headers: { ...headers, ...extra },
    body: JSON.stringify({ book, version }),
  });
try {
  const blocked = await write(original.book, original.version, {
    Origin: "https://untrusted.example",
  });
  assert.equal(blocked.status, 403);
  const word = {
    id: crypto.randomUUID(),
    text: "integrationtestword",
    definition: "测试词条",
    phonetic: "",
    example: "",
    translation: "",
    phrases: "",
    note: "local QA",
    folderIds: [original.book.folders[0].id],
    starred: false,
    createdAt: Date.now(),
    dueAt: Date.now(),
    stage: 0,
    lapses: 0,
    reviews: 0,
  };
  let r = await write(
    { ...original.book, words: [...original.book.words, word] },
    original.version,
  );
  assert.equal(r.status, 200);
  current = await r.json();
  const persisted = await read();
  assert.ok(persisted.book.words.some((w) => w.id === word.id));
  const oldWord = persisted.book.words.find((w) => w.id === word.id);
  assert.deepEqual(oldWord.levels, []);
  assert.equal(oldWord.lastReviewedAt, null);
  assert.deepEqual(oldWord.reviewHistory, []);
  const { reviewWord, newWord, BOOK_BYTE_LIMIT } =
    await import("../lib/wordbook.ts");
  const reviewed = reviewWord(
    { ...oldWord, levels: ["cet6", "ielts"] },
    "good",
    Date.now(),
  );
  r = await write(
    {
      ...current.book,
      words: current.book.words.map((w) => (w.id === word.id ? reviewed : w)),
    },
    current.version,
  );
  assert.equal(r.status, 200);
  current = await r.json();
  const storedReview = (await read()).book.words.find((w) => w.id === word.id);
  assert.deepEqual(storedReview.levels, ["cet6", "ielts"]);
  assert.equal(storedReview.lastReviewedAt, reviewed.lastReviewedAt);
  assert.equal(storedReview.dueAt, reviewed.dueAt);
  assert.deepEqual(storedReview.reviewHistory, reviewed.reviewHistory);
  r = await write(original.book, original.version);
  assert.equal(r.status, 409, "Stale update must not overwrite new data");
  r = await write(
    { ...current.book, words: [{ ...word, folderIds: ["missing"] }] },
    current.version,
  );
  assert.equal(r.status, 400);
  r = await fetch(origin + "/api/lookup", {
    method: "POST",
    headers,
    body: JSON.stringify({ word: "apple" }),
  });
  assert.equal(r.status, 503);
  assert.equal((await r.json()).code, "NOT_CONFIGURED");
  const largeWords = Array.from({ length: 1000 }, (_, index) => {
    const suffix = [
      Math.floor(index / 676),
      Math.floor(index / 26) % 26,
      index % 26,
    ]
      .map((n) => String.fromCharCode(97 + n))
      .join("");
    let w = newWord(`smokeword${suffix}`, current.book.folders[0].id, {
      levels: ["cet6"],
      note: "测试笔记",
    });
    for (let i = 0; i < 20; i++)
      w = reviewWord(w, "good", 1_700_000_000_000 + i * 86400000);
    return w;
  });
  r = await write({ ...current.book, words: largeWords }, current.version);
  assert.equal(
    r.status,
    200,
    "Full review histories should be trimmed rather than block saving",
  );
  current = await r.json();
  assert.ok(current.historyTrimmed > 0);
  assert.ok(
    new TextEncoder().encode(JSON.stringify(current.book)).length <=
      BOOK_BYTE_LIMIT,
  );
  const reduced = await read();
  assert.equal(reduced.book.words.length, 1000);
  assert.equal(
    reduced.book.words[0].lastReviewedAt,
    largeWords[0].lastReviewedAt,
  );
  assert.equal(reduced.book.words[0].reviews, 20);
  r = await write(
    {
      ...reduced.book,
      words: reduced.book.words.map((w) => reviewWord(w, "good", Date.now())),
    },
    reduced.version,
  );
  assert.equal(r.status, 200, "Reviewing continues after capacity management");
  console.log(
    "PASS API: auth, CSRF origin, legacy defaults, persisted categories/review history, version conflicts, validation, capacity management, continued review, unconfigured Youdao.",
  );
} finally {
  const latest = await read();
  const restored = await write(original.book, latest.version);
  assert.equal(restored.status, 200);
  console.log("Restored local test data.");
}
