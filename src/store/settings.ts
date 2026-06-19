import { defineStore } from "pinia";
import { usePreferredColorScheme, useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
  state: () =>
    useStorage(
      "settings",
      {
        currentTheme: "",
        formLayout: {
          view: "Grid",
          filter: [] as string[],
        },
        formData: {
          form_id: "",
          is_submitted: false,
        },
        formSections: {
          editSection: "Questions",
          responseSection: "Summary",
        },
      },
      sessionStorage,
      { mergeDefaults: false },
    ),
  getters: {
    currentView(): string {
      return this.formLayout.view;
    },
  },
  actions: {
    // theme related functions
    checkTheme(): string {
      const systemTheme = usePreferredColorScheme();

      if (this.currentTheme === "") {
        if (systemTheme.value === "dark") {
          this.currentTheme = "dark";
        } else {
          this.currentTheme = "light";
        }
      }
      if (
        this.currentTheme === "dark" &&
        !document.documentElement.classList.contains("dark")
      ) {
        document.documentElement.classList.add("dark");
      } else if (
        this.currentTheme === "light" &&
        document.documentElement.classList.contains("dark")
      ) {
        document.documentElement.classList.remove("dark");
      }
      return this.currentTheme;
    },
    changeTheme() {
      if (this.currentTheme === "dark") {
        this.currentTheme = "light";
        document.documentElement.classList.remove("dark");
      } else {
        this.currentTheme = "dark";

        if (!document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.add("dark");
        }
      }
    },
  },
});
