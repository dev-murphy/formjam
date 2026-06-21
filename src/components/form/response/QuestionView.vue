<script lang="ts" setup>
import { ref, computed } from "vue";
import { useQuestionStore } from "@/store/questions";
import { useResponseStore } from "@/store/responses";
import QuestionChart from "./QuestionChart.vue";

const questionStore = useQuestionStore();
const responseStore = useResponseStore();

const index = ref(0);

const current = computed(() => questionStore.questions[index.value]);
const total = computed(() => questionStore.questions.length);

// Plain-text question label for the <select>, which can't render HTML.
function plainLabel(html: string): string {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent?.trim() || "Untitled question";
}

function prev() {
  if (index.value > 0) index.value--;
}
function next() {
  if (index.value < total.value - 1) index.value++;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <select
        v-model="index"
        class="flex-grow rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-sky-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
      >
        <option
          v-for="(question, i) in questionStore.questions"
          :key="question.id"
          :value="i"
        >
          {{ i + 1 }}. {{ plainLabel(question.label) }}
        </option>
      </select>

      <div class="flex items-center gap-1">
        <button
          type="button"
          @click="prev"
          :disabled="index === 0"
          class="rounded-md border border-gray-300 px-3 py-2 text-neutral-600 enabled:hover:border-sky-400 disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-300"
        >
          ‹
        </button>
        <span class="w-14 text-center text-sm text-neutral-400">
          {{ index + 1 }} / {{ total }}
        </span>
        <button
          type="button"
          @click="next"
          :disabled="index >= total - 1"
          class="rounded-md border border-gray-300 px-3 py-2 text-neutral-600 enabled:hover:border-sky-400 disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-300"
        >
          ›
        </button>
      </div>
    </div>

    <QuestionChart
      v-if="current"
      :key="current.id"
      :question="current"
      :answers="responseStore.answersByQuestion.get(current.id) ?? []"
      :total-responses="responseStore.totalResponses"
    />
  </div>
</template>
