<script lang="ts" setup>
import { ref } from "vue";
import type { DropdownOption } from "@/types/inputs";

import { smallerOrEqual } from "@/utils/breakpoints";

import XDropdown from "@/components/inputs/Dropdown.vue";
import IconGrid from "@/components/icons/layout/Grid.vue";
import IconList from "@/components/icons/layout/List.vue";

defineProps<{ view: string }>();
defineEmits<{ (e: "update:view", val: string): void }>();

const sortOptions = ref([
  { name: "Last Opened", value: "last_opened" },
  { name: "Title", value: "title" },
]);
const currentSortOption = ref<DropdownOption>(sortOptions.value[0]);
</script>

<template>
  <div
    class="flex"
    :class="{
      'flex-col items-center gap-y-3': smallerOrEqual,
      'flex-row items-end': !smallerOrEqual,
    }"
  >
    <p class="text-2xl dark:text-white">Recent Forms</p>

    <div
      class="flex gap-x-3"
      :class="{ 'w-full': smallerOrEqual, 'ml-auto': !smallerOrEqual }"
    >
      <div class="w-1/2">
        <p class="pb-1 text-xs uppercase tracking-widest select-none dark:text-neutral-400">Layout</p>

        <button
          class="custom-btn flex items-center justify-center px-3 py-1.5 text-sky-900 select-none cursor-pointer rounded-md"
          :class="{
            'w-full': smallerOrEqual,
            'w-[127px]': !smallerOrEqual,
          }"
          @click="$emit('update:view', view === 'Grid' ? 'List' : 'Grid')"
        >
          <IconGrid v-show="view === 'Grid'" class="w-5 h-5 mr-2" />
          <IconList v-show="view === 'List'" class="w-5 h-5 mr-2" />
          <p>{{ view }} View</p>
        </button>
      </div>

      <div
        :class="{
          'w-1/2': smallerOrEqual,
          'w-fit': !smallerOrEqual,
        }"
      >
        <p
          class="pb-1 text-xs uppercase tracking-widest select-none dark:text-neutral-400"
          :class="{
            'w-1/2': smallerOrEqual,
            'w-[139px]': !smallerOrEqual,
          }"
        >
          Sort by
        </p>
        <XDropdown v-model="currentSortOption" :options="sortOptions" />
      </div>
    </div>
  </div>
</template>
