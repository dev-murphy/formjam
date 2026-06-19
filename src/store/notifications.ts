import { defineStore } from "pinia";

export const useNotifStore = defineStore("notification", {
  state: () => ({
    notifications: [] as string[],
  }),
});
