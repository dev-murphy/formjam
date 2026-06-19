<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { nanoid } from "nanoid";

import IconClose from "@/components/icons/controls/Close.vue";

export interface ChoiceItem {
  id: string;
  label: string;
}

const props = defineProps<{
  modelValue: ChoiceItem[] | null;
  questionType: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ChoiceItem[]): void;
}>();

const choices = ref<ChoiceItem[]>([]);

// Keep choices in sync with the parent when PocketBase returns real IDs.
// Without this, choices.value becomes a stale reference after the first save
// and the next addChoice/removeChoice would push stale temp IDs back up.
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal || newVal.length === 0) return;
    const newIds = newVal.map((c) => c.id).join(",");
    const currentIds = choices.value.map((c) => c.id).join(",");
    if (newIds !== currentIds) {
      choices.value = newVal;
    }
  },
);

function focusOnChoice(choiceId: string) {
  setTimeout(() => {
    document.getElementById(`choice-${choiceId}`)?.focus();
  }, 10);
}

function addChoice(index: number) {
  const newId = "new_" + nanoid();
  choices.value.splice(index + 1, 0, { id: newId, label: "option" });
  focusOnChoice(newId);
  emit("update:modelValue", choices.value);
}

function updateChoice(id: string, label: string) {
  const index = choices.value.findIndex((c) => c.id === id);
  if (index === -1) return;
  choices.value[index].label = label;
  emit("update:modelValue", choices.value);
}

function moveToChoice(index: number, increment: number) {
  const position = index + increment;
  if (position < 0 || position >= choices.value.length) return;
  focusOnChoice(choices.value[position].id);
  emit("update:modelValue", choices.value);
}

function removeChoice(id: string, label?: string) {
  if (label !== undefined && label !== "") return;
  let index = choices.value.findIndex((c) => c.id === id);
  choices.value = choices.value.filter((c) => c.id !== id);
  if (choices.value.length < 2) return;
  index = index === choices.value.length ? index - 1 : index;
  focusOnChoice(choices.value[index].id);
  emit("update:modelValue", choices.value);
}

onMounted(() => {
  if (
    props.modelValue !== null &&
    props.modelValue &&
    props.modelValue.length > 0
  ) {
    choices.value = props.modelValue;
    return;
  }
  choices.value.push({ id: "new_" + nanoid(), label: "option" });
  emit("update:modelValue", choices.value);
});
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <div
      v-for="(choice, index) in choices"
      :key="choice.id"
      class="flex items-center gap-x-4"
    >
      <div
        v-if="
          questionType === 'single_choice' || questionType === 'multiple_choice'
        "
        class="w-6 h-6 border-2 border-gray-300"
        :class="{
          'rounded-full': questionType === 'single_choice',
          'rounded-md': questionType === 'multiple_choice',
        }"
      ></div>
      <p v-else>{{ index + 1 }}.</p>

      <input
        type="text"
        name="choice"
        :id="`choice-${choice.id}`"
        :value="choice.label"
        @input="
          updateChoice(choice.id, ($event.target as HTMLInputElement).value)
        "
        @keypress.enter="addChoice(index)"
        @keydown.delete="removeChoice(choice.id, choice.label)"
        @keydown.up.prevent="moveToChoice(index, -1)"
        @keydown.down.prevent="moveToChoice(index, 1)"
        class="flex-grow bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-sky-500 outline-none py-2 text-neutral-700 dark:text-white"
      />

      <button
        class="w-8 h-8 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-black dark:text-red-500 rounded-md"
        @click="removeChoice(choice.id)"
      >
        <IconClose class="w-6 h-6" />
      </button>
    </div>
    <button
      class="w-fit hover:bg-neutral-200 dark:hover:bg-neutral-800 mt-0.5 mx-auto py-1 px-4 text-neutral-700 dark:text-neutral-300 rounded-md"
      @click="addChoice(choices.length)"
    >
      Add Option
    </button>
  </div>
</template>
