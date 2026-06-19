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

export interface Question extends BaseCollectionType {
  label: string;
  description: string;
  type:
    | "short_text"
    | "long_text"
    | "single_choice"
    | "multiple_choice"
    | "dropdown"
    | "linear_scale";
  order: number;
  required: boolean;
  settings: Record<string, unknown>;
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
