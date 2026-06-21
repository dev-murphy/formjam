<script lang="ts" setup>
import type { ChartDatum } from "@/utils/responses";
import CountUp from "./CountUp.vue";

withDefaults(
  defineProps<{
    data: ChartDatum[];
    play?: boolean;
  }>(),
  { play: true },
);

const FILL = "linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)";
</script>

<template>
  <div class="flex flex-col gap-3.5">
    <div v-for="(d, i) in data" :key="d.key" class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between text-sm">
        <span class="truncate pr-2 text-neutral-700 dark:text-neutral-200">
          {{ d.label }}
        </span>
        <span
          class="shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400"
        >
          <CountUp :value="d.count" :play="play" /> · {{ d.percent }}%
        </span>
      </div>
      <div
        class="h-3 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
      >
        <div
          class="h-full rounded-full transition-[width] duration-700 ease-out"
          :style="{
            width: play ? d.percent + '%' : '0%',
            transitionDelay: i * 80 + 'ms',
            background: FILL,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
