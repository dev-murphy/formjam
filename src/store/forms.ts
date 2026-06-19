import { defineStore } from "pinia";
import pb from "@/db/pocketBase";
import type { Form } from "@/types/pocketbase";
import { useQuestionStore } from "@/store/questions";
import { nanoid } from "nanoid";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export const useFormStore = defineStore("forms", {
  state: () => ({
    forms: [] as Form[],
    searchTerm: "",
    selectedForms: [] as string[],
    selectAll: false,
    saveStatus: "idle" as SaveStatus,
  }),
  getters: {
    getFilteredForms(state) {
      if (state.searchTerm === "") {
        return state.forms;
      }
      return state.forms.filter((form) =>
        form.title.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    },
    totalForms(): number {
      return this.forms.length;
    },
    totalSelectedForms(): number {
      return this.selectedForms.length;
    },
  },
  actions: {
    selectForm(id: string) {
      if (this.selectedForms.includes(id)) {
        this.selectedForms = this.selectedForms.filter(
          (formId) => formId !== id
        );
      } else {
        this.selectedForms.push(id);
      }
    },
    selectAllForms() {
      this.selectedForms = this.forms.map((form) => form.id);
    },
    isSelected(id: string) {
      return this.selectedForms.includes(id);
    },
    deleteSelectedForms() {
      this.selectedForms.forEach((id) => {
        pb.collection("forms").delete(id);
      });
      this.selectedForms = [];
      this.fetchForms();
    },
    async fetchForms() {
      this.forms = await pb
        .collection("forms")
        .getFullList({ sort: "-created" });
    },
    async createForm() {
      const questionStore = useQuestionStore();
      const form = await pb.collection("forms").create<Form>({
        title: "Untitled Form",
        description: "",
        status: "draft",
        view_mode: "list",
        starred: false,
        slug: nanoid(10),
        settings: {},
        user: pb.authStore.model?.id,
      });
      await questionStore.createQuestion(form.id);
      return form.id;
    },
    async updateForm(form: Form) {
      await pb.collection("forms").update(form.id, form);
      this.fetchForms();
    },
    async deleteForm(formId: string) {
      await pb.collection("forms").delete(formId);
      this.fetchForms();
    },

    async updateFormField(formId: string, fields: Partial<Form>) {
      this.saveStatus = "saving";
      try {
        await pb.collection("forms").update(formId, fields);
        this.saveStatus = "saved";
        setTimeout(() => {
          if (this.saveStatus === "saved") this.saveStatus = "idle";
        }, 2000);
      } catch {
        this.saveStatus = "error";
        setTimeout(() => {
          if (this.saveStatus === "error") this.saveStatus = "idle";
        }, 3000);
      }
    },
  },
});
