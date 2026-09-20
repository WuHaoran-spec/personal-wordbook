"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  examLevels,
  levelLabels,
  gradeLabels,
  intervals,
  matchesLevel,
  type ExamLevel,
  type Word,
} from "@/lib/wordbook";

export function LevelPicker({
  value,
  onChange,
  label = "考试分类（可多选）",
}: {
  value: ExamLevel[];
  onChange: (levels: ExamLevel[]) => void;
  label?: string;
}) {
  return (
    <fieldset className="level-picker">
      <legend className="field-label">{label}</legend>
      <div className="folder-checks">
        {examLevels.map((level) => (
          <label key={level}>
            <Checkbox
              checked={value.includes(level)}
              onCheckedChange={(checked) =>
                onChange(
                  checked
                    ? [...value, level]
                    : value.filter((v) => v !== level),
                )
              }
            />
            {levelLabels[level]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LevelFilter({
  value,
  onChange,
  words,
}: {
  value: string;
  onChange: (v: string) => void;
  words: Word[];
}) {
  return (
    <section className="level-filter" aria-label="词汇分类筛选">
      <div className="level-filter-heading">
        <strong>词汇分类</strong>
        <span>按备考用途标记，可属于多个分类</span>
      </div>
      <div className="level-tabs">
        {["", ...examLevels, "unclassified"].map((level) => (
          <button
            key={level}
            aria-pressed={value === level}
            className={value === level ? "selected" : ""}
            onClick={() => onChange(level)}
          >
            {level === ""
              ? "全部"
              : level === "unclassified"
                ? "未分类"
                : levelLabels[level as ExamLevel]}
            <span>{words.filter((w) => matchesLevel(w, level)).length}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function LevelTags({ word }: { word: Word }) {
  return (
    <div className="level-tags">
      {word.levels.length ? (
        word.levels.map((level) => (
          <span key={level}>{levelLabels[level]}</span>
        ))
      ) : (
        <span className="unclassified">未分类</span>
      )}
    </div>
  );
}

export function dateTime(at: number) {
  return new Date(at).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function elapsed(at: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - at) / 60000));
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} 小时前`;
  return `${Math.floor(minutes / 1440)} 天前`;
}

export function LastReview({ word, now }: { word: Word; now: number }) {
  return (
    <span>
      上次复习：
      {word.lastReviewedAt !== null ? (
        <>
          <time dateTime={new Date(word.lastReviewedAt).toISOString()}>
            {dateTime(word.lastReviewedAt)}
          </time>{" "}
          · {elapsed(word.lastReviewedAt, now)}
        </>
      ) : word.reviews > 0 ? (
        "旧版未记录时间"
      ) : (
        "尚未复习"
      )}
    </span>
  );
}

export function ReviewRecord({ word, now }: { word: Word; now: number }) {
  return (
    <section className="review-record" aria-label="单词复习记录">
      <h3>复习记录</h3>
      <p>
        <LastReview word={word} now={now} />
      </p>
      <p>
        下次复习：
        <time dateTime={new Date(word.dueAt).toISOString()}>
          {dateTime(word.dueAt)}
        </time>
        {word.dueAt <= now && <b className="due-label">待复习</b>}
      </p>
      <p className="muted">
        累计 {word.reviews} 次 · 忘记 {word.lapses} 次 · 当前阶段 {word.stage} /
        6
      </p>
      <ol className="interval-track" aria-label="复习间隔阶段">
        {intervals.map((days, i) => (
          <li
            key={days}
            className={word.stage === i ? "current" : ""}
            aria-current={word.stage === i ? "step" : undefined}
          >
            {days ? `${days}天` : "新学"}
          </li>
        ))}
      </ol>
      {word.reviewHistory.length > 0 && (
        <details className="review-history">
          <summary>最近 {word.reviewHistory.length} 次记录</summary>
          <ol>
            {[...word.reviewHistory].reverse().map((entry, i) => (
              <li key={`${entry.at}-${i}`}>
                <div>
                  <time dateTime={new Date(entry.at).toISOString()}>
                    {dateTime(entry.at)}
                  </time>
                  <strong>{gradeLabels[entry.grade]}</strong>
                </div>
                <small>当次安排：{dateTime(entry.dueAt)}</small>
              </li>
            ))}
          </ol>
        </details>
      )}
      {word.reviews > word.reviewHistory.length && (
        <p className="fine-print">
          逐次记录从本次更新后开始保留，最多 20
          次；空间不足会精简旧明细，累计次数与上次时间不受影响。
        </p>
      )}
    </section>
  );
}

// Conceptual comparison only. These illustration constants do not estimate a person's memory.
export function ForgettingCurve() {
  const x = (day: number) => 42 + (day / 30) * 470;
  const y = (strength: number) => 139 - strength * 103;
  const baseline = Array.from({ length: 121 }, (_, i) => {
    const day = i / 4;
    return `${i ? "L" : "M"}${x(day).toFixed(1)},${y(Math.exp(-day / 3)).toFixed(1)}`;
  }).join(" ");
  const reviews = [0, 1, 4, 11, 25, 30];
  let repeated = "";
  for (let stage = 0; stage < reviews.length - 1; stage++) {
    const start = reviews[stage],
      end = reviews[stage + 1];
    for (let point = 0; point <= 24; point++) {
      const day = start + ((end - start) * point) / 24;
      repeated += `${stage === 0 && point === 0 ? "M" : "L"}${x(day).toFixed(1)},${y(Math.exp(-(day - start) / (3 + stage * 4))).toFixed(1)} `;
    }
  }
  return (
    <section className="forgetting-curve" aria-label="艾宾浩斯遗忘曲线示意">
      <div className="section-heading">
        <h3>艾宾浩斯遗忘曲线</h3>
        <span className="curve-caption">趋势示意</span>
      </div>
      <p className="muted">在遗忘前后反复回忆，逐步拉长复习间隔。</p>
      <svg
        viewBox="0 0 550 180"
        role="img"
        aria-label="示意图：不复习时记忆随时间减弱；按间隔复习后重新巩固。图中不代表个人记忆率。"
      >
        <path d="M42 26V140H520" className="curve-axis" />
        <text x="5" y="37">
          较牢
        </text>
        <text x="5" y="140">
          较弱
        </text>
        {[1, 4, 11, 25].map((day) => (
          <g key={day}>
            <path d={`M${x(day)} 34V140`} className="curve-guide" />
            <text x={x(day)} y="157" textAnchor="middle">
              {day}
            </text>
          </g>
        ))}
        <text x="42" y="157">
          0
        </text>
        <text x="520" y="176" textAnchor="end">
          学习后的天数
        </text>
        <path d={baseline} className="curve-baseline" />
        <path d={repeated} className="curve-repeated" />
        {[1, 4, 11, 25].map((day) => (
          <circle key={day} cx={x(day)} cy={y(1)} r="3" className="curve-dot" />
        ))}
      </svg>
      <div className="curve-legend">
        <span>● 间隔复习</span>
        <span>┄ 不复习</span>
      </div>
      <p className="fine-print">
        示意曲线不是原始实验数据，也不预测你的记忆率。应用按评分使用 1 / 3 / 7 /
        14 / 30 / 60 天的间隔；忘记后 10 分钟再练，有点难会缩短间隔。
      </p>
    </section>
  );
}
