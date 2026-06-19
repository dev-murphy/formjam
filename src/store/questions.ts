import { defineStore } from "pinia";
import { Question } from "@/types/pocketbase";
import pb from "@/db/pocketBase";

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    questions: [] as Question[],
    currentQuestion: {
      text: "",
      description: "",
      type: "short-text",
      required: false,
      answers: [],
      form: "",
    },
  }),
  actions: {
    async fetchQuestions(formId: string) {
      const { items } = await pb
        .collection("questions")
        .getList<Question>(1, 100, {
          filter: `form="${formId}"`,
          sort: "order",
        });
      this.questions = items;
    },
    async createQuestion(formId: string) {
      const question = await pb.collection("questions").create({
        text: `Question ${this.questions.length + 1}`,
        description: "",
        type: "short-text",
        required: false,
        answers: null,
        form: formId,
        order: this.questions.length + 1,
      });
      await this.fetchQuestions(formId);
      return question.id;
    },
    async duplicateQuestion(question: Question) {
      const { text, description, type, required, answers, form, order } =
        question;

      await pb.collection("questions").create({
        text,
        description,
        type,
        required,
        answers,
        form,
        order: order + 1,
      });

      if (order - 1 < this.questions.length) {
        await this.correctOrder(order, "insert");
      }

      await this.fetchQuestions(form);
    },
    async shuffleQuestions(idx1: number, idx2: number) {
      await pb.collection("questions").update(this.questions[idx1].id, {
        ...this.questions[idx1],
        order: this.questions[idx2].order,
      });

      await pb.collection("questions").update(this.questions[idx2].id, {
        ...this.questions[idx2],
        order: this.questions[idx1].order,
      });

      await this.fetchQuestions(this.questions[idx1].form);
    },
    async updateQuestion(question: Question) {
      await pb.collection("questions").update(question.id, question);
      await this.fetchQuestions(question.form);
    },
    async correctOrder(order: number, operation: "insert" | "delete") {
      for (let i = order; i < this.questions.length; i++) {
        const incr = operation === "insert" ? 1 : -1;
        const currQuestion: Question = this.questions[i];

        await pb.collection("questions").update(this.questions[i].id, {
          ...currQuestion,
          order: currQuestion.order + incr,
        });
      }
    },
    async deleteQuestion(questionId: string, formId: string) {
      const index = this.questions.findIndex(
        (question) => question.id === questionId,
      );

      this.correctOrder(index + 1, "delete");

      await pb.collection("questions").delete(questionId);
      await this.fetchQuestions(formId);
    },
  },
});
