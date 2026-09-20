# 个性单词本 · Personal Wordbook

一个中文界面的开源词汇管理 Web App。适配手机和电脑，支持添加到主屏幕。

## 已实现

- 词汇文件夹：创建、重命名、删除；一个词可属于多个文件夹。
- 单词与短语：搜索、收藏、个人释义、例句、搭配、笔记及浏览器英语朗读。
- PDF 导入：浏览器内提取，词汇表/文章两种模式；预览勾选、大小写去重、保留同行中文。只上传确认后的词条，原 PDF 不上传。
- 词缀发现：内置经人工检查的常见构词关系；未知词仅给建议，确认后再分组，可忽略错误建议。
- 间隔复习：答案揭晓后评分；忘了 10 分钟后重现，记住后按 1/3/7/14/30/60 天安排。
- 数据库持久保存，按账号隔离；版本冲突保护，避免不同页面静默覆盖。
- JSON 备份与合并恢复、CSV 导出（包含公式注入防护）。
- PWA 安装入口、通用离线提示。**词库与查词需要联网，不支持离线写入。**

## 快速运行

需要 **Node.js 22.13+**（推荐 24）和 npm。

```sh
git clone https://github.com/WuHaoran-spec/personal-wordbook.git
cd personal-wordbook
npm ci
npm run db:local
npm run dev
```

打开终端显示的地址（默认 http://localhost:5173）。点击「登录并开始」使用仅限本机开发的测试身份。词库保存于忽略提交的 `.wrangler/state` 中，重启仍保留。

```sh
npm test
npm run typecheck
npm run build
```

`npm run postinstall` 会复制当前 PDF.js worker，并生成 PWA 图标。若安装时禁用了生命周期脚本，请手动运行它。

## 有道接入：真实能力与限制

默认不附带任何密钥，也不会伪造实时查词结果。未配置时，每个词提供「有道查词」网页入口；用户可以保存自己的释义与例句。

复制 `.env.example` 为 `.env`，在**服务端**配置：

```dotenv
YOUDAO_APP_KEY=你的应用ID
YOUDAO_APP_SECRET=你的应用密钥
YOUDAO_MODE=dictionary
```

- `dictionary` 使用有道官方 `/v2/dict`，需要有道商务单独开通；可按实际返回展示释义、音标、例句、词组。
- `translation` 使用官方 `/api`，仅保证中文翻译。普通翻译 API 已下线相关词典数据，不能保证例句与短语。
- 请求使用 v3 SHA-256 签名。密钥不会送到浏览器。每账号限制 20 次/分钟、200 次/UTC 日；额度计数保存在 D1。
- 查询会把当前输入的英文词发送给有道。按官方词典条款，结果只在当前页面实时显示，不写入数据库、不导出、不存入 service worker 缓存。
- **没有有道凭证，因此尚未完成真实上游联调。** 已验证签名和文档字段的合成 fixture；正式开通后应以授权返回样本确认响应解析。
- 此项目接入的是有道智云词典/翻译 API 和有道词典网页，并非控制「有道翻译官」App。

官方文档：[词典 API](https://ai.youdao.com/DOCSIRMA/html/dictionary/api/ydcd/index.html) · [文本翻译 API](https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html)

## 导入与存储边界

- PDF 上限 20 MB、200 页；扫描件需先经 OCR 转成带文字层的 PDF；不在本版本内执行 OCR。
- 多栏、断行、页眉可能影响提取；确认前检查候选及原始行。文章提词不自动还原词形。
- 再次导入已有词会合并文件夹，原释义为空时补全，已有笔记、释义、复习进度不覆盖。
- 最多 50 个文件夹、5000 词条；整个词库 JSON 上限 1.5 MB，避免超过 D1 行大小限制。JSON 备份上传上限 16 MB。
- 复习为透明的分级间隔规则，不宣称采用 SM-2 或 FSRS。
- 浏览器朗读取决于设备上可用的英语语音。
- 服务端以版本号防止旧页面覆盖新数据；冲突时保留编辑输入，重新读取词库。

## 部署与认证

本项目使用 React 19、TypeScript、Vinext/Vite、Cloudflare Workers + D1、Drizzle、Radix/Shadcn 和 Mozilla PDF.js。

`.openai/hosting.json` 对应本项目的 Sites 实例，D1 逻辑绑定为 `DB`。通过 Sites 发布时由平台应用 `drizzle/` 迁移并提供受信任的认证头。**开源代码不包含个人词库、PDF、密钥或本地测试数据。**

生产 API 必须获得可信网关注入的 `oai-authenticated-user-id` 和 email；缺失时返回 401。本地登录模拟只用于 loopback 开发，不编入生产。其他平台部署必须替换认证适配器或配置可信认证网关，剥离外部伪造的同名请求头，不能把裸 Worker 当作已具备公开登录能力的服务。不要把本机开发服务暴露到公网。

有道生产密钥通过托管平台的环境变量/secret 配置，不要提交 `.env`。如果另建 Sites 实例，请先删除复制仓库中的 `project_id`，让新实例绑定自己的数据库和认证。

数据库结构定义在 `db/schema.ts`。变更后运行 `npm run db:generate`，检查并提交新增迁移。已应用的迁移不要修改。

## 验证

- `npm test`：词缀保护词、去重导入、复习间隔、备份校验、签名、词典字段解析。
- `npm run typecheck` / `npm run build`：类型检查及生产编译。
- `node tests/api-smoke.mjs`：仅对 localhost 开发服务运行；检查登录、跨源请求拦截、持久保存、版本冲突、无密钥错误；结束时恢复测试前数据。
- `tests/pdf.test.mjs`：实际 PDF 文本提取与空白扫描件文字层检测的基础契约。

## 参与贡献

欢迎提交 issue 或 pull request。先描述可复现的场景；修改后运行测试、类型检查和构建。词缀词典只收录已经核实的构词关系，不把字符串匹配当作词源。

MIT License。内置示例释义和例句为本项目原创；第三方词典内容仍受提供方条款约束。
