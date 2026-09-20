export type LookupResult = {
  definitions: string[];
  phonetic: string;
  examples: { sentence: string; translation: string }[];
  phrases: { phrase: string; meaning: string }[];
  provider: "dictionary" | "translation";
};
export async function signYoudao(
  q: string,
  key: string,
  secret: string,
  salt: string,
  curtime: string,
) {
  const chars = Array.from(q);
  const input =
    chars.length <= 20
      ? q
      : chars.slice(0, 10).join("") + chars.length + chars.slice(-10).join("");
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(key + input + salt + curtime + secret),
  );
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {};
const list = (v: unknown): unknown[] =>
  Array.isArray(v) ? v : v !== undefined && v !== null ? [v] : [];
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const strings = (v: unknown): string[] =>
  list(v).flatMap((x) =>
    typeof x === "string"
      ? [x]
      : list(obj(x).explain ?? obj(x).text).filter(
          (t): t is string => typeof t === "string",
        ),
  );
// Accommodates the documented v2 containers and text-translation fields.
// These fixtures are contract tests, not a claim of live dictionary validation.
export function parseYoudao(payload: unknown, mode: string): LookupResult {
  const p = obj(payload),
    data = obj(p.data);
  let raw = p.result ?? (Object.keys(data).length ? data : p);
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }
  const roots = list(raw).flatMap((v) => {
    const x = obj(v);
    return list(x.ec ?? x).map(obj);
  });
  const definitions: string[] = [],
    examples: LookupResult["examples"] = [],
    phrases: LookupResult["phrases"] = [];
  let phonetic = "";
  for (const root of roots) {
    const basic = obj(root.basic);
    definitions.push(
      ...strings(
        basic.explains ??
          basic.explain ??
          root.explains ??
          root.explain ??
          root.translation,
      ),
    );
    phonetic ||= str(
      basic.ukPhonetic ??
        basic.usPhonetic ??
        basic["uk-phonetic"] ??
        basic.phonetic ??
        root.ukPhonetic ??
        root.phonetic,
    );
    for (const value of list(root.sentenceSample ?? basic.sentenceSample)) {
      const x = obj(value);
      const sentence = str(x.sentence);
      if (sentence)
        examples.push({ sentence, translation: str(x.translation) });
    }
    for (const value of list(
      root.phrases ?? root.phrase ?? basic.phrases ?? root.web,
    )) {
      const x = obj(value);
      const phrase = str(x.phrase ?? x.key ?? x.text);
      if (phrase)
        phrases.push({
          phrase,
          meaning: str(x.meaning) || strings(x.explain ?? x.value).join("；"),
        });
    }
  }
  return {
    definitions: [...new Set(definitions)].slice(0, 40),
    phonetic,
    examples: examples.slice(0, 20),
    phrases: phrases.slice(0, 30),
    provider: mode === "translation" ? "translation" : "dictionary",
  };
}
export const youdaoErrors: Record<string, string> = {
  "101": "有道参数缺失，请检查服务端配置。",
  "108": "有道应用标识无效。",
  "110": "应用未绑定有效的有道服务，请检查服务权限。",
  "202": "有道签名校验失败，请检查应用密钥。",
  "401": "有道账户余额不足。",
  "411": "有道请求过于频繁，请稍后再试。",
  "120": "有道暂未收录该词。",
  "301": "有道词典查询失败，请稍后重试。",
  "302": "有道翻译查询失败，请稍后重试。",
};
