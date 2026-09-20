import {
  userId,
  response,
  validWrite,
  youdaoConfig,
  database,
} from "@/lib/server";
import { normalizeWord, wordPattern } from "@/lib/wordbook";
import { signYoudao, parseYoudao, youdaoErrors } from "@/lib/youdao";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  if (!validWrite(req)) return response({ error: "请求格式不正确" }, 403);
  try {
    const owner = await userId();
    if (!owner) return response({ error: "请先登录" }, 401);
    const raw = await req.text();
    if (raw.length > 1000) return response({ error: "查询内容过长" }, 400);
    let input: unknown;
    try {
      input = JSON.parse(raw);
    } catch {
      return response({ error: "请求格式不正确" }, 400);
    }
    const word = (input as { word?: unknown })?.word;
    if (
      typeof word !== "string" ||
      word.length > 100 ||
      !wordPattern.test(normalizeWord(word))
    )
      return response({ error: "请输入英文单词或短语" }, 400);
    const q = normalizeWord(word),
      { key, secret, mode } = youdaoConfig();
    if (!key || !secret)
      return response(
        {
          error: "尚未配置有道应用密钥，可使用下方「有道查词」入口。",
          code: "NOT_CONFIGURED",
        },
        503,
      );
    const minute = Math.floor(Date.now() / 60000),
      day = Math.floor(Date.now() / 86400000);
    const allowed = await database()
      .prepare(
        "INSERT INTO lookup_usage (owner_id, minute, calls, day, day_calls) VALUES (?, ?, 1, ?, 1) ON CONFLICT(owner_id) DO UPDATE SET minute = excluded.minute, calls = CASE WHEN lookup_usage.minute = excluded.minute THEN lookup_usage.calls + 1 ELSE 1 END, day = excluded.day, day_calls = CASE WHEN lookup_usage.day = excluded.day THEN lookup_usage.day_calls + 1 ELSE 1 END WHERE (lookup_usage.minute != excluded.minute OR lookup_usage.calls < 20) AND (lookup_usage.day != excluded.day OR lookup_usage.day_calls < 200) RETURNING calls",
      )
      .bind(owner, minute, day)
      .first();
    if (!allowed)
      return response(
        {
          error:
            "已达到查询频率或每日额度（20 次/分钟、200 次/天），可继续使用有道查词链接。",
        },
        429,
      );
    const salt = crypto.randomUUID(),
      curtime = Math.floor(Date.now() / 1000).toString();
    const sign = await signYoudao(q, key, secret, salt, curtime);
    const params = new URLSearchParams({
      q,
      appKey: key,
      salt,
      curtime,
      sign,
      signType: "v3",
      ...(mode === "translation"
        ? { from: "en", to: "zh-CHS" }
        : { langType: "en", dicts: "ec" }),
    });
    const upstream = await fetch(
      mode === "translation"
        ? "https://openapi.youdao.com/api"
        : "https://openapi.youdao.com/v2/dict",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!upstream.ok)
      return response({ error: "有道服务暂不可用，请稍后再试。" }, 502);
    let payload: { errorCode?: string | number };
    try {
      payload = (await upstream.json()) as { errorCode?: string | number };
    } catch {
      return response({ error: "有道服务返回了无法解析的内容。" }, 502);
    }
    if (String(payload.errorCode) !== "0")
      return response(
        {
          error:
            youdaoErrors[String(payload.errorCode)] ??
            "有道查询未成功，请检查应用的词典服务权限。",
          code: String(payload.errorCode ?? "UPSTREAM_SCHEMA_ERROR"),
        },
        502,
      );
    const parsed = parseYoudao(payload, mode);
    if (
      !parsed.definitions.length &&
      !parsed.examples.length &&
      !parsed.phrases.length
    )
      return response(
        {
          error: "有道未返回可识别的词典内容，可使用查词链接。",
          code: "UPSTREAM_SCHEMA_ERROR",
        },
        502,
      );
    return response(parsed);
  } catch {
    return response(
      { error: "查询超时或服务暂不可用，可打开有道词典继续查词。" },
      502,
    );
  }
}
