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
  console.log(
    "PASS API: auth, CSRF origin, persistent save, version conflicts, validation, unconfigured Youdao.",
  );
} finally {
  const latest = await read();
  const restored = await write(original.book, latest.version);
  assert.equal(restored.status, 200);
  console.log("Restored local test data.");
}
