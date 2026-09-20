import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
export function database() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("数据库暂不可用");
  return db;
}
export async function userId() {
  const user = await getChatGPTUser();
  return user?.userId ?? null;
}
export function response(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function validWrite(req: Request) {
  return (
    (!req.headers.get("origin") ||
      req.headers.get("origin") === new URL(req.url).origin) &&
    req.headers.get("content-type")?.includes("application/json")
  );
}
export function youdaoConfig() {
  const e = env as unknown as Record<string, string | undefined>;
  return {
    key: e.YOUDAO_APP_KEY ?? process.env.YOUDAO_APP_KEY,
    secret: e.YOUDAO_APP_SECRET ?? process.env.YOUDAO_APP_SECRET,
    mode: e.YOUDAO_MODE ?? process.env.YOUDAO_MODE ?? "dictionary",
  };
}
