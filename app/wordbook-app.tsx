"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Folder as FolderIcon,
  Plus,
  Search,
  Upload,
  Layers,
  RotateCcw,
  Settings,
  Volume2,
  ArrowUpRight,
  Star,
  Pencil,
  Trash2,
  Download,
  Check,
  Loader2,
  X,
  ArrowRight,
  FileText,
  Cloud,
  LogIn,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { toast, Toaster } from "sonner";
import {
  analyzeAffixes,
  affixMeanings,
  bookSchema,
  demoWords,
  emptyBook,
  extractCandidates,
  mergeWords,
  mergeBackup,
  newWord,
  normalizeWord,
  reviewWord,
  reviewPlan,
  matchesLevel,
  addLevels,
  levelLabels,
  wordPattern,
  type Book,
  type Word,
  type Candidate,
  type Grade,
  type ExamLevel,
} from "@/lib/wordbook";
import type { LookupResult } from "@/lib/youdao";
import {
  LevelPicker,
  LevelFilter,
  LevelTags,
  LastReview,
  ReviewRecord,
  ForgettingCurve,
} from "./study-panels";

type Modal = "word" | "folder" | "import" | "levels" | null;
type LookupState = {
  word: string;
  loading?: boolean;
  data?: LookupResult;
  error?: string;
};
const seed = demoWords();
function FolderSelect({
  value,
  onChange,
  book,
  label = "选择文件夹",
}: {
  value: string;
  onChange: (value: string) => void;
  book: Book;
  label?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {book.folders.map((f) => (
          <SelectItem key={f.id} value={f.id}>
            {f.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
function SideNav({
  view,
  setView,
  folder,
  setFolder,
  book,
  counts,
  onFolder,
  onSettings,
}: {
  view: string;
  setView: (s: string) => void;
  folder: string;
  setFolder: (s: string) => void;
  book: Book;
  counts: { all: number; due: number };
  onFolder: () => void;
  onSettings: () => void;
}) {
  const { setOpenMobile } = useSidebar();
  const navigate = (v: string, f = "") => {
    setView(v);
    setFolder(f);
    setOpenMobile(false);
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="brand">
          <span className="brand-mark">
            <BookOpen size={23} />
          </span>
          <div>
            单词本<small>PERSONAL WORDBOOK</small>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="nav-label">词库与复习</div>
        {[
          { id: "words", label: "全部单词", icon: BookOpen, count: counts.all },
          {
            id: "review",
            label: "今日复习",
            icon: RotateCcw,
            count: counts.due,
          },
          { id: "affixes", label: "词缀分类", icon: Layers },
          { id: "starred", label: "我的收藏", icon: Star },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            className={`nav-item ${view === id && !folder ? "active" : ""}`}
            onClick={() => navigate(id)}
          >
            <Icon size={19} />
            {label}
            {count !== undefined && <span>{count}</span>}
          </button>
        ))}
        <div className="nav-label folder-label">
          词汇文件夹
          <button
            onClick={onFolder}
            aria-label="新建文件夹"
            className="sidebar-add"
          >
            <Plus size={17} />
          </button>
        </div>
        {book.folders.map((f) => (
          <button
            key={f.id}
            className={`nav-item ${folder === f.id ? "active" : ""}`}
            onClick={() => navigate("words", f.id)}
          >
            <FolderIcon size={18} />
            <b>{f.name}</b>
            <span>
              {book.words.filter((w) => w.folderIds.includes(f.id)).length}
            </span>
          </button>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <button
          className="nav-item"
          onClick={() => {
            onSettings();
            setOpenMobile(false);
          }}
        >
          <Settings size={18} />
          设置与数据
        </button>
        <div className="sidebar-note">个性单词本 · 开源版</div>
      </SidebarFooter>
    </Sidebar>
  );
}
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function speak(word: string) {
  if (!("speechSynthesis" in window)) {
    toast.error("当前浏览器不支持朗读");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}
export default function WordbookApp() {
  const [book, setBook] = useState<Book>(emptyBook);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [youdao, setYoudao] = useState({
    configured: false,
    mode: "dictionary",
  });
  const [view, setView] = useState("words");
  const [folder, setFolder] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("demo-serendipity");
  const [limit, setLimit] = useState(40);
  const [affixFilter, setAffixFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [importLevels, setImportLevels] = useState<ExamLevel[]>([]);
  const [bulkLevels, setBulkLevels] = useState<ExamLevel[]>([]);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [settings, setSettings] = useState(false);
  const [editing, setEditing] = useState<Word | null>(null);
  const [draft, setDraft] = useState<Word>(() => newWord("", "inbox"));
  const [folderName, setFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState("");
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    run: () => Promise<void>;
  } | null>(null);
  const [lookup, setLookup] = useState<LookupState | null>(null);
  const [draftLookup, setDraftLookup] = useState<LookupState | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [importMode, setImportMode] = useState<"entries" | "article">(
    "entries",
  );
  const [importFolder, setImportFolder] = useState("inbox");
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState("");
  const [importName, setImportName] = useState("");
  const [importText, setImportText] = useState("");
  const [candidateLimit, setCandidateLimit] = useState(100);
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const r = await fetch("/api/book", { cache: "no-store" });
      const d = (await r.json()) as {
        error: string;
        book: Book;
        version: number;
        youdao: { configured: boolean; mode: string };
      };
      if (r.status === 401) {
        setSignedIn(false);
        return;
      }
      if (!r.ok) throw new Error(d.error);
      setSignedIn(true);
      setBook(bookSchema.parse(d.book));
      setVersion(d.version);
      setYoudao(d.youdao);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "读取失败，请重试");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production")
      navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, [load]);
  const save = useCallback(
    async (next: Book) => {
      if (lock.current) return false;
      if (!signedIn) {
        toast.error("请先登录，再保存你的单词本");
        return false;
      }
      lock.current = true;
      setBusy(true);
      try {
        const checked = bookSchema.parse(next);
        const r = await fetch("/api/book", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ book: checked, version }),
        });
        const d = (await r.json()) as {
          error: string;
          book: Book;
          version: number;
          historyTrimmed?: number;
          youdao: { configured: boolean; mode: string };
        };
        if (!r.ok) {
          if (r.status === 409) await load();
          throw new Error(d.error);
        }
        setBook(d.book);
        setVersion(d.version);
        setClock(Date.now());
        if (d.historyTrimmed)
          toast.info(
            "已保存。为腾出空间，已精简最旧的复习明细；累计次数、上次复习时间和下次安排均保留。",
            { duration: 8000 },
          );
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "保存失败");
        return false;
      } finally {
        lock.current = false;
        setBusy(false);
      }
    },
    [signedIn, version, load],
  );
  const demo = !loading && !loadError && book.words.length === 0;
  const displayed = demo ? seed : book.words;
  const currentFolder = book.folders.find((f) => f.id === folder);
  const analyses = useMemo(
    () =>
      new Map(displayed.map((w) => [w.id, analyzeAffixes(w.text, w.affixes)])),
    [displayed],
  );
  const allAffixes = [
    ...new Set(displayed.flatMap((w) => analyses.get(w.id)?.confirmed ?? [])),
  ];
  const due = book.words
    .filter((w) => w.dueAt <= clock && matchesLevel(w, levelFilter))
    .sort((a, b) => a.dueAt - b.dueAt);
  const filtered = displayed.filter(
    (w) =>
      (!folder || w.folderIds.includes(folder)) &&
      matchesLevel(w, levelFilter) &&
      (view !== "starred" || w.starred) &&
      (!affixFilter || analyses.get(w.id)?.confirmed.includes(affixFilter)) &&
      (!search ||
        [w.text, w.definition, w.note].some((v) =>
          v.toLowerCase().includes(search.toLowerCase()),
        )),
  );
  const active = filtered.find((w) => w.id === selected) ?? filtered[0];
  const activeKey = active?.text ?? "";
  const review = reviewIds
    ?.map((id) => book.words.find((w) => w.id === id))
    .find(Boolean);
  const heading =
    currentFolder?.name ??
    {
      words: "全部单词",
      starred: "我的收藏",
      review: "今日复习",
      affixes: "词缀分类",
    }[view] ??
    "全部单词";
  useEffect(() => {
    setLimit(40);
    setAffixFilter("");
  }, [folder, view, search]);
  useEffect(() => {
    setLimit(40);
  }, [levelFilter]);
  useEffect(() => {
    setLookup(null);
    if (!activeKey || !signedIn || !youdao.configured) return;
    const controller = new AbortController();
    setLookup({ word: activeKey, loading: true });
    fetch("/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: activeKey }),
      signal: controller.signal,
    })
      .then(async (r) => {
        const data = (await r.json()) as LookupResult & { error: string };
        if (!r.ok) throw new Error(data.error);
        setLookup({ word: activeKey, data });
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setLookup({ word: activeKey, error: e.message });
      });
    return () => controller.abort();
  }, [activeKey, youdao.configured, signedIn]);
  useEffect(() => {
    setDraftLookup(null);
    const text = normalizeWord(draft.text);
    if (
      modal !== "word" ||
      !signedIn ||
      !youdao.configured ||
      !wordPattern.test(text)
    )
      return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setDraftLookup({ word: text, loading: true });
      fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: text }),
        signal: controller.signal,
      })
        .then(async (r) => {
          const d = (await r.json()) as {
            error: string;
            book: Book;
            version: number;
            youdao: { configured: boolean; mode: string };
          };
          if (!r.ok) throw new Error(d.error);
          setDraftLookup({ word: text, data: d as unknown as LookupResult });
        })
        .catch((e) => {
          if (e.name !== "AbortError")
            setDraftLookup({ word: text, error: e.message });
        });
    }, 700);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [draft.text, modal, youdao.configured, signedIn]);
  const openAdd = () => {
    setEditing(null);
    setDraft(
      newWord("", folder || book.folders[0].id, {
        levels:
          levelFilter && levelFilter !== "unclassified"
            ? [levelFilter as ExamLevel]
            : [],
      }),
    );
    setModal("word");
  };
  const openEdit = (word: Word) => {
    setEditing(word);
    setDraft({ ...word });
    setModal("word");
  };
  async function submitWord(e: React.FormEvent) {
    e.preventDefault();
    const word = { ...draft, text: normalizeWord(draft.text) };
    if (!wordPattern.test(word.text)) {
      toast.error("请输入英文单词或短语");
      return;
    }
    const duplicate = book.words.find(
      (w) => normalizeWord(w.text) === word.text && w.id !== editing?.id,
    );
    if (duplicate) {
      toast.error("这个词已经在单词本中，可以编辑它的文件夹。");
      return;
    }
    const editFields = (w: Word) => ({
      text: w.text,
      definition: w.definition,
      example: w.example,
      translation: w.translation,
      phrases: w.phrases,
      note: w.note,
      folderIds: w.folderIds,
      levels: w.levels,
    });
    const current = editing
      ? book.words.find((w) => w.id === editing.id)
      : null;
    if (
      editing &&
      (!current ||
        JSON.stringify(editFields(current)) !==
          JSON.stringify(editFields(editing)))
    ) {
      toast.error(
        "这个词已在其他页面修改，请关闭编辑框后重新打开。你的输入仍在当前表单中。",
      );
      return;
    }
    const next = {
      ...book,
      words: editing
        ? book.words.map((w) =>
            w.id === editing.id ? { ...w, ...editFields(word) } : w,
          )
        : [word, ...book.words],
    };
    if (await save(next)) {
      setSelected(word.id);
      setSearch("");
      setView("words");
      if (!matchesLevel(word, levelFilter)) setLevelFilter("");
      if (folder && !word.folderIds.includes(folder)) setFolder("");
      setModal(null);
      toast.success(editing ? "词条已更新" : "已加入单词本");
    }
  }
  async function submitFolder(e: React.FormEvent) {
    e.preventDefault();
    const name = folderName.trim();
    if (!name) return;
    if (book.folders.some((f) => f.name === name && f.id !== editingFolder)) {
      toast.error("已有同名文件夹");
      return;
    }
    const id = editingFolder || crypto.randomUUID();
    if (
      await save({
        ...book,
        folders: editingFolder
          ? book.folders.map((f) => (f.id === id ? { ...f, name } : f))
          : [...book.folders, { id, name }],
      })
    ) {
      setModal(null);
      setFolder(id);
      setView("words");
      toast.success("文件夹已保存");
    }
  }
  async function seedBook() {
    if (
      await save({
        ...book,
        words: seed.map((w) => ({
          ...w,
          id: crypto.randomUUID(),
          folderIds: [book.folders[0].id],
          createdAt: Date.now(),
          dueAt: Date.now(),
        })),
      })
    )
      toast.success("6 个示例词已加入，可以开始体验复习");
  }
  async function loadPdf(file?: File) {
    if (!file) return;
    setImportBusy(true);
    setImportError("");
    setImportName(file.name);
    setPages([]);
    setCandidates([]);
    try {
      const { readPdf } = await import("@/lib/pdf");
      const result = await readPdf(file);
      setPages(result);
      setCandidates(extractCandidates(result, importMode));
      setCandidateLimit(100);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "PDF 读取失败");
    } finally {
      setImportBusy(false);
    }
  }
  function switchImportMode(mode: "entries" | "article") {
    setImportMode(mode);
    setCandidates(extractCandidates(pages, mode));
    setCandidateLimit(100);
  }
  async function importWords() {
    const chosen = candidates.filter((c) => c.selected);
    try {
      const next = mergeWords(book, chosen, importFolder, importLevels);
      const added = next.words.length - book.words.length;
      if (await save(next)) {
        setModal(null);
        setFolder(importFolder);
        setSearch("");
        setView("words");
        setLevelFilter("");
        toast.success(`新增 ${added} 个单词，已有词条保留原笔记与复习进度。`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "导入失败");
    }
  }
  async function restoreBackup(file?: File) {
    if (!file) return;
    try {
      if (file.size > 16 * 1024 * 1024) throw new Error("备份请小于 16 MB");
      const raw = JSON.parse(await file.text());
      const backup = bookSchema.parse(raw.book ?? raw);
      const next = mergeBackup(book, backup);
      if (await save(next))
        toast.success(
          "备份已合并；同名词仅合并文件夹和分类，保留当前内容与复习记录。",
        );
    } catch {
      toast.error("无法读取备份，请选择本应用导出的有效 JSON 文件。");
    }
  }
  function startReview() {
    setReviewIds(due.map((w) => w.id));
    setReviewTotal(due.length);
    setRevealed(false);
  }
  async function grade(g: Grade) {
    if (!review || !revealed) return;
    const updated = reviewWord(review, g);
    if (
      await save({
        ...book,
        words: book.words.map((w) => (w.id === review.id ? updated : w)),
      })
    ) {
      setReviewIds(
        (ids) =>
          ids?.filter(
            (id) => id !== review.id && book.words.some((w) => w.id === id),
          ) ?? null,
      );
      setRevealed(false);
      setClock(Date.now());
    }
  }
  return (
    <SidebarProvider>
      <Toaster position="top-center" richColors theme="light" />
      <SideNav
        view={view}
        setView={setView}
        folder={folder}
        setFolder={setFolder}
        book={book}
        counts={{ all: book.words.length, due: due.length }}
        onFolder={() => {
          setFolderName("");
          setEditingFolder("");
          setModal("folder");
        }}
        onSettings={() => setSettings(true)}
      />
      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="mobile-menu" aria-label="打开导航" />
            我的学习空间 <span>/</span> {heading}
          </div>
          <span className="local-tag">
            {loading ? (
              "正在读取…"
            ) : busy ? (
              "正在保存…"
            ) : signedIn ? (
              <>
                <Cloud size={13} /> 已连接单词本
              </>
            ) : (
              "体验预览"
            )}
          </span>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <h1>{heading}</h1>
              <p className="muted">
                {view === "affixes"
                  ? "按已确认的前缀、后缀查看单词。"
                  : view === "review"
                    ? "按到期时间复习，记录每次的记忆情况。"
                    : "整理词汇、标记考试分类，按计划复习。"}
              </p>
            </div>
            <div className="actions">
              <button
                className="button secondary"
                onClick={() => {
                  setImportFolder(folder || book.folders[0].id);
                  setImportLevels(
                    levelFilter && levelFilter !== "unclassified"
                      ? [levelFilter as ExamLevel]
                      : [],
                  );
                  setModal("import");
                }}
              >
                <Upload size={17} />
                导入 PDF
              </button>
              <button className="button primary" onClick={openAdd}>
                <Plus size={18} />
                添加单词
              </button>
            </div>
          </div>
          {!loading && !signedIn && !loadError && (
            <div className="notice">
              <div>
                <strong>这是你的单词本预览</strong>
                <span>登录后可保存词汇和复习进度，并在不同设备上访问。</span>
              </div>
              <a
                className="button primary"
                href="/signin-with-chatgpt?return_to=%2F"
                target="_top"
              >
                <LogIn size={16} />
                登录并开始
              </a>
            </div>
          )}
          {loadError && (
            <div role="alert" className="notice error">
              <span>{loadError}</span>
              <button className="button secondary" onClick={() => void load()}>
                重试读取
              </button>
            </div>
          )}
          <div className="stats">
            <div>
              <span>已收集单词</span>
              <strong>
                {book.words.length}
                <small>个</small>
              </strong>
              <BookOpen />
            </div>
            <div>
              <span>今日待复习</span>
              <strong>
                {due.length}
                <small>个</small>
              </strong>
              <RotateCcw />
            </div>
            <div>
              <span>已确认词缀</span>
              <strong>
                {demo ? 0 : allAffixes.length}
                <small>组</small>
              </strong>
              <Layers />
            </div>
          </div>
          {demo && signedIn && (
            <div className="notice subtle">
              <span>
                下面是原创示例词条。添加第一个单词，或把示例加入词库试试看。
              </span>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => void seedBook()}
              >
                加入 6 个示例
              </button>
            </div>
          )}
          <LevelFilter
            value={levelFilter}
            words={
              view === "review"
                ? book.words
                : displayed.filter(
                    (w) =>
                      (!folder || w.folderIds.includes(folder)) &&
                      (view !== "starred" || w.starred),
                  )
            }
            onChange={(value) => {
              setLevelFilter(value);
              setReviewIds(null);
              setRevealed(false);
            }}
          />
          {view === "review" ? (
            <>
              <section className="review-panel">
                {reviewIds === null ? (
                  <>
                    <div className="review-icon">
                      <RotateCcw size={32} />
                    </div>
                    <h2>
                      {due.length
                        ? `当前分类有 ${due.length} 个待复习单词`
                        : "当前分类暂无到期单词"}
                    </h2>
                    <p className="muted">
                      先回忆释义，再翻开卡片。根据记忆情况安排下次复习。
                    </p>
                    <button
                      className="button primary"
                      onClick={startReview}
                      disabled={!due.length || busy}
                    >
                      开始复习
                      <ArrowRight size={17} />
                    </button>
                    <p className="fine-print">
                      新词立即进入复习；记住后按 1、3、7、14、30、60
                      天逐步安排。
                    </p>
                  </>
                ) : review ? (
                  <>
                    <div className="review-progress">
                      {reviewTotal - (reviewIds?.length ?? 0) + 1} /{" "}
                      {reviewTotal}
                      <button
                        className="button secondary"
                        onClick={() => setReviewIds(null)}
                      >
                        结束本轮
                      </button>
                    </div>
                    <h2 className="review-word">{review.text}</h2>
                    <LevelTags word={review} />
                    <p className="review-last">
                      <LastReview word={review} now={clock} />
                    </p>
                    <button
                      className="icon-button"
                      onClick={() => speak(review.text)}
                      aria-label="朗读复习单词"
                    >
                      <Volume2 />
                    </button>
                    {revealed ? (
                      <>
                        <p className="review-definition">
                          {review.definition ||
                            "还没有自己的释义，可以在有道查词后补充手记。"}
                        </p>
                        {review.example && (
                          <p className="review-example">{review.example}</p>
                        )}
                        {review.note && <p className="muted">{review.note}</p>}
                        <a
                          className="youdao-link"
                          target="_blank"
                          rel="noreferrer"
                          href={youdaoUrl(review.text)}
                        >
                          有道查词
                          <ArrowUpRight size={16} />
                        </a>
                        <div className="grade-buttons">
                          {(
                            [
                              ["again", "忘了", "10 分钟后"],
                              ["hard", "有点难", "缩短间隔"],
                              ["good", "记住了", "进入下一级"],
                              ["easy", "很熟悉", "前进两级"],
                            ] as const
                          ).map(([g, label]) => (
                            <button
                              key={g}
                              disabled={busy}
                              onClick={() => void grade(g)}
                              className={`grade grade-${g}`}
                            >
                              <strong>{label}</strong>
                              <span>
                                {reviewPlan(review, g).delay < 86400000
                                  ? `${reviewPlan(review, g).delay / 60000} 分钟后`
                                  : `${reviewPlan(review, g).delay / 86400000} 天后`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <button
                        className="button primary reveal"
                        onClick={() => setRevealed(true)}
                      >
                        查看答案
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="review-icon">
                      <Check size={34} />
                    </div>
                    <h2>本轮复习完成</h2>
                    <p className="muted">
                      你的复习进度已保存。忘记的单词将在 10 分钟后再次出现。
                    </p>
                    <button
                      className="button primary"
                      onClick={() => setReviewIds(null)}
                    >
                      返回今日复习
                    </button>
                  </>
                )}
              </section>
              <ForgettingCurve />
            </>
          ) : (
            <>
              {view === "affixes" && (
                <section className="affix-panel">
                  <div className="section-heading">
                    <h2>前缀与后缀</h2>
                    <span className="muted">
                      {demo ? "示例词缀" : "点击查看同组单词"}
                    </span>
                  </div>
                  <div className="affix-grid">
                    {allAffixes.map((a) => (
                      <button
                        key={a}
                        onClick={() =>
                          setAffixFilter(affixFilter === a ? "" : a)
                        }
                        className={`affix-card ${affixFilter === a ? "chosen" : ""}`}
                      >
                        <strong>{a}</strong>
                        <span>{affixMeanings[a] ?? "自定义词缀"}</span>
                        <small>
                          {
                            displayed.filter((w) =>
                              analyses.get(w.id)?.confirmed.includes(a),
                            ).length
                          }{" "}
                          个词
                        </small>
                      </button>
                    ))}
                  </div>
                  {!allAffixes.length && (
                    <EmptyState
                      title="还没有已确认的词缀"
                      description="加入单词后会自动识别内置构词关系。未收录的词会给出建议，供你确认。"
                    />
                  )}
                  <p className="fine-print affix-note">
                    词缀用于辅助记忆，不代表完整词源分析。未知词不会仅凭字母开头自动归入确定分类。
                  </p>
                </section>
              )}
              <div className="learning-grid">
                <section className="vocab-panel">
                  <div className="section-heading">
                    <h2>
                      {affixFilter || heading}{" "}
                      <span>
                        {demo ? "示例预览" : `${filtered.length} 个词`}
                      </span>
                    </h2>
                    {currentFolder && (
                      <div>
                        <button
                          className="icon-button"
                          aria-label="重命名文件夹"
                          onClick={() => {
                            setEditingFolder(currentFolder.id);
                            setFolderName(currentFolder.name);
                            setModal("folder");
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        {book.folders.length > 1 && (
                          <button
                            className="icon-button"
                            aria-label="删除文件夹"
                            onClick={() =>
                              setConfirm({
                                title: `删除「${currentFolder.name}」？`,
                                description:
                                  "单词会保留。仅属于这个文件夹的单词将移到另一个文件夹。",
                                run: async () => {
                                  const target = book.folders.find(
                                    (f) => f.id !== folder,
                                  )!.id;
                                  if (
                                    await save({
                                      folders: book.folders.filter(
                                        (f) => f.id !== folder,
                                      ),
                                      words: book.words.map((w) => ({
                                        ...w,
                                        folderIds: w.folderIds.filter(
                                          (f) => f !== folder,
                                        ).length
                                          ? w.folderIds.filter(
                                              (f) => f !== folder,
                                            )
                                          : [target],
                                      })),
                                    })
                                  ) {
                                    setFolder("");
                                    setConfirm(null);
                                  }
                                },
                              })
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="searchbox">
                    <Search size={18} />
                    <input
                      aria-label="搜索单词"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="搜索英文、中文释义或笔记…"
                    />
                    {search && (
                      <button
                        aria-label="清除搜索"
                        onClick={() => setSearch("")}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  {!demo && filtered.length > 0 && (
                    <div className="bulk-toolbar">
                      <span className="muted">
                        当前筛选 {filtered.length} 个词
                      </span>
                      <button
                        className="text-button"
                        disabled={busy}
                        onClick={() => {
                          setBulkIds(filtered.map((w) => w.id));
                          setBulkLevels([]);
                          setModal("levels");
                        }}
                      >
                        批量添加分类
                      </button>
                    </div>
                  )}
                  {loading ? (
                    <div className="loading-row">
                      <Loader2 className="spin" />
                      正在打开你的单词本…
                    </div>
                  ) : !filtered.length ? (
                    <EmptyState
                      title={
                        view === "starred" ? "还没有收藏词汇" : "没有匹配的单词"
                      }
                      description="试试其他关键词，或添加一个新单词。"
                    />
                  ) : (
                    <div className="word-list">
                      {filtered.slice(0, limit).map((w) => (
                        <button
                          className={`word-row ${active?.id === w.id ? "selected" : ""}`}
                          key={w.id}
                          onClick={() => setSelected(w.id)}
                        >
                          <div>
                            <strong>
                              {w.text}
                              {w.starred && (
                                <Star className="inline-star" size={13} />
                              )}
                            </strong>
                            <p>{w.definition || "待补充释义"}</p>
                            <LevelTags word={w} />
                          </div>
                          <span className="folder-tag">
                            {book.folders.find((f) => f.id === w.folderIds[0])
                              ?.name ?? "示例"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="list-footer">
                    {filtered.length > limit ? (
                      <button
                        onClick={() => setLimit((l) => l + 40)}
                        className="button secondary"
                      >
                        显示更多
                      </button>
                    ) : (
                      `${filtered.length} 个${demo ? "示例" : ""}词条`
                    )}
                    {affixFilter && (
                      <button
                        className="text-button"
                        onClick={() => setAffixFilter("")}
                      >
                        清除词缀筛选
                      </button>
                    )}
                  </div>
                </section>
                <section className="detail-panel">
                  {active ? (
                    <>
                      <div className="detail-kicker">
                        <span>单词手记</span>
                        <div className="detail-actions">
                          <button
                            className={`icon-button ${active.starred ? "starred" : ""}`}
                            disabled={demo || busy}
                            aria-label={
                              active.starred ? "取消收藏" : "收藏单词"
                            }
                            onClick={() =>
                              void save({
                                ...book,
                                words: book.words.map((w) =>
                                  w.id === active.id
                                    ? { ...w, starred: !w.starred }
                                    : w,
                                ),
                              })
                            }
                          >
                            <Star size={17} />
                          </button>
                          <button
                            className="icon-button"
                            disabled={demo}
                            aria-label="编辑单词"
                            onClick={() => openEdit(active)}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="icon-button"
                            disabled={demo || busy}
                            aria-label="删除单词"
                            onClick={() =>
                              setConfirm({
                                title: `删除 ${active.text}？`,
                                description:
                                  "这会删除它的手记与复习记录。你可以先在设置中导出备份。",
                                run: async () => {
                                  if (
                                    await save({
                                      ...book,
                                      words: book.words.filter(
                                        (w) => w.id !== active.id,
                                      ),
                                    })
                                  )
                                    setConfirm(null);
                                },
                              })
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                      <h2 className="word-title">{active.text}</h2>
                      <div className="pronunciation">
                        {active.phonetic || "英语朗读"}
                        <button
                          className="icon-button"
                          aria-label="朗读单词"
                          onClick={() => speak(active.text)}
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                      <p className="definition">
                        {active.definition ||
                          "还没有释义。打开有道查词，或编辑你的学习手记。"}
                      </p>
                      <div className="affix-tags">
                        {analyses.get(active.id)?.confirmed.map((a) => (
                          <button
                            key={a}
                            onClick={() => {
                              setView("affixes");
                              setTimeout(() => setAffixFilter(a), 0);
                            }}
                          >
                            {a}
                            <span>{affixMeanings[a]}</span>
                          </button>
                        ))}
                      </div>
                      {!!analyses.get(active.id)?.suggested.length && (
                        <div className="suggestion">
                          <p>
                            可能包含：
                            {analyses.get(active.id)?.suggested.join("、")}
                            （待确认）
                          </p>
                          <button
                            className="text-button"
                            disabled={demo || busy}
                            onClick={() =>
                              void save({
                                ...book,
                                words: book.words.map((w) =>
                                  w.id === active.id
                                    ? {
                                        ...w,
                                        affixes: analyses.get(w.id)?.suggested,
                                      }
                                    : w,
                                ),
                              })
                            }
                          >
                            确认这些词缀
                          </button>
                          <button
                            className="text-button"
                            disabled={demo || busy}
                            onClick={() =>
                              void save({
                                ...book,
                                words: book.words.map((w) =>
                                  w.id === active.id
                                    ? { ...w, affixes: [] }
                                    : w,
                                ),
                              })
                            }
                          >
                            忽略建议
                          </button>
                        </div>
                      )}
                      <div className="detail-divider" />
                      <h3>考试分类</h3>
                      <LevelTags word={active} />
                      <h3>例句</h3>
                      {active.example ? (
                        <div className="example">
                          <p>{active.example}</p>
                          <span>{active.translation}</span>
                        </div>
                      ) : (
                        <p className="muted">
                          暂未添加例句，编辑词条即可补充。
                        </p>
                      )}
                      <h3>短语与搭配</h3>
                      <p className="phrase-text">
                        {active.phrases || "暂未添加，编辑词条即可补充。"}
                      </p>
                      {active.note && (
                        <>
                          <h3>我的笔记</h3>
                          <p className="note-text">{active.note}</p>
                        </>
                      )}
                      <div className="detail-divider" />
                      <LookupBox
                        state={lookup}
                        configured={youdao.configured}
                        word={active.text}
                      />
                      {demo ? (
                        <p className="fine-print">
                          示例释义与例句为本项目原创学习素材。
                        </p>
                      ) : (
                        <ReviewRecord word={active} now={clock} />
                      )}
                    </>
                  ) : (
                    <EmptyState
                      title="选择一个单词"
                      description="在这里查看释义、例句和个人笔记。"
                    />
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <Dialog
        open={modal === "levels"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="word-modal">
          <DialogHeader>
            <DialogTitle>批量添加考试分类</DialogTitle>
            <DialogDescription>
              为已选定的 {bulkIds.length}{" "}
              个词添加分类，保留已有分类和复习记录。包含当前筛选的所有分页。
            </DialogDescription>
          </DialogHeader>
          <LevelPicker value={bulkLevels} onChange={setBulkLevels} />
          <button
            className="button primary"
            disabled={busy || !bulkLevels.length || !signedIn}
            onClick={async () => {
              if (
                await save({
                  ...book,
                  words: addLevels(book.words, bulkIds, bulkLevels),
                })
              ) {
                setModal(null);
                toast.success("分类已添加");
              }
            }}
          >
            保存分类
          </button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal === "word"}
        onOpenChange={(o) => {
          if (!o && !busy) setModal(null);
        }}
      >
        <DialogContent className="word-modal">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑单词" : "添加单词"}</DialogTitle>
            <DialogDescription>
              填写词义、例句，选择文件夹与考试分类。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitWord} className="word-form">
            <label>
              英文单词或短语
              <input
                autoFocus
                required
                maxLength={100}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                placeholder="例如 serendipity"
              />
            </label>
            {draft.text && wordPattern.test(normalizeWord(draft.text)) && (
              <LookupBox
                state={draftLookup}
                configured={youdao.configured}
                word={normalizeWord(draft.text)}
              />
            )}
            <label>
              自己的中文释义
              <textarea
                maxLength={2000}
                value={draft.definition}
                onChange={(e) =>
                  setDraft({ ...draft, definition: e.target.value })
                }
                placeholder="例如 n. 苹果"
                rows={2}
              />
            </label>
            <div className="two-fields">
              <label>
                英文例句
                <textarea
                  maxLength={2000}
                  value={draft.example}
                  onChange={(e) =>
                    setDraft({ ...draft, example: e.target.value })
                  }
                  rows={2}
                  placeholder="英文例句"
                />
              </label>
              <label>
                例句中文
                <textarea
                  maxLength={2000}
                  value={draft.translation}
                  onChange={(e) =>
                    setDraft({ ...draft, translation: e.target.value })
                  }
                  rows={2}
                  placeholder="例句的中文翻译"
                />
              </label>
            </div>
            <label>
              短语与搭配
              <textarea
                maxLength={2000}
                value={draft.phrases}
                onChange={(e) =>
                  setDraft({ ...draft, phrases: e.target.value })
                }
                rows={2}
                placeholder="每行一个搭配"
              />
            </label>
            <label>
              个人笔记
              <textarea
                maxLength={4000}
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                rows={2}
                placeholder="词义辨析、来源或记忆方法"
              />
            </label>
            <div>
              <p className="field-label">所属文件夹（可多选）</p>
              <div className="folder-checks">
                {book.folders.map((f) => (
                  <label key={f.id}>
                    <Checkbox
                      checked={draft.folderIds.includes(f.id)}
                      onCheckedChange={(checked) =>
                        setDraft({
                          ...draft,
                          folderIds: checked
                            ? [...draft.folderIds, f.id]
                            : draft.folderIds.filter((x) => x !== f.id),
                        })
                      }
                    />
                    {f.name}
                  </label>
                ))}
              </div>
            </div>
            <LevelPicker
              value={draft.levels}
              onChange={(levels) => setDraft({ ...draft, levels })}
            />
            <div className="form-footer">
              <span className="muted">有道查询结果仅实时展示</span>
              <button
                className="button primary"
                disabled={busy || !draft.folderIds.length || !signedIn}
              >
                {busy ? (
                  <Loader2 className="spin" size={16} />
                ) : (
                  <Check size={16} />
                )}
                保存单词
              </button>
            </div>
            {!signedIn && (
              <a
                href="/signin-with-chatgpt?return_to=%2F"
                target="_top"
                className="youdao-link"
              >
                先登录以保存词汇
              </a>
            )}
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal === "folder"}
        onOpenChange={(o) => {
          if (!o) setModal(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFolder ? "重命名文件夹" : "新建词汇文件夹"}
            </DialogTitle>
            <DialogDescription>
              按照考试、阅读主题或使用场景收集词汇。
            </DialogDescription>
          </DialogHeader>
          <form className="word-form" onSubmit={submitFolder}>
            <label>
              文件夹名称
              <input
                required
                autoFocus
                value={folderName}
                maxLength={40}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="例如：雅思阅读"
              />
            </label>
            <button className="button primary" disabled={busy || !signedIn}>
              保存文件夹
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal === "import"}
        onOpenChange={(o) => {
          if (!o && !busy && !importBusy) setModal(null);
        }}
      >
        <DialogContent className="import-modal">
          <DialogHeader>
            <DialogTitle>把 PDF 里的词，装进单词本</DialogTitle>
            <DialogDescription>
              支持可复制文字的 PDF，最多 20 MB / 200 页。文件在浏览器内解析。
            </DialogDescription>
          </DialogHeader>
          <div className="upload-zone">
            <FileText size={28} />
            <label className="button secondary">
              {importBusy ? (
                <>
                  <Loader2 className="spin" size={16} />
                  正在提取…
                </>
              ) : (
                "选择 PDF 文件"
              )}
              <input
                type="file"
                accept="application/pdf,.pdf"
                disabled={importBusy}
                onChange={(e) => void loadPdf(e.target.files?.[0])}
              />
            </label>
            <span>{importName || "先选择文件，再确认需要的单词"}</span>
          </div>
          <details>
            <summary>也可以粘贴词汇文本</summary>
            <textarea
              className="paste-input"
              aria-label="粘贴词汇文本"
              value={importText}
              disabled={importBusy}
              maxLength={500000}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={"apple 苹果\nunforgettable 难忘的"}
            />
            <button
              className="button secondary"
              disabled={importBusy}
              onClick={() => {
                const p = [importText];
                setPages(p);
                setCandidates(extractCandidates(p, importMode));
                setImportName("粘贴的文本");
                setImportError("");
              }}
            >
              解析文本
            </button>
          </details>
          <Tabs
            value={importMode}
            onValueChange={(v) => switchImportMode(v as "entries" | "article")}
          >
            <TabsList>
              <TabsTrigger value="entries" disabled={importBusy}>
                词汇表模式
              </TabsTrigger>
              <TabsTrigger value="article" disabled={importBusy}>
                文章提词模式
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="muted">
            {importMode === "entries"
              ? "识别每行开头的单词或短语，并保留同行中文释义。"
              : "提取文章中出现的英文词，过滤常见虚词；请检查人名、缩写与断行词。"}
          </p>
          {importError && (
            <p role="alert" className="inline-error">
              {importError}
            </p>
          )}
          {pages.length > 0 && !candidates.length && (
            <p className="inline-error">
              没有识别到词条。可以切换文章提词模式，或检查 PDF 是否有文字层。
            </p>
          )}
          {candidates.length > 0 && (
            <>
              <div className="candidate-toolbar">
                <strong>
                  选中 {candidates.filter((c) => c.selected).length} /{" "}
                  {candidates.length} 个
                </strong>
                <button
                  className="text-button"
                  onClick={() =>
                    setCandidates((cs) =>
                      cs.map((c) => ({ ...c, selected: true })),
                    )
                  }
                >
                  全选
                </button>
                <button
                  className="text-button"
                  onClick={() =>
                    setCandidates((cs) =>
                      cs.map((c) => ({ ...c, selected: false })),
                    )
                  }
                >
                  清空选择
                </button>
              </div>
              <div className="candidate-list">
                {candidates.slice(0, candidateLimit).map((c) => (
                  <label className="candidate" key={c.text}>
                    <Checkbox
                      checked={c.selected}
                      onCheckedChange={(v) =>
                        setCandidates((cs) =>
                          cs.map((x) =>
                            x.text === c.text ? { ...x, selected: !!v } : x,
                          ),
                        )
                      }
                    />
                    <div>
                      <strong>{c.text}</strong>
                      <p>{c.definition || c.sourceLine}</p>
                      <small>
                        第 {c.page} 页 · 出现 {c.count} 次{" "}
                        {book.words.some(
                          (w) => normalizeWord(w.text) === c.text,
                        )
                          ? "· 已有，将加入文件夹"
                          : ""}
                      </small>
                    </div>
                  </label>
                ))}
                {candidates.length > candidateLimit && (
                  <button
                    className="button secondary"
                    onClick={() => setCandidateLimit((n) => n + 100)}
                  >
                    显示更多候选
                  </button>
                )}
              </div>
            </>
          )}
          <div className="import-target">
            <span className="field-label">导入到</span>
            <FolderSelect
              value={importFolder}
              onChange={setImportFolder}
              book={book}
            />
          </div>
          <LevelPicker
            value={importLevels}
            onChange={setImportLevels}
            label="为所选词汇添加考试分类（可选）"
          />
          <p className="fine-print">
            分类依据你使用的词表，由你选择；已有词会合并分类。这些标签不代表官方完整考试词库。
          </p>
          <button
            className="button primary"
            disabled={
              busy ||
              importBusy ||
              !candidates.some((c) => c.selected) ||
              !signedIn
            }
            onClick={() => void importWords()}
          >
            {busy ? "正在保存…" : "确认导入所选词汇"}
          </button>
          {!signedIn && (
            <a href="/signin-with-chatgpt?return_to=%2F" target="_top">
              请先登录以保存导入结果
            </a>
          )}
        </DialogContent>
      </Dialog>
      <Sheet open={settings} onOpenChange={setSettings}>
        <SheetContent className="settings-sheet">
          <SheetHeader>
            <SheetTitle>设置与数据</SheetTitle>
            <SheetDescription>备份词库、恢复数据与查询设置。</SheetDescription>
          </SheetHeader>
          <div className="settings-body">
            <h3>备份与迁移</h3>
            <p>
              导出全部词汇、文件夹、手记和复习进度。有道实时查询结果不会包含在备份中。
            </p>
            <button
              className="button secondary"
              onClick={() =>
                download(
                  "personal-wordbook-backup.json",
                  JSON.stringify(
                    {
                      format: "personal-wordbook",
                      schemaVersion: 2,
                      exportedAt: new Date().toISOString(),
                      book,
                    },
                    null,
                    2,
                  ),
                  "application/json",
                )
              }
            >
              <Download size={17} />
              导出 JSON 备份
            </button>
            <button
              className="button secondary"
              onClick={() => {
                const cell = (v: string) =>
                  '"' +
                  (/^[=+@\-\t\r]/.test(v) ? "'" : "") +
                  v.replace(/"/g, '""') +
                  '"';
                const lines = [
                  [
                    "word",
                    "definition",
                    "example",
                    "translation",
                    "phrases",
                    "note",
                    "folders",
                    "examLevels",
                    "lastReviewedAt",
                    "nextReviewAt",
                    "reviewCount",
                  ],
                  ...book.words.map((w) => [
                    w.text,
                    w.definition,
                    w.example,
                    w.translation,
                    w.phrases,
                    w.note,
                    w.folderIds
                      .map(
                        (id) =>
                          book.folders.find((f) => f.id === id)?.name ?? "",
                      )
                      .join(" / "),
                    w.levels.map((level) => levelLabels[level]).join(" / "),
                    w.lastReviewedAt !== null
                      ? new Date(w.lastReviewedAt).toISOString()
                      : "",
                    new Date(w.dueAt).toISOString(),
                    String(w.reviews),
                  ]),
                ];
                download(
                  "personal-wordbook.csv",
                  "\ufeff" +
                    lines.map((row) => row.map(cell).join(",")).join("\r\n"),
                  "text/csv;charset=utf-8",
                );
              }}
            >
              <Download size={17} />
              导出 CSV 词表
            </button>
            <label className="button secondary upload-button">
              <Upload size={17} />
              合并 JSON 备份
              <input
                type="file"
                accept="application/json,.json"
                disabled={busy || !signedIn}
                onChange={(e) => {
                  void restoreBackup(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <p className="fine-print">
              同名单词仅合并文件夹和考试分类，保留当前笔记与复习记录；备份中的较新复习进度也不会覆盖当前记录。新词完整导入。
            </p>
            <h3>有道查词</h3>
            <div className="connection-status">
              {youdao.configured ? (
                <>
                  <Check size={16} /> 已配置
                  {youdao.mode === "translation" ? "文本翻译" : "词典"}接口
                </>
              ) : (
                "尚未配置官方接口"
              )}
            </div>
            <p>
              直接打开有道词典始终可用。自动查释义需要部署者设置有道应用密钥；完整例句与短语需要开通有道词典服务。
            </p>
            <p>
              查词时会把当前英文词发送至有道。词典结果仅实时展示，不保存到词库或导出文件。
            </p>
            <a
              className="youdao-link"
              href="https://ai.youdao.com/DOCSIRMA/html/dictionary/api/ydcd/index.html"
              target="_blank"
              rel="noreferrer"
            >
              有道官方接入说明
              <ArrowUpRight size={15} />
            </a>
            <h3>安装到手机</h3>
            <p>
              在手机浏览器打开本应用：iPhone 使用 Safari 的「分享 →
              添加到主屏幕」；Android
              使用浏览器菜单中的「安装应用」或「添加到主屏幕」。词库与查词需要联网。
            </p>
            <h3>个性单词本</h3>
            <p>开源个人词汇管理工具 · MIT License</p>
            <a
              className="youdao-link"
              href="https://github.com/WuHaoran-spec/personal-wordbook"
              target="_blank"
              rel="noreferrer"
            >
              GitHub 源代码
              <ArrowUpRight size={15} />
            </a>
            {signedIn && (
              <a
                className="text-button logout-link"
                href="/signout-with-chatgpt?return_to=%2F"
                target="_top"
              >
                退出登录
              </a>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <AlertDialog
        open={!!confirm}
        onOpenChange={(o) => {
          if (!o && !busy) setConfirm(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>取消</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                void confirm?.run();
              }}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
function youdaoUrl(word: string) {
  return `https://dict.youdao.com/result?word=${encodeURIComponent(word)}&lang=en`;
}
function LookupBox({
  state,
  configured,
  word,
}: {
  state: LookupState | null;
  configured: boolean;
  word: string;
}) {
  return (
    <div className="lookup-box">
      {state?.loading ? (
        <p className="lookup-status">
          <Loader2 className="spin" size={15} />
          正在向有道查词…
        </p>
      ) : state?.error ? (
        <p className="lookup-status">{state.error}</p>
      ) : state?.data ? (
        <div className="live-lookup">
          <strong>
            有道{state.data.provider === "translation" ? "翻译" : "词典"} ·
            实时结果
          </strong>
          {state.data.phonetic && <p>/{state.data.phonetic}/</p>}
          {state.data.definitions.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
          {state.data.examples.map((e, i) => (
            <div key={i} className="example">
              <p>{e.sentence}</p>
              <span>{e.translation}</span>
            </div>
          ))}
          {state.data.phrases.map((p, i) => (
            <p key={i}>
              {p.phrase} · {p.meaning}
            </p>
          ))}
          {!state.data.definitions.length && (
            <p>接口未返回可展示释义，请打开有道词典。</p>
          )}
          {(!state.data.examples.length || !state.data.phrases.length) && (
            <p className="fine-print">
              此次接口没有返回完整例句或短语，可到有道词典继续查看。
            </p>
          )}
        </div>
      ) : !configured ? (
        <p className="lookup-status">自动查询待配置 · 可直接打开有道词典</p>
      ) : null}
      <a
        className="youdao-link"
        href={youdaoUrl(word)}
        target="_blank"
        rel="noreferrer"
      >
        有道查词
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
