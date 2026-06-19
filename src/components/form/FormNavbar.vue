<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { useFormStore } from "@/store/forms";
import { useQuestionStore } from "@/store/questions";

import IconEyeOpen from "@/components/icons/input/EyeOpen.vue";
import ThemeToggle from "@/components/common/ThemeToggle.vue";

const route = useRoute();
const formStore = useFormStore();
const questionStore = useQuestionStore();

const currentSection = ref("Questions");
function setSection(section: string) {
  currentSection.value = section;
}

const saveStatus = computed(() => {
  if (formStore.saveStatus === "saving" || questionStore.saveStatus === "saving")
    return "saving";
  if (formStore.saveStatus === "error" || questionStore.saveStatus === "error")
    return "error";
  if (formStore.saveStatus === "saved" || questionStore.saveStatus === "saved")
    return "saved";
  return "idle";
});
</script>

<template>
  <header class="relative bg-neutral-100 dark:bg-neutral-800">
    <div class="container h-[66px] flex items-center justify-between mx-6 py-3">
      <RouterLink to="/" class="flex items-center gap-x-2">
        <img src="@/assets/images/logo.png" alt="logo" class="max-h-[40px]" />
        <p class="text-2xl text-neutral-700 dark:text-white">
          Form<span class="text-neutral-400 font-bold">JAM</span>
        </p>
      </RouterLink>

      <!-- Autosave indicator -->
      <div
        v-if="route.name === 'EditForm'"
        class="ml-4 flex items-center gap-x-1.5 text-sm"
      >
        <template v-if="saveStatus === 'saving'">
          <svg class="w-3.5 h-3.5 animate-spin text-neutral-400" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span class="text-neutral-400">Saving…</span>
        </template>
        <template v-else-if="saveStatus === 'saved'">
          <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-emerald-500">Saved</span>
        </template>
        <template v-else-if="saveStatus === 'error'">
          <svg class="w-3.5 h-3.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="text-red-500">Save failed</span>
        </template>
      </div>

      <ThemeToggle class="ml-auto mr-3" />
      <RouterLink
        v-if="route.name === 'EditForm'"
        :to="`/form/${route.params.formId}/preview`"
      >
        <button
          title="View Form"
          class="custom-btn flex gap-x-2 p-2 rounded-lg"
          data-cy="preview_btn"
        >
          <IconEyeOpen class="w-6 h-6 sm:mr-1" />
          <span class="hidden sm:block"> Preview </span>
        </button>
      </RouterLink>
    </div>
    <div
      v-if="route.name === 'EditForm'"
      class="flex py-3 bg-sky-100 dark:bg-neutral-700 border-y border-sky-200 dark:border-sky-500"
    >
      <div class="flex items-end h-full text-neutral-600 dark:text-white mx-auto">
        <button
          class="w-[120px] font-medium tracking-wide"
          :class="{ 'text-sky-500': currentSection === 'Questions' }"
          @click="setSection('Questions')"
        >
          Questions
        </button>
        <button
          class="w-[120px] font-medium tracking-wide"
          :class="{ 'text-sky-500': currentSection === 'Responses' }"
          @click="setSection('Responses')"
        >
          Responses
        </button>
        <div
          class="absolute bottom-0 flex justify-center w-[120px] transition duration-75"
          :class="{
            'translate-x-full': currentSection === 'Responses',
            'translate-x-0': currentSection === 'Questions',
          }"
        >
          <div class="w-2/3 h-1.5 bg-sky-500 rounded-t-md"></div>
        </div>
      </div>
    </div>
  </header>
</template>
