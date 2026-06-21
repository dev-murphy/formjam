<script lang="ts" setup>
import { useSettingsStore } from "@/store/settings";
import { useResponseStore } from "@/store/responses";
import CountUp from "@/components/form/response/charts/CountUp.vue";

const settingsStore = useSettingsStore();
const responseStore = useResponseStore();

const responseCategory = ["Summary", "Question", "Individual"];

function setSection(category: string) {
  settingsStore.formSections.responseSection = category;
}
</script>

<template>
  <div class="overflow-hidden rounded-xl">
    <div
      class="flex w-full items-center justify-between bg-neutral-100 p-6 dark:bg-neutral-900"
    >
      <h1 class="text-3xl font-semibold dark:text-white">
        <CountUp :value="responseStore.totalResponses" />
        {{ responseStore.totalResponses === 1 ? "Response" : "Responses" }}
      </h1>
    </div>
    <div
      class="relative flex border-t border-sky-200 bg-sky-100 py-3 dark:border-sky-500 dark:bg-neutral-700"
    >
      <div
        class="mx-auto flex h-full items-end text-neutral-600 dark:text-white"
      >
        <button
          v-for="category in responseCategory"
          :key="category"
          class="w-[120px] font-medium tracking-wide"
          :class="{
            'text-sky-500':
              settingsStore.formSections.responseSection === category,
          }"
          @click="setSection(category)"
        >
          {{ category }}
        </button>
        <div
          class="absolute bottom-0 flex w-[120px] justify-center transition duration-75"
          :class="{
            'translate-x-0':
              settingsStore.formSections.responseSection === 'Summary',
            'translate-x-full':
              settingsStore.formSections.responseSection === 'Question',
            'translate-x-[200%]':
              settingsStore.formSections.responseSection === 'Individual',
          }"
        >
          <div class="h-1.5 w-2/3 rounded-t-md bg-sky-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>
