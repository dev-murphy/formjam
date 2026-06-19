<script lang="ts" setup>
import { ref } from "vue";
import type { TextPropType, TextEmitType } from "@/types/inputs";

import { useField } from "vee-validate";

import IconEyeClose from "@/components/icons/input/EyeClose.vue";
import IconEyeOpen from "@/components/icons/input/EyeOpen.vue";
import IconSearch from "@/components/icons/input/Search.vue";
import IconAlert from "@/components/icons/misc/Alert.vue";

const props = withDefaults(defineProps<TextPropType>(), {
  placeholder: "",
  isOptional: false,
  isSearchable: false,
  modelValue: "",
  min: "3",
  max: "255",
  dataCy: "",
});

const { value, errorMessage } = useField(() => {
  return props.name || "";
});

defineEmits<TextEmitType>();

const showPassword = ref(false);
function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div class="w-[90%] max-w-[450px] flex flex-col">
    <slot />
    <div class="relative">
      <input
        v-if="name"
        :id="id"
        v-model="value"
        :type="!showPassword && type === 'password' ? type : 'text'"
        :placeholder="placeholder"
        class="w-full px-4 py-3 text-black dark:bg-neutral-800 dark:border dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-400 rounded-lg outline-none"
        :class="{
          'px-4 py-3': type !== 'password',
          'pl-4 pr-14 py-3': type === 'password',
          'pl-10 pr-4 py-3': isSearchable,
        }"
        :minlength="min"
        :maxlength="max"
        :data-cy="dataCy"
      />
      <input
        v-else
        :id="id"
        :type="!showPassword && type === 'password' ? type : 'text'"
        :placeholder="placeholder"
        :value="modelValue"
        class="w-full px-4 py-3 text-black dark:bg-neutral-800 dark:border dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-400 rounded-lg outline-none"
        :class="{
          'px-4 py-3': type !== 'password',
          'pl-4 pr-14 py-3': type === 'password',
          'pl-10 pr-4 py-3': isSearchable,
        }"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        :minlength="min"
        :maxlength="max"
      />

      <IconSearch
        v-if="isSearchable"
        class="search-icon absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5"
      />

      <button
        v-if="type === 'password'"
        class="absolute top-1/2 right-2 -translate-y-1/2 bg-white dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 px-1 py-0.5 text-sm text-neutral-600 dark:text-neutral-300 rounded-md"
        @click="toggleShowPassword"
      >
        <IconEyeClose
          v-show="!showPassword && type === 'password'"
          class="eye-icon w-7 h-7"
        />
        <IconEyeOpen
          v-show="showPassword && type === 'password'"
          class="eye-icon w-7 h-7"
        />
      </button>
    </div>
    <p
      v-if="errorMessage"
      class="flex items-center gap-x-1 pt-1.5 text-[15px] text-red-500 tracking-wider"
    >
      <IconAlert class="w-6 h-6" />
      <span class="font-medium">
        {{ errorMessage }}
      </span>
    </p>
    <slot name="description" />
  </div>
</template>
