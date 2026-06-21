import type { QuestionType, QuestionValidation } from "@/types/pocketbase";
import type { DropdownOption } from "@/types/inputs";

// ── Registry ────────────────────────────────────────────────────────────────
// Single source of truth for every validation category, its conditions and how
// many operands each condition needs. Drives both the config dropdowns and the
// validateAnswer() runtime check.

export type ValidationCondition = {
  value: string;
  name: string;
  operands: 0 | 1 | 2;
};

export type ValidationCategoryDef = {
  name: string;
  conditions: ValidationCondition[];
};

export const VALIDATION_RULES: Record<string, ValidationCategoryDef> = {
  number: {
    name: "Number",
    conditions: [
      { value: "gt", name: "Greater than", operands: 1 },
      { value: "gte", name: "Greater than or equal to", operands: 1 },
      { value: "lt", name: "Less than", operands: 1 },
      { value: "lte", name: "Less than or equal to", operands: 1 },
      { value: "eq", name: "Equal to", operands: 1 },
      { value: "neq", name: "Not equal to", operands: 1 },
      { value: "between", name: "Between", operands: 2 },
      { value: "notBetween", name: "Not between", operands: 2 },
      { value: "isNumber", name: "Is number", operands: 0 },
      { value: "wholeNumber", name: "Whole number", operands: 0 },
    ],
  },
  text: {
    name: "Text",
    conditions: [
      { value: "contains", name: "Contains", operands: 1 },
      { value: "notContains", name: "Doesn't contain", operands: 1 },
    ],
  },
  length: {
    name: "Length",
    conditions: [
      { value: "maxLength", name: "Maximum character count", operands: 1 },
      { value: "minLength", name: "Minimum character count", operands: 1 },
    ],
  },
  regex: {
    name: "Regular Expression",
    conditions: [
      { value: "contains", name: "Contains", operands: 1 },
      { value: "notContains", name: "Doesn't contain", operands: 1 },
      { value: "matches", name: "Matches", operands: 1 },
      { value: "notMatches", name: "Doesn't match", operands: 1 },
    ],
  },
  email: {
    name: "Email",
    conditions: [{ value: "isEmail", name: "Valid email", operands: 0 }],
  },
  date: {
    name: "Date",
    conditions: [
      { value: "onOrAfter", name: "On or after", operands: 1 },
      { value: "onOrBefore", name: "On or before", operands: 1 },
      { value: "between", name: "Between", operands: 2 },
      { value: "notBetween", name: "Not between", operands: 2 },
    ],
  },
  rating: {
    name: "Rating",
    conditions: [
      { value: "min", name: "At least", operands: 1 },
      { value: "max", name: "At most", operands: 1 },
    ],
  },
  selection: {
    name: "Selection",
    conditions: [
      { value: "atLeast", name: "Select at least", operands: 1 },
      { value: "atMost", name: "Select at most", operands: 1 },
      { value: "exactly", name: "Select exactly", operands: 1 },
    ],
  },
};

// Which validation categories apply to each question type. Types absent from
// this map (single_choice, dropdown, linear_scale) have no configurable
// validation beyond the existing `required` flag.
export const TYPE_CATEGORIES: Partial<Record<QuestionType, string[]>> = {
  short_text: ["text", "length", "regex"],
  long_text: ["text", "length", "regex"],
  number: ["number"],
  email: ["email"],
  date: ["date"],
  rating: ["rating"],
  multiple_choice: ["selection"],
};

export function supportsValidation(type: QuestionType): boolean {
  return (TYPE_CATEGORIES[type]?.length ?? 0) > 0;
}

// ── Dropdown option builders ─────────────────────────────────────────────────

export function categoryOptions(type: QuestionType): DropdownOption[] {
  return (TYPE_CATEGORIES[type] ?? []).map((category) => ({
    name: VALIDATION_RULES[category]?.name ?? category,
    value: category,
  }));
}

export function conditionOptions(category: string): DropdownOption[] {
  return (VALIDATION_RULES[category]?.conditions ?? []).map((condition) => ({
    name: condition.name,
    value: condition.value,
  }));
}

