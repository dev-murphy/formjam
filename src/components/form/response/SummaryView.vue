<script lang="ts" setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { useQuestionStore } from "@/store/questions";
import { useResponseStore } from "@/store/responses";
import QuestionChart from "./QuestionChart.vue";
import CountUp from "./charts/CountUp.vue";

const questionStore = useQuestionStore();
const responseStore = useResponseStore();

const lastResponse = computed(() =>
  responseStore.lastResponseAt
    ? dayjs(responseStore.lastResponseAt).format("MMM D, YYYY")
    : "—",
);

const answeredRate = computed(() => {
  const total = responseStore.totalResponses * questionStore.questions.length;
  if (!total) return 0;
  return Math.round((responseStore.answers.length / total) * 100);
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Overview stats -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <p class="text-3xl font-bold text-sky-500">
          <CountUp :value="responseStore.totalResponses" />
        </p>
        <p class="mt-1 text-sm text-neutral-400">Responses</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <p class="text-3xl font-bold text-neutral-800 dark:text-white">
          <CountUp :value="questionStore.questions.length" />
        </p>
        <p class="mt-1 text-sm text-neutral-400">Questions</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <p class="text-3xl font-bold text-neutral-800 dark:text-white">
          <CountUp :value="answeredRate" suffix="%" />
        </p>
        <p class="mt-1 text-sm text-neutral-400">Answered</p>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <p class="text-lg font-bold text-neutral-800 dark:text-white">
          {{ lastResponse }}
        </p>
        <p class="mt-1 text-sm text-neutral-400">Last response</p>
      </div>
    </div>

    <!-- Per-question charts -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <QuestionChart
        v-for="question in questionStore.questions"
        :key="question.id"
        :question="question"
        :answers="responseStore.answersByQuestion.get(question.id) ?? []"
        :total-responses="responseStore.totalResponses"
      />
    </div>
  </div>
</template>
