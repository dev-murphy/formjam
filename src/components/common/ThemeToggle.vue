<script lang="ts" setup>
import { useSettingsStore } from "@/store/settings";
import IconSun from "@/components/icons/theme/Sun.vue";
import IconMoon from "@/components/icons/theme/Moon.vue";

const settingsStore = useSettingsStore();
</script>

<template>
  <div class="flex items-center gap-x-3 select-none">
    <label
      class="relative w-[50px] h-[30px]"
      for="theme_toggle"
      data-cy="theme_toggle"
    >
      <input
        id="theme_toggle"
        type="checkbox"
        class="invisible peer"
        @change="settingsStore.changeTheme"
      />
      <div
        class="slider absolute inset-0 bg-gray-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 peer-hover:border-neutral-500 dark:peer-hover:border-neutral-600 transition duration-200 cursor-pointer rounded-full"
      >
        <p
          class="switch flex items-center justify-center"
          :class="{
            'translate-x-[20px]': settingsStore.currentTheme === 'dark',
          }"
        >
          <IconMoon
            v-if="settingsStore.currentTheme === 'dark'"
            class="w-4 h-4 text-white"
          />
          <IconSun v-else class="w-4 h-4 text-neutral-950" />
        </p>
      </div>
    </label>
  </div>
</template>

<style scoped>
@reference "@/style.css";

.slider .switch {
  @apply absolute left-[2px] bottom-[2px] h-[24px] w-[24px] bg-white dark:bg-neutral-950 transition duration-200 rounded-full;
}
/* 
input:checked + .slider .switch {
  @apply translate-x-[26px];
} */
</style>
