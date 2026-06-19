<script setup lang="ts">
import { onMounted } from "vue";
import { useSettingsStore } from "@/store/settings";

import AppLayout from "@/layout/index.vue";
import IconDelete from "@/components/icons/controls/Delete.vue";

import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";

const settingsStore = useSettingsStore();
onMounted(() => {
  settingsStore.checkTheme();
});
</script>

<template>
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div
        class="relative w-full max-w-[800px] bg-white dark:bg-neutral-800 pt-14 pb-6 px-6 rounded-xl"
      >
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit bg-red-500 p-4 text-white rounded-full"
        >
          <IconDelete class="w-12 h-12" />
        </div>
        <p class="mb-4 dark:text-white">{{ message.message }}</p>
        <div class="w-full flex justify-center gap-x-2">
          <button
            class="w-[150px] border-[2px] border-sky-500 p-2 text-sky-500 font-bold rounded-lg"
            data-cy="dialog_cancel_delete_btn"
            @click="rejectCallback"
          >
            Cancel
          </button>
          <button
            class="w-[150px] bg-gradient-to-b from-red-500 to-rose-600 border border-red-400 p-2 text-white rounded-lg shadow-lg shadow-rose-700/70"
            data-cy="dialog_confirm_delete_btn"
            @click="acceptCallback"
          >
            Delete Form
          </button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <Toast />
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
