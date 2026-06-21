import { defineStore } from "pinia";
import pb from "@/db/pocketBase";
import type { Response, ResponseAnswer } from "@/types/pocketbase";

export const useResponseStore = defineStore("responses", {
  state: () => ({
    responses: [] as Response[],
    answers: [] as ResponseAnswer[],
    loading: false,
    loaded: false,
  }),

  getters: {
    totalResponses(): number {
      return this.responses.length;
    },

    // question.id → answers for that question
    answersByQuestion(): Map<string, ResponseAnswer[]> {
      const map = new Map<string, ResponseAnswer[]>();
      for (const answer of this.answers) {
        const group = map.get(answer.question) ?? [];
        group.push(answer);
        map.set(answer.question, group);
      }
      return map;
    },

    // response.id → answers for that submission
    answersByResponse(): Map<string, ResponseAnswer[]> {
      const map = new Map<string, ResponseAnswer[]>();
      for (const answer of this.answers) {
        const group = map.get(answer.response) ?? [];
        group.push(answer);
        map.set(answer.response, group);
      }
      return map;
    },

    lastResponseAt(): string | null {
      return this.responses[0]?.submitted_at || null;
    },
  },

  actions: {
    async fetchResponses(formId: string) {
      this.loading = true;
      try {
        // Only completed submissions count as "responses".
        this.responses = await pb
          .collection("responses")
          .getFullList<Response>({
            filter: `form="${formId}" && is_complete=true`,
            sort: "-submitted_at",
          });

        // Pull the answers via a relation filter so we don't have to enumerate
        // every response id into the query string.
        if (this.responses.length) {
          this.answers = await pb
            .collection("response_answers")
            .getFullList<ResponseAnswer>({
              filter: `response.form="${formId}" && response.is_complete=true`,
            });
        } else {
          this.answers = [];
        }
      } finally {
        this.loading = false;
        this.loaded = true;
      }
    },
  },
});
