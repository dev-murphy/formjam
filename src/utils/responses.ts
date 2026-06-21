import type { Question, ResponseAnswer } from "@/types/pocketbase";

export interface ChartDatum {
  key: string;
  label: string;
  count: number;
  percent: number; // 0-100, relative to the number of respondents who answered
}

export type ChartKind =
  | "donut" // single-select distribution (parts of a whole)
  | "bar" // multi-select distribution (horizontal bars)
  | "scale" // linear_scale / rating distribution (columns) + average
  | "number" // numeric histogram + min/avg/max
  | "text" // raw answer list (short/long text, email)
  | "date" // per-day distribution + raw list
  | "empty"; // nothing chartable yet

export interface QuestionSummary {
  kind: ChartKind;
  data: ChartDatum[];
  values: string[]; // raw answers for text/date lists
  respondents: number; // submissions that answered this question
  totalResponses: number; // total submissions for the form
  stats?: {
    average?: number;
    min?: number;
    max?: number;
  };
}

function isEmpty(value: ResponseAnswer["value"]): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

// Build a small distribution for numeric answers: one bar per distinct value
// when there are only a few, otherwise fixed-width histogram bins.
function histogram(nums: number[], min: number, max: number): ChartDatum[] {
  const denom = nums.length || 1;
  const distinct = new Set(nums);

  if (distinct.size <= 8) {
    const counts = new Map<number, number>();
    for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([value, count]) => ({
        key: String(value),
        label: fmt(value),
        count,
        percent: Math.round((count / denom) * 100),
      }));
  }

  const bins = 8;
  const span = max - min || 1;
  const size = span / bins;
  const counts = new Array(bins).fill(0);

  for (const n of nums) {
    let idx = Math.floor((n - min) / size);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  }

  return counts.map((count, i) => {
    const lo = min + i * size;
    const hi = lo + size;
    return {
      key: String(i),
      label: `${fmt(lo)}–${fmt(hi)}`,
      count,
      percent: Math.round((count / denom) * 100),
    };
  });
}

/**
 * Aggregate every answer for a single question into chart-ready data. The shape
 * returned depends on the question type — see {@link ChartKind}.
 */
export function summarizeQuestion(
  question: Question,
  answers: ResponseAnswer[],
  totalResponses: number,
): QuestionSummary {
  const nonEmpty = answers.filter((a) => !isEmpty(a.value));
  const respondents = nonEmpty.length;
  const base = {
    data: [] as ChartDatum[],
    values: [] as string[],
    respondents,
    totalResponses,
  };

  switch (question.type) {
    case "single_choice":
    case "multiple_choice":
    case "dropdown": {
      const choices = question.expand?.question_choices ?? [];
      const counts = new Map<string, number>();
      for (const c of choices) counts.set(c.id, 0);

      for (const a of nonEmpty) {
        const ids = Array.isArray(a.value) ? a.value : [a.value];
        for (const raw of ids) {
          const id = String(raw);
          if (counts.has(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
        }
      }

      const denom = respondents || 1;
      const data: ChartDatum[] = choices.map((c) => {
        const count = counts.get(c.id) ?? 0;
        return {
          key: c.id,
          label: c.label,
          count,
          percent: Math.round((count / denom) * 100),
        };
      });

      return {
        ...base,
        kind: question.type === "multiple_choice" ? "bar" : "donut",
        data,
      };
    }

    case "linear_scale":
    case "rating": {
      const max = question.type === "rating" ? 5 : 10;
      const counts = new Array(max + 1).fill(0);
      let sum = 0;
      let n = 0;

      for (const a of nonEmpty) {
        const num = Number(a.value);
        if (!Number.isFinite(num)) continue;
        const v = Math.round(num);
        if (v >= 1 && v <= max) {
          counts[v]++;
          sum += v;
          n++;
        }
      }

      const denom = n || 1;
      const data: ChartDatum[] = [];
      for (let i = 1; i <= max; i++) {
        data.push({
          key: String(i),
          label: String(i),
          count: counts[i],
          percent: Math.round((counts[i] / denom) * 100),
        });
      }

      return {
        ...base,
        kind: "scale",
        data,
        stats: { average: n ? sum / n : 0, max },
      };
    }

    case "number": {
      const nums = nonEmpty.map((a) => Number(a.value)).filter(Number.isFinite);
      if (!nums.length) return { ...base, kind: "empty" };

      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const average = nums.reduce((s, n) => s + n, 0) / nums.length;

      return {
        ...base,
        kind: "number",
        data: histogram(nums, min, max),
        stats: { average, min, max },
      };
    }

    case "date": {
      const counts = new Map<string, number>();
      for (const a of nonEmpty) {
        const day = String(a.value).slice(0, 10);
        counts.set(day, (counts.get(day) ?? 0) + 1);
      }

      const denom = respondents || 1;
      const data = [...counts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([day, count]) => ({
          key: day,
          label: day,
          count,
          percent: Math.round((count / denom) * 100),
        }));

      const values = nonEmpty
        .map((a) => String(a.value).slice(0, 10))
        .sort((a, b) => a.localeCompare(b));

      return { ...base, kind: "date", data, values };
    }

    default: {
      // short_text, long_text, email
      const values = nonEmpty.map((a) => String(a.value));
      return { ...base, kind: "text", values };
    }
  }
}
