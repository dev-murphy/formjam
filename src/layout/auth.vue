<script lang="ts" setup>
import { useSettingsStore } from "@/store/settings";

import ThemeToggle from "@/components/common/ThemeToggle.vue";
import TheFooter from "@/components/common/Footer.vue";

const settingsStore = useSettingsStore();
</script>

<template>
  <main
    class="min-h-[100dvh] bg-primary-light-100 dark:bg-primary-dark-800 text-primary-dark-800 dark:text-white flex flex-col items-center justify-center"
  >
    <div
      class="absolute top-3 right-3 flex items-center gap-x-4 sm:py-2 sm:pl-3 sm:pr-2 bg-white/70 dark:bg-black/30 sm:border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium rounded-full"
    >
      <p class="hidden sm:block pb-1 font-medium">
        <span
          :class="{
            'font-extrabold': settingsStore.currentTheme === 'light',
            'text-gray-400 font-light': settingsStore.currentTheme === 'dark',
          }"
          >Light</span
        >
        /
        <span
          :class="{
            'font-extrabold': settingsStore.currentTheme === 'dark',

            'text-gray-400 font-light': settingsStore.currentTheme === 'light',
          }"
          >Dark</span
        >
      </p>
      <ThemeToggle />
    </div>
    <slot />

    <TheFooter />
  </main>
</template>
