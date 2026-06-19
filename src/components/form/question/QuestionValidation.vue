<script lang="ts" setup>
import { computed } from "vue";
import type { QuestionType, QuestionValidation } from "@/types/pocketbase";
import type { DropdownOption } from "@/types/inputs";

import XDropdown from "@/components/inputs/Dropdown.vue";
import {
  categoryOptions,
  conditionOptions,
  getCondition,
} from "@/utils/validation";

const props = defineProps<{
  modelValue: QuestionValidation | null | undefined;
  questionType: QuestionType;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: QuestionValidation): void;
}>();

const categories = computed(() => categoryOptions(props.questionType));

// A normalized, always-defined view of the current rule. The first time the
// panel is used the model is null, so we fall back to the first available
// category/condition.
const config = computed<QuestionValidation>(() => {
  const fallbackCategory = categories.value[0]?.value ?? "";
  const category = props.modelValue?.category || fallbackCategory;
  const fallbackCondition = conditionOptions(category)[0]?.value ?? "";
  return {
    enabled: props.modelValue?.enabled ?? false,
    category,
    condition: props.modelValue?.condition || fallbackCondition,
    value: props.modelValue?.value ?? "",
    value2: props.modelValue?.value2 ?? "",
    errorMessage: props.modelValue?.errorMessage ?? "",
  };
});

const conditions = computed(() => conditionOptions(config.value.category));

const selectedCategory = computed<DropdownOption>(
  () =>
    categories.value.find((c) => c.value === config.value.category) ??
    categories.value[0] ?? { name: "", value: "" },
);

const selectedCondition = computed<DropdownOption>(
  () =>
    conditions.value.find((c) => c.value === config.value.condition) ??
    conditions.value[0] ?? { name: "", value: "" },
);

const operands = computed(
  () => getCondition(config.value.category, config.value.condition)?.operands ?? 0,
);

const inputType = computed(() => {
  switch (config.value.category) {
    case "number":
    case "length":
    case "rating":
    case "selection":
      return "number";
    case "date":
      return "date";
    default:
      return "text";
  }
});

function update(patch: Partial<QuestionValidation>) {
  emits("update:modelValue", { ...config.value, ...patch });
}

function onCategoryChange(option: DropdownOption) {
  // Reset the condition + operands when switching category.
  const firstCondition = conditionOptions(option.value)[0]?.value ?? "";
  update({
    category: option.value,
    condition: firstCondition,
    value: "",
    value2: "",
  });
}

function onConditionChange(option: DropdownOption) {
  update({ condition: option.value, value: "", value2: "" });
}
</script>

<template>
  <div
    class="flex flex-col gap-y-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md p-3 mt-2"
  >
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
        Response validation
      </span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          :checked="config.enabled"
          @change="update({ enabled: !config.enabled })"
        />
        <div
          class="w-9 h-5 bg-gray-200 dark:bg-neutral-600 peer-checked:bg-sky-400 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"
        ></div>
      </label>
    </div>

    <template v-if="config.enabled">
      <div>
        <label class="block text-xs text-neutral-500 mb-1">Category</label>
        <XDropdown
          :model-value="selectedCategory"
          :options="categories"
          @update:model-value="onCategoryChange"
        />
      </div>

      <div>
        <label class="block text-xs text-neutral-500 mb-1">Condition</label>
        <XDropdown
          :model-value="selectedCondition"
          :options="conditions"
          @update:model-value="onConditionChange"
        />
      </div>

      <div v-if="operands >= 1" class="flex items-center gap-x-2">
        <input
          :type="inputType"
          :value="config.value"
          @input="
            update({ value: ($event.target as HTMLInputElement).value })
          "
          :placeholder="operands === 2 ? 'Min value' : 'Value'"
          class="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 py-1.5 px-3 text-sm rounded-md outline-none"
        />
        <input
          v-if="operands === 2"
          :type="inputType"
          :value="config.value2"
          @input="
            update({ value2: ($event.target as HTMLInputElement).value })
          "
          placeholder="Max value"
          class="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 py-1.5 px-3 text-sm rounded-md outline-none"
        />
      </div>

      <div>
        <label class="block text-xs text-neutral-500 mb-1">
          Custom error message (optional)
        </label>
        <input
          type="text"
          :value="config.errorMessage"
          @input="
            update({ errorMessage: ($event.target as HTMLInputElement).value })
          "
          placeholder="Shown when the answer is invalid"
          class="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 py-1.5 px-3 text-sm rounded-md outline-none"
        />
      </div>
    </template>
  </div>
</template>
