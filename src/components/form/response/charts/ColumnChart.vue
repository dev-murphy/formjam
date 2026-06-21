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

const maxCount = computed(() => Math.max(1, ...props.data.map((d) => d.count)));

const FILL = "linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)";
</script>

<template>
  <div class="flex h-48 w-full items-end gap-2">
    <div
      v-for="(d, i) in data"
      :key="d.key"
      class="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
    >
      <span
        class="text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400"
      >
        <CountUp :value="d.count" :play="play" />
      </span>
      <div class="flex w-full justify-center">
        <div
          class="w-full max-w-[46px] rounded-t-md transition-[height] duration-700 ease-out"
          :style="{
            height: (play ? (d.count / maxCount) * 140 : 0) + 'px',
            transitionDelay: i * 60 + 'ms',
            background: FILL,
          }"
        ></div>
      </div>
      <span
        class="w-full truncate text-center text-xs text-neutral-600 dark:text-neutral-300"
        :title="d.label"
      >
        {{ d.label }}
      </span>
    </div>
  </div>
</template>
