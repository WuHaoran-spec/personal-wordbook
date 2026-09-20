# 个性单词本 · Personal Wordbook

一个中文界面的开源词汇管理 Web App。适配手机和电脑，支持添加到主屏幕。

## 已实现

- 词汇文件夹：创建、重命名、删除；一个词可属于多个文件夹。
- 单词与短语：搜索、收藏、个人释义、例句、搭配、笔记及浏览器英语朗读。
- PDF 导入：浏览器内提取，词汇表/文章两种模式；预览勾选、大小写去重、保留同行中文。只上传确认后的词条，原 PDF 不上传。
- 词缀分类：内置经人工检查的常见构词关系；未知词仅给建议，确认后再分组，可忽略错误建议。
- 考试分类：四级、六级、雅思、托福、GRE、考研，可多选、筛选和批量标记；PDF 导入时可以同时添加分类。
- 间隔复习：按分类练习；评分按钮显示实际间隔，忘了 10 分钟后重现，记住后按 1/3/7/14/30/60 天安排。
- 复习记录：上次复习的具体时间与距今多久、下次安排、累计次数、最近 20 次评分；附遗忘曲线示意。
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
- 再次导入已有词会合并文件夹和考试分类，原释义为空时补全，已有笔记、释义、复习进度不覆盖。
- JSON 备份包含分类及复习记录，兼容旧版备份。恢复时，同名词只合并文件夹和分类，保留当前内容与复习进度（即使备份中的记录更新）；新词完整导入。
- 最多 50 个文件夹、5000 词条；整个词库 JSON 上限 1.5 MB，避免超过 D1 行大小限制。JSON 备份上传上限 16 MB。
- 每词最多保留最近 20 次评分明细。接近保存容量时，会提示并精简全词库最旧的明细，保留累计次数、上次复习时间和下次安排；词条内容不会自动删除。若仅词条内容已超限，则拒绝本次保存，原数据不变。
- 复习为透明的分级间隔规则，不宣称采用 SM-2 或 FSRS。
- 浏览器朗读取决于设备上可用的英语语音。
- 服务端以版本号防止旧页面覆盖新数据；冲突时保留编辑输入，重新读取词库。

## 部署与认证

本项目使用 React 19、TypeScript、Vinext/Vite、Cloudflare Workers + D1、Drizzle、Radix/Shadcn 和 Mozilla PDF.js。

部署配置、登录适配和数据库迁移见 [部署说明](docs/deployment.md)。**开源代码不包含个人词库、PDF、密钥或本地测试数据。**

## 分类与复习规则

考试分类是用户依据自己的教材、词表设置的备考标签，不是难度评级；同一个词可以用于多门考试。本项目不附带或冒称官方完整词库。导入六级、雅思或 GRE 词表后，可以批量选择对应分类。

复习时间仅在评分保存成功后更新。浏览、编辑、查词和导入不会被记为复习；旧词条没有历史时间时显示“旧版未记录时间”。新增字段保存在原词库中，不重置旧复习进度。

“记住了”前进一个阶段，“很熟悉”前进两个阶段；“有点难”保留阶段，将该阶段间隔减半取整（至少 1 天）；“忘了”回到新学阶段，10 分钟后再练。1/3/7/14/30/60 天是本项目的调度规则，不是针对每个人验证的最优间隔。曲线仅说明趋势，未使用个人记忆率，也不是原始实验曲线的复刻。

参考：[四、六级考试大纲](https://cet.neea.edu.cn/xhtml1/folder/16113/1588-1.htm)、[IELTS 词汇评价说明](https://ielts.org/take-a-test/preparation-resources/writing-test-resources)、[ETS GRE 词汇学习资料](https://www.ets.org/gre/test-takers/general-test/prepare/flashcards.html)。遗忘曲线实验背景见 [Murre & Dros（2015），Replication and Analysis of Ebbinghaus’ Forgetting Curve](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0120644)。

## 验证

- `npm test`：词缀保护词、去重导入、考试分类、复习时间与历史、旧备份迁移、异常日期、签名和词典字段解析。
- `npm run typecheck` / `npm run build`：类型检查及生产编译。
- `node tests/api-smoke.mjs`：仅对 localhost 开发服务运行；检查登录、跨源请求拦截、持久保存、版本冲突、无密钥错误；结束时恢复测试前数据。
- `tests/pdf.test.mjs`：实际 PDF 文本提取与空白扫描件文字层检测的基础契约。

## 参与贡献

欢迎提交 issue 或 pull request。先描述可复现的场景；修改后运行测试、类型检查和构建。词缀词典只收录已经核实的构词关系，不把字符串匹配当作词源。

MIT License。内置示例释义和例句为本项目原创；第三方词典内容仍受提供方条款约束。
