import { z } from "zod";
import { bookSchema, emptyBook } from "@/lib/wordbook";
import {
  database,
  userId,
  response,
  validWrite,
  youdaoConfig,
} from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const owner = await userId();
    if (!owner)
      return response({ error: "请先登录以保存和同步你的单词本。" }, 401);
    const row = await database()
      .prepare("SELECT data, version FROM wordbooks WHERE owner_id = ?")
      .bind(owner)
      .first<{ data: string; version: number }>();
    const config = youdaoConfig();
    return response({
      book: row ? bookSchema.parse(JSON.parse(row.data)) : emptyBook(),
      version: row?.version ?? 0,
      youdao: {
        configured: !!(config.key && config.secret),
        mode: config.mode,
      },
    });
  } catch {
    console.error("Wordbook read failed");
    return response({ error: "暂时无法读取单词本，请稍后重试。" }, 503);
  }
}
export async function PUT(req: Request) {
  try {
    if (!validWrite(req))
      return response({ error: "请求来源或格式不正确" }, 403);
    const owner = await userId();
    if (!owner) return response({ error: "请先登录" }, 401);
    const raw = await req.text();
    if (raw.length > 5000000)
      return response({ error: "数据过大，一本最多保存 5000 个词条" }, 413);
    const parsed = z
      .object({ book: bookSchema, version: z.number().int().nonnegative() })
      .safeParse(JSON.parse(raw));
    if (!parsed.success)
      return response(
        { error: parsed.error.issues[0]?.message ?? "词条格式不正确" },
        400,
      );
    const { book, version } = parsed.data;
    if (new TextEncoder().encode(JSON.stringify(book)).length > 1500000)
      return response(
        { error: "单词本数据超过 1.5 MB，请精简长笔记或先导出备份。" },
        413,
      );
    const saved = await database()
      .prepare(
        "INSERT INTO wordbooks (owner_id, data, version, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(owner_id) DO UPDATE SET data = excluded.data, version = wordbooks.version + 1, updated_at = excluded.updated_at WHERE wordbooks.version = ? RETURNING version",
      )
      .bind(owner, JSON.stringify(book), Date.now(), version)
      .first<{ version: number }>();
    if (!saved)
      return response(
        { error: "单词本已在其他页面更新，请重新加载后再保存。" },
        409,
      );
    return response({ book, version: saved.version });
  } catch (e) {
    if (e instanceof SyntaxError)
      return response({ error: "无效的 JSON 数据" }, 400);
    console.error("Wordbook write failed");
    return response(
      { error: "保存失败，你的输入仍保留在当前页面。请稍后重试。" },
      503,
    );
  }
}
