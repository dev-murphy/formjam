import type { BaseAuthStore, PocketBase, RecordService } from "pocketbase";

interface BaseCollectionType {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

export interface QuestionChoice extends BaseCollectionType {
  question: string;
  label: string;
  order: number;
}

export type QuestionType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "linear_scale"
  | "number"
  | "email"
  | "date"
  | "rating";

export interface QuestionValidation {
  enabled: boolean;
  category: string; // key into VALIDATION_RULES, e.g. "number", "text"
  condition: string; // condition key, e.g. "gt", "atLeast"
  value: string; // primary operand
  value2?: string; // upper bound for between / notBetween
  errorMessage: string; // optional custom message shown to the respondent
}

// Per-question settings blob persisted as a single JSON field on the
// `questions` collection. Validation config lives here so it stays grouped with
// future per-question options.
export interface QuestionSettings {
  validation?: QuestionValidation | null;
}

export interface Question extends BaseCollectionType {
  label: string;
  description: string;
  type: QuestionType;
  order: number;
  required: boolean;
  settings: QuestionSettings;
  form: string;
  expand?: {
    question_choices: QuestionChoice[];
  };
}

export interface Form extends BaseCollectionType {
  title: string;
  description: string;
  status: "draft" | "published" | "closed";
  view_mode: "list" | "step";
  starred: boolean;
  user: string;
  slug: string;
  settings: Record<string, unknown>;
}

export interface Response extends BaseCollectionType {
  form: string;
  respondent: string;
  is_complete: boolean;
  submitted_at: string;
}

export interface ResponseAnswer extends BaseCollectionType {
  response: string;
  question: string;
  value: string | string[] | number | null;
}

export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService;
  collection(idOrName: "forms"): RecordService<Form>;
  collection(idOrName: "questions"): RecordService<Question>;
  collection(idOrName: "question_choices"): RecordService<QuestionChoice>;
  collection(idOrName: "responses"): RecordService<Response>;
  collection(idOrName: "response_answers"): RecordService<ResponseAnswer>;
  authStore: BaseAuthStore;
}
