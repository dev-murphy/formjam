import { Question } from "./pocketbase";

// component types
export interface FormItemPropType {
  title: string;
  lastEdited: string;
  selectMode: boolean;
  isSelected: boolean;
  hasStar?: boolean;
}

export interface FormCardPropType extends FormItemPropType {
  description: string;
  lastEdited: string;
  createdAt: string;
}

export type FormCardEmitType = {
  (e: "deleteForm"): void;
  (e: "editForm"): void;
  (e: "selectForm"): void;
};

export type FormGridEmitType = {
  (e: "trigger-event", value: FormCardEvent): void;
};

export type ErrorMessagePropType = {
  message: string;
};

export type ErrorMessageEmitType = {
  (e: "closeErrorMessage"): void;
};

// general types
export type FormCardEvent = {
  id: string;
  name: "delete" | "rename" | "edit" | "select";
  value: string | null;
};

export type FormError = {
  code: number;
  data: {
    [key: string]: {
      code: string;
      message: string;
    };
  };
  message: string;
};

export interface SanitizedFormType {
  id: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  slug: string;
  starred: boolean;
}

export interface FormType extends SanitizedFormType {
  collectionId: string;
  collectionName: string;
  user: string;
  status: "draft" | "published" | "closed";
}

export type QuestionResponse = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: Question[];
};

export type AnswerValue = string | string[];

export interface LocalAnswer {
  recordId: string;
  value: AnswerValue;
}