export function getCondition(
  category: string,
  conditionValue: string,
): ValidationCondition | undefined {
  return VALIDATION_RULES[category]?.conditions.find(
    (condition) => condition.value === conditionValue,
  );
}

// ── Runtime validation ───────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmpty(answer: unknown): boolean {
  if (Array.isArray(answer)) return answer.length === 0;
  return answer === null || answer === undefined || answer === "";
}

function safeRegex(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
}

function checkNumber(
  answer: string,
  condition: string,
  a: number,
  b: number,
): boolean {
  const n = Number(answer);
  switch (condition) {
    case "gt":
      return n > a;
    case "gte":
      return n >= a;
    case "lt":
      return n < a;
    case "lte":
      return n <= a;
    case "eq":
      return n === a;
    case "neq":
      return n !== a;
    case "between":
      return n >= Math.min(a, b) && n <= Math.max(a, b);
    case "notBetween":
      return n < Math.min(a, b) || n > Math.max(a, b);
    case "isNumber":
      return answer.trim() !== "" && !Number.isNaN(n);
    case "wholeNumber":
      return Number.isInteger(n);
    default:
      return true;
  }
}

function checkDate(
  answer: string,
  condition: string,
  v: string,
  v2: string,
): boolean {
  const t = new Date(answer).getTime();
  const a = new Date(v).getTime();
  const b = new Date(v2).getTime();
  if (Number.isNaN(t)) return false;
  switch (condition) {
    case "onOrAfter":
      return t >= a;
    case "onOrBefore":
      return t <= a;
    case "between":
      return t >= Math.min(a, b) && t <= Math.max(a, b);
    case "notBetween":
      return t < Math.min(a, b) || t > Math.max(a, b);
    default:
      return true;
  }
}

/**
 * Validate a single answer against a question's validation rule.
 * Returns null when valid (or when there's nothing to check), otherwise the
 * error message to display. Empty answers always pass here — emptiness is the
 * `required` flag's responsibility.
 */
export function validateAnswer(
  answer: string | string[],
  validation: QuestionValidation | null | undefined,
): string | null {
  if (!validation?.enabled) return null;
  if (isEmpty(answer)) return null;

  const { category, condition, value, value2 = "", errorMessage } = validation;
  let valid = true;

  switch (category) {
    case "number": {
      valid = checkNumber(
        String(answer),
        condition,
        Number(value),
        Number(value2),
      );
      break;
    }
    case "length": {
      const len = String(answer).length;
      const n = Number(value);
      valid = condition === "maxLength" ? len <= n : len >= n;
      break;
    }
    case "text": {
      const has = String(answer).includes(value);
      valid = condition === "notContains" ? !has : has;
      break;
    }
    case "email": {
      valid = EMAIL_RE.test(String(answer));
      break;
    }
    case "date": {
      valid = checkDate(String(answer), condition, value, value2);
      break;
    }
    case "rating": {
      const n = Number(answer);
      valid = condition === "min" ? n >= Number(value) : n <= Number(value);
      break;
    }
    case "selection": {
      const count = Array.isArray(answer) ? answer.length : answer ? 1 : 0;
      const n = Number(value);
      if (condition === "atLeast") valid = count >= n;
      else if (condition === "atMost") valid = count <= n;
      else valid = count === n; // exactly
      break;
    }
    case "regex": {
      const re = safeRegex(
        condition === "matches" || condition === "notMatches"
          ? `^(?:${value})$`
          : value,
      );
      if (!re) {
        valid = true; // invalid pattern never hard-blocks the respondent
        break;
      }
      const matched = re.test(String(answer));
      valid =
        condition === "notContains" || condition === "notMatches"
          ? !matched
          : matched;
      break;
    }
    default:
      valid = true;
  }

  if (valid) return null;
  return errorMessage?.trim() || defaultMessage(validation);
}

function defaultMessage(v: QuestionValidation): string {
  const condition = getCondition(v.category, v.condition);
  const label = condition?.name ?? v.condition;
  const operand =
    condition?.operands === 2
      ? `${v.value} and ${v.value2 ?? ""}`
      : (v.value ?? "");
  return condition?.operands === 0
    ? `This answer must be a ${label.toLowerCase()}.`
    : `This answer must satisfy: ${label} ${operand}`.trim();
}
