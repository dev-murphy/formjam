<script lang="ts" setup>
import { computed } from "vue";
import type { ChartDatum } from "@/utils/responses";
import CountUp from "./CountUp.vue";

const props = withDefaults(
  defineProps<{
    data: ChartDatum[];
    play?: boolean;
  }>(),
  { play: true },
);

const COLORS = [
  "#0ea5e9",
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#a855f7",
  "#ef4444",
  "#84cc16",
  "#f97316",
];

const RADIUS = 60;
const CIRC = 2 * Math.PI * RADIUS;

const total = computed(() => props.data.reduce((s, d) => s + d.count, 0));

const segments = computed(() => {
  let offset = 0;
  return props.data.map((d, i) => {
    const fraction = total.value ? d.count / total.value : 0;
    const length = fraction * CIRC;
    const seg = {
      ...d,
      color: COLORS[i % COLORS.length],
      dashArray: `${length} ${CIRC - length}`,
      dashOffset: -offset,
    };
    offset += length;
    return seg;
  });
});
</script>

<template>
  <div class="flex flex-col items-center gap-6 sm:flex-row">
    <div class="relative shrink-0">
      <svg width="160" height="160" viewBox="0 0 160 160" class="-rotate-90">
        <circle
          cx="80"
          cy="80"
          :r="RADIUS"
          fill="none"
          stroke="currentColor"
          stroke-width="18"
          class="text-neutral-200 dark:text-neutral-800"
        />
        <circle
          v-for="(s, i) in segments"
          :key="s.key"
          cx="80"
          cy="80"
          :r="RADIUS"
          fill="none"
          :stroke="s.color"
          stroke-width="18"
          :stroke-dasharray="play ? s.dashArray : `0 ${CIRC}`"
          :stroke-dashoffset="s.dashOffset"
          class="transition-[stroke-dasharray] duration-700 ease-out"
          :style="{ transitionDelay: i * 120 + 'ms' }"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-neutral-800 dark:text-white">
          <CountUp :value="total" :play="play" />
        </span>
        <span class="text-xs text-neutral-500">answers</span>
      </div>
    </div>

    <ul class="flex w-full flex-col gap-2">
      <li
        v-for="s in segments"
        :key="s.key"
        class="flex items-center gap-2 text-sm"
      >
        <span
          class="h-3 w-3 shrink-0 rounded-full"
          :style="{ backgroundColor: s.color }"
        ></span>
        <span class="truncate text-neutral-700 dark:text-neutral-200">
          {{ s.label }}
        </span>
        <span
          class="ml-auto shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400"
        >
          {{ s.count }} · {{ s.percent }}%
        </span>
      </li>
    </ul>
  </div>
</template>
