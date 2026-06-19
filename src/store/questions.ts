import { defineStore } from "pinia";
import type { Question, QuestionChoice } from "@/types/pocketbase";
import pb from "@/db/pocketBase";

const CHOICE_TYPES = new Set(["single_choice", "multiple_choice", "dropdown"]);

const LEGACY_TYPE_MAP: Record<string, Question["type"]> = {
  "short-text": "short_text",
  paragraph: "long_text",
  "single-choice": "single_choice",
  checkboxes: "multiple_choice",
  "linear-scale": "linear_scale",
};

function normalizeQuestion(
  q: Question,
  fetchedChoices?: QuestionChoice[],
): Question {
  const type = (LEGACY_TYPE_MAP[q.type] ?? q.type) as Question["type"];

  // Prefer choices fetched directly from the question_choices collection.
  // Fall back to the legacy inline "answers" JSON field for un-migrated data.
  const oldAnswers = (q as any).answers as
    | { id: string; text: string }[]
    | null
    | undefined;

  const choices: QuestionChoice[] | undefined = fetchedChoices?.length
    ? fetchedChoices
    : oldAnswers?.length
      ? oldAnswers.map((a, i) => ({
          id: a.id,
          label: a.text,
          order: i + 1,
          question: q.id,
          created: "",
          updated: "",
          collectionId: "",
          collectionName: "",
        }))
      : undefined;

  return {
    ...q,
    type,
    expand: choices ? { question_choices: choices } : q.expand,
  };
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    questions: [] as Question[],
    saveStatus: "idle" as SaveStatus,
  }),

  actions: {
    _setSaved() {
      this.saveStatus = "saved";
      setTimeout(() => {
        if (this.saveStatus === "saved") this.saveStatus = "idle";
      }, 2000);
    },

    async fetchQuestions(formId: string) {
      const { items } = await pb
        .collection("questions")
        .getList<Question>(1, 100, {
          filter: `form="${formId}"`,
          sort: "order",
        });

      // Fetch choices directly rather than via a PocketBase back-relation
      // expand: the expand syntax differs across PB versions ("x(field)" pre
      // v0.22 vs "x_via_field" after), whereas a plain filtered query works
      // everywhere. Group the results by question id.
      const choicesByQuestion = new Map<string, QuestionChoice[]>();
      const choiceQuestions = items.filter((q) =>
        CHOICE_TYPES.has((LEGACY_TYPE_MAP[q.type] ?? q.type) as string),
      );

      if (choiceQuestions.length) {
        try {
          const filter = choiceQuestions
            .map((q) => `question="${q.id}"`)
            .join(" || ");
          const choices = await pb
            .collection("question_choices")
            .getFullList<QuestionChoice>({ filter, sort: "order" });

          for (const choice of choices) {
            const group = choicesByQuestion.get(choice.question) ?? [];
            group.push(choice);
            choicesByQuestion.set(choice.question, group);
          }
        } catch {
          // question_choices collection not set up yet — fall back to whatever
          // normalizeQuestion can recover (e.g. legacy inline answers).
        }
      }

      this.questions = items.map((q) =>
        normalizeQuestion(q, choicesByQuestion.get(q.id)),
      );
    },

    async createQuestion(formId: string) {
      const question = await pb.collection("questions").create<Question>({
        label: `Question ${this.questions.length + 1}`,
        description: "",
        type: "short_text",
        required: false,
        settings: {},
        form: formId,
        order: this.questions.length + 1,
      });
      await this.fetchQuestions(formId);
      return question.id;
    },

    async duplicateQuestion(question: Question) {
      const { label, description, type, required, settings, form, order } =
        question;

      const newQuestion = await pb.collection("questions").create<Question>({
        label,
        description,
        type,
        required,
        settings,
        form,
        order: order + 1,
      });

      if (CHOICE_TYPES.has(type)) {
        try {
          const choices = question.expand?.question_choices ?? [];
          for (let i = 0; i < choices.length; i++) {
            await pb.collection("question_choices").create({
              question: newQuestion.id,
              label: choices[i].label,
              order: choices[i].order,
            });
          }
        } catch {
          // question_choices collection not set up yet
        }
      }

      if (order < this.questions.length) {
        await this.correctOrder(order, "insert");
      }

      await this.fetchQuestions(form);
    },

    async shuffleQuestions(idx1: number, idx2: number) {
      await pb.collection("questions").update(this.questions[idx1].id, {
        order: this.questions[idx2].order,
      });
      await pb.collection("questions").update(this.questions[idx2].id, {
        order: this.questions[idx1].order,
      });
      await this.fetchQuestions(this.questions[idx1].form);
    },

    async updateQuestion(question: Question) {
      this.saveStatus = "saving";
      try {
        await pb.collection("questions").update(question.id, {
          label: question.label,
          description: question.description,
          type: question.type,
          required: question.required,
          settings: question.settings,
          order: question.order,
        });
      } catch {
        this.saveStatus = "error";
        setTimeout(() => {
          if (this.saveStatus === "error") this.saveStatus = "idle";
        }, 3000);
        return;
      }

      if (CHOICE_TYPES.has(question.type)) {
        try {
          await this.syncChoices(
            question.id,
            question.expand?.question_choices ?? [],
          );
        } catch {
          // question_choices collection not set up yet — choices won't persist
          // until the PocketBase schema is migrated, but the question itself saved.
        }
      }

      await this.fetchQuestions(question.form);
      this._setSaved();
    },

    async syncChoices(questionId: string, newChoices: QuestionChoice[]) {
      const existing = await pb
        .collection("question_choices")
        .getFullList({ filter: `question="${questionId}"` });

      const existingIds = new Set(existing.map((c) => c.id));
      const newIds = new Set(newChoices.map((c) => c.id));

      for (const choice of existing) {
        if (!newIds.has(choice.id)) {
          await pb.collection("question_choices").delete(choice.id);
        }
      }

      for (let i = 0; i < newChoices.length; i++) {
        const choice = newChoices[i];
        const payload = {
          question: questionId,
          label: choice.label,
          order: i + 1,
        };

        if (!existingIds.has(choice.id)) {
          await pb.collection("question_choices").create(payload);
        } else {
          await pb.collection("question_choices").update(choice.id, payload);
        }
      }
    },

    async correctOrder(order: number, operation: "insert" | "delete") {
      for (let i = order; i < this.questions.length; i++) {
        const incr = operation === "insert" ? 1 : -1;
        const curr = this.questions[i];
        await pb.collection("questions").update(curr.id, {
          order: curr.order + incr,
        });
      }
    },

    async deleteQuestion(questionId: string, formId: string) {
      const index = this.questions.findIndex((q) => q.id === questionId);
      await this.correctOrder(index + 1, "delete");
      await pb.collection("questions").delete(questionId);
      await this.fetchQuestions(formId);
    },
  },
});
