<script lang="ts" setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import type { Question, ResponseAnswer } from "@/types/pocketbase";
import { useQuestionStore } from "@/store/questions";
import { useResponseStore } from "@/store/responses";

const questionStore = useQuestionStore();
const responseStore = useResponseStore();

const index = ref(0);

const current = computed(() => responseStore.responses[index.value]);
const total = computed(() => responseStore.responses.length);

const currentAnswers = computed(() => {
  const map = new Map<string, ResponseAnswer>();
  if (!current.value) return map;
  for (const a of responseStore.answersByResponse.get(current.value.id) ?? []) {
    map.set(a.question, a);
  }
  return map;
});

// Render a stored answer value into something human-readable, mapping choice
// ids back to their labels.
function formatAnswer(question: Question, answer?: ResponseAnswer): string {
  const value = answer?.value;
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value) && value.length === 0) return "—";

  const isChoice = ["single_choice", "multiple_choice", "dropdown"].includes(
    question.type,
  );

  if (isChoice) {
    const choices = question.expand?.question_choices ?? [];
    const labelFor = (id: string) =>
      choices.find((c) => c.id === id)?.label ?? id;
    const ids = Array.isArray(value) ? value : [value];
    return ids.map((id) => labelFor(String(id))).join(", ");
  }

  if (question.type === "date" && value) {
    return dayjs(String(value)).format("MMM D, YYYY");
  }

  if (question.type === "rating") {
    return "★".repeat(Number(value)) + ` (${value})`;
  }

  return String(value);
}

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
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        <span v-if="current">
          Submitted
          {{ dayjs(current.submitted_at).format("MMM D, YYYY · h:mm A") }}
        </span>
      </p>

      <div class="flex items-center gap-1">
        <button
          type="button"
          @click="prev"
          :disabled="index === 0"
          class="rounded-md border border-gray-300 px-3 py-2 text-neutral-600 enabled:hover:border-sky-400 disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-300"
        >
          ‹
        </button>
        <span class="w-16 text-center text-sm text-neutral-400">
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

    <div
      class="flex flex-col divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-neutral-800 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div
        v-for="question in questionStore.questions"
        :key="question.id"
        class="flex flex-col gap-1 p-4"
      >
        <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {{ plainLabel(question.label) }}
        </p>
        <p class="text-neutral-800 dark:text-white">
          {{ formatAnswer(question, currentAnswers.get(question.id)) }}
        </p>
      </div>
    </div>
  </div>
</template>
