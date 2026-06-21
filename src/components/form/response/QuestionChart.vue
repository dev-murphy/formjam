<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Question, ResponseAnswer } from "@/types/pocketbase";
import { summarizeQuestion } from "@/utils/responses";
import { useReveal } from "@/composables/useReveal";
import BarChart from "./charts/BarChart.vue";
import ColumnChart from "./charts/ColumnChart.vue";
import DonutChart from "./charts/DonutChart.vue";
import CountUp from "./charts/CountUp.vue";

const props = defineProps<{
  question: Question;
  answers: ResponseAnswer[];
  totalResponses: number;
}>();

const summary = computed(() =>
  summarizeQuestion(props.question, props.answers, props.totalResponses),
);

const root = ref<HTMLElement | null>(null);
const { visible } = useReveal(root);

const TYPE_LABEL: Record<string, string> = {
  short_text: "Short text",
  long_text: "Long text",
  single_choice: "Single choice",
  multiple_choice: "Multiple choice",
  dropdown: "Dropdown",
  linear_scale: "Linear scale",
  number: "Number",
  email: "Email",
  date: "Date",
  rating: "Rating",
};
</script>

<template>
  <div
    ref="root"
    class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-500 dark:border-neutral-700 dark:bg-neutral-900"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
  >
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3
          v-html="question.label"
          class="prose prose-sm truncate font-semibold text-neutral-800 dark:prose-invert dark:text-white"
        ></h3>
        <p class="mt-0.5 text-xs text-neutral-400">
          {{ TYPE_LABEL[question.type] ?? question.type }} ·
          <CountUp :value="summary.respondents" :play="visible" />
          of {{ totalResponses }} answered
        </p>
      </div>
      <span
        class="shrink-0 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
      >
        {{
          totalResponses
            ? Math.round((summary.respondents / totalResponses) * 100)
            : 0
        }}%
      </span>
    </div>

    <!-- No answers for this question -->
    <p
      v-if="summary.respondents === 0"
      class="py-6 text-center text-sm text-neutral-400"
    >
      No answers yet
    </p>

    <!-- Single-select distribution -->
    <DonutChart
      v-else-if="summary.kind === 'donut'"
      :data="summary.data"
      :play="visible"
    />

    <!-- Multi-select distribution -->
    <BarChart
      v-else-if="summary.kind === 'bar'"
      :data="summary.data"
      :play="visible"
    />

    <!-- Linear scale / rating -->
    <div v-else-if="summary.kind === 'scale'" class="flex flex-col gap-4">
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold text-sky-500">
          <CountUp
            :value="summary.stats?.average ?? 0"
            :play="visible"
            :decimals="1"
          />
        </span>
        <span class="text-sm text-neutral-400">
          average out of {{ summary.stats?.max }}
        </span>
      </div>
      <ColumnChart :data="summary.data" :play="visible" />
    </div>

    <!-- Number -->
    <div v-else-if="summary.kind === 'number'" class="flex flex-col gap-4">
      <div class="grid grid-cols-3 gap-3">
        <div
          class="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-800"
        >
          <p class="text-lg font-bold text-neutral-800 dark:text-white">
            <CountUp
              :value="summary.stats?.average ?? 0"
              :play="visible"
              :decimals="1"
            />
          </p>
          <p class="text-xs text-neutral-400">Average</p>
        </div>
        <div
          class="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-800"
        >
          <p class="text-lg font-bold text-neutral-800 dark:text-white">
            <CountUp :value="summary.stats?.min ?? 0" :play="visible" />
          </p>
          <p class="text-xs text-neutral-400">Min</p>
        </div>
        <div
          class="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-800"
        >
          <p class="text-lg font-bold text-neutral-800 dark:text-white">
            <CountUp :value="summary.stats?.max ?? 0" :play="visible" />
          </p>
          <p class="text-xs text-neutral-400">Max</p>
        </div>
      </div>
      <ColumnChart :data="summary.data" :play="visible" />
    </div>

    <!-- Date -->
    <ColumnChart
      v-else-if="summary.kind === 'date'"
      :data="summary.data"
      :play="visible"
    />

    <!-- Text / email — list answers -->
    <ul
      v-else-if="summary.kind === 'text'"
      class="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1"
    >
      <li
        v-for="(value, i) in summary.values"
        :key="i"
        class="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
      >
        {{ value }}
      </li>
    </ul>

    <p v-else class="py-6 text-center text-sm text-neutral-400">
      No data to chart
    </p>
  </div>
</template>
