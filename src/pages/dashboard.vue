<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import type { SanitizedFormType, FormCardEvent } from "@/types/form";
import { useFormStore } from "@/store/forms";
import { useSettingsStore } from "@/store/settings";

import FilterTab from "@/components/dashboard/FilterTab.vue";
import FormCardGrid from "@/components/form/view/FormCardGrid.vue";
import FormList from "@/components/form/view/FormList.vue";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const toast = useToast();
const formStore = useFormStore();
const settingsStore = useSettingsStore();

const isLoading = ref(false);

const sanitizedForms = computed<SanitizedFormType[]>(() => {
  if (!formStore.forms) return [];

  return formStore.getFilteredForms.map((form) => {
    // remove unused & sensitive data
    const { collectionId, collectionName, user, ...rest } = form;
    return rest;
  });
});

async function executeEvent(event: FormCardEvent) {
  if (event.name === "delete") {
    isLoading.value = true;
    await formStore.deleteForm(event.id);
    isLoading.value = false;
  } else if (event.name === "edit") {
    router.push({ name: "EditForm", params: { formId: event.id } });
  } else if (event.name === "select") {
    formStore.selectForm(event.id);
  }
}

// bulk action related functions
const hasOneSelectedForm = computed(() => {
  return formStore.selectedForms.length <= 1;
});

function triggerSelectEvent() {
  if (formStore.selectedForms.length === formStore.forms.length) {
    formStore.selectedForms = [];
  } else {
    formStore.selectAllForms();
  }
}

function triggerDeleteFormsEvent() {
  confirm.require({
    group: "headless",
    message:
      "Are you sure you want to delete " +
      (hasOneSelectedForm.value
        ? " this form?"
        : ` these ${formStore.selectedForms.length} forms?`),
    accept: () => {
      formStore.deleteSelectedForms();
      toast.add({
        severity: "success",
        summary: "Form(s) Deleted",
        detail: "Form(s) was/were successfully deleted from the database",
        life: 2000,
      });
      confirm.close();
    },
    reject: () => {
      confirm.close();
    },
  });
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await formStore.fetchForms();
    if (route.query.search) {
      formStore.searchTerm = route.query.search as string;
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="pt-7 px-5">
    <div class="container">
      <FilterTab v-model:view="settingsStore.formLayout.view" />
      <!-- bulk delete section -->
      <div
        v-if="formStore.selectedForms.length > 0"
        class="w-full sm:w-max bg-slate-100 dark:bg-neutral-900 flex flex-col sm:flex-row items-center gap-3 mt-3 p-3 border border-slate-200 dark:border-transparent rounded-xl"
      >
        <p class="text-lg ml-2">
          {{ formStore.selectedForms.length }}
          {{ hasOneSelectedForm ? "form" : "forms" }} selected
        </p>

        <div class="w-full sm:w-fit flex gap-x-3">
          <button
            class="w-full sm:w-fit custom-btn p-2 text-neutral-900 text-sm font-medium tracking-wide rounded-lg"
            @click="triggerSelectEvent"
          >
            {{
              formStore.totalSelectedForms === formStore.totalForms
                ? "Deselect"
                : "Select"
            }}
            All
          </button>

          <button
            class="w-full sm:w-fit bg-gradient-to-b from-red-500 to-rose-600 border border-red-500 pr-3 p-2 text-white text-sm font-medium tracking-wide rounded-lg shadow-lg shadow-rose-800/50 disabled:shadow-neutral-600"
            @click="triggerDeleteFormsEvent"
          >
            Delete {{ hasOneSelectedForm ? "Form" : "Forms" }}
          </button>
        </div>
      </div>

      <FormCardGrid
        v-if="settingsStore.currentView === 'Grid'"
        :forms="sanitizedForms"
        :key="formStore.searchTerm"
        :is-loading="isLoading"
        @trigger-event="executeEvent"
      />

      <FormList
        v-if="settingsStore.currentView === 'List'"
        :key="formStore.searchTerm"
        :forms="sanitizedForms"
        @trigger-event="executeEvent"
      />
    </div>
  </div>
</template>
