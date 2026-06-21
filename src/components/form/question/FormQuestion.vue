<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch } from "vue";
import type { Component } from "vue";
import type {
  Question,
  QuestionChoice,
  QuestionType,
} from "@/types/pocketbase";

import XEditor from "@/components/inputs/Editor.vue";
import XDropdown from "@/components/inputs/Dropdown.vue";
import XToggle from "@/components/inputs/Toggle.vue";
import Answer from "@/components/form/question/Answer.vue";
import type { ChoiceItem } from "@/components/form/question/Answer.vue";
import QuestionValidation from "@/components/form/question/QuestionValidation.vue";
import { supportsValidation } from "@/utils/validation";

import IconCheckbox from "@/components/icons/question/Checkbox.vue";
import IconShortText from "@/components/icons/question/ShortText.vue";
import IconLongText from "@/components/icons/question/LongText.vue";
import IconSelect from "@/components/icons/question/Select.vue";
import IconDropdown from "@/components/icons/question/Dropdown.vue";
import IconLinearScale from "@/components/icons/question/LinearScale.vue";
import IconNumber from "@/components/icons/question/Number.vue";
import IconEmail from "@/components/icons/question/Email.vue";
import IconDate from "@/components/icons/question/Date.vue";
import IconRating from "@/components/icons/question/Rating.vue";

import IconArrowDown from "@/components/icons/controls/ArrowDown.vue";
import IconCopy from "@/components/icons/controls/Copy.vue";
import IconDelete from "@/components/icons/controls/Delete.vue";
import IconAdjustment from "@/components/icons/menu/Adjustments.vue";
import debounce from "@/utils/debouncer";

const props = withDefaults(
  defineProps<{
    question: Question;
    disableUp?: boolean;
    disableDown?: boolean;
    isSelected: boolean;
  }>(),
  { disableDown: false, disableUp: false },
);

const emits = defineEmits<{
  (e: "update:question", question: Question): void;
  (e: "delete:question", id: string): void;
  (e: "duplicate:question", question: Question): void;
  (e: "moveup:question"): void;
  (e: "movedown:question"): void;
}>();

const questionTypeOptions = shallowRef<
  { name: string; value: QuestionType; icon: Component }[]
>([
  { name: "Short Text", value: "short_text", icon: IconShortText },
  { name: "Paragraph", value: "long_text", icon: IconLongText },
  { name: "Multiple Choice", value: "single_choice", icon: IconSelect },
  { name: "Checkboxes", value: "multiple_choice", icon: IconCheckbox },
  { name: "Dropdown", value: "dropdown", icon: IconDropdown },
  { name: "Linear Scale", value: "linear_scale", icon: IconLinearScale },
  { name: "Number", value: "number", icon: IconNumber },
  { name: "Email", value: "email", icon: IconEmail },
  { name: "Date", value: "date", icon: IconDate },
  { name: "Rating", value: "rating", icon: IconRating },
]);

const currentQuestionOption = shallowRef(questionTypeOptions.value[0]);
const questionConfig = ref({ ...props.question });
const showValidation = ref(false);

// Validation config is persisted inside the question's `settings` JSON. Proxy it
// so the panel can v-model it directly while lazily creating `settings`.
const validationModel = computed({
  get: () => questionConfig.value.settings?.validation ?? null,
  set: (value) => {
    if (!questionConfig.value.settings) questionConfig.value.settings = {};
    questionConfig.value.settings.validation = value;
  },
});

function choicesToItems(choices: QuestionChoice[] | undefined): ChoiceItem[] {
  return (choices ?? []).map((c) => ({ id: c.id, label: c.label }));
}

const choiceItems = ref<ChoiceItem[]>(
  choicesToItems(props.question.expand?.question_choices),
);

// Prevent feedback loop when props sync back from PocketBase
let syncingFromProp = false;

// When PocketBase returns real IDs after a save, update choiceItems so the
// next save doesn't treat them as new choices again.
watch(
  () => props.question.expand?.question_choices,
  (incoming) => {
    if (!incoming || incoming.length === 0) return;
    // Only sync if IDs changed (e.g. new_ temp IDs replaced by PocketBase IDs)
    const incomingIds = incoming.map((c) => c.id).join(",");
    const currentIds = choiceItems.value.map((c) => c.id).join(",");
    if (incomingIds === currentIds) return;

    syncingFromProp = true;
    choiceItems.value = choicesToItems(incoming);
    nextTick(() => {
      syncingFromProp = false;
    });
  },
);

function buildPayload(): Question {
  return {
    ...questionConfig.value,
    expand: {
      question_choices: choiceItems.value.map((item, i) => ({
        id: item.id,
        label: item.label,
        order: i + 1,
        question: props.question.id,
        created: "",
        updated: "",
        collectionId: "",
        collectionName: "",
      })),
    },
  };
}

// Only watch the fields we care about — not expand — to avoid mutating
// questionConfig inside the watcher (which caused the infinite loop).
watch(
  () => ({
    label: questionConfig.value.label,
    description: questionConfig.value.description,
    type: questionConfig.value.type,
    required: questionConfig.value.required,
    settings: questionConfig.value.settings,
    order: questionConfig.value.order,
  }),
  () => {
    if (!syncingFromProp)
      debounce(() => emits("update:question", buildPayload()));
  },
  { deep: true },
);

watch(currentQuestionOption, (typeOption) => {
  questionConfig.value.type = typeOption.value;
});

watch(
  choiceItems,
  () => {
    if (!syncingFromProp)
      debounce(() => emits("update:question", buildPayload()));
  },
  { deep: true },
);

function moveQuestion(direction: "up" | "down") {
  if (
    (props.disableDown && direction === "down") ||
    (props.disableUp && direction === "up")
  )
    return;
  if (direction === "up") emits("moveup:question");
  else emits("movedown:question");
}

onMounted(() => {
  const match = questionTypeOptions.value.find(
    (opt) => opt.value === props.question.type,
  );
  if (match) currentQuestionOption.value = match;
});
</script>

<template>
  <div
    class="group flex flex-col sm:flex-row bg-neutral-100 dark:bg-neutral-700 divide-y md:divide-y-0 md:divide-x divide-neutral-300 dark:divide-neutral-500 rounded-lg"
  >
    <div class="flex-grow p-3">
      <XEditor
        type="question"
        placeholder="Question"
        v-model="questionConfig.label"
      />
      <div class="pt-1">
        <XEditor
          type="description"
          placeholder="Description"
          v-model="questionConfig.description"
        />
      </div>
      <div class="sm:pt-3">
        <input
          v-if="
            currentQuestionOption.value === 'short_text' ||
            currentQuestionOption.value === 'long_text'
          "
          type="text"
          class="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 py-2 px-4 placeholder:text-neutral-400 outline-none rounded-md"
          readonly
          :placeholder="
            currentQuestionOption.value === 'short_text'
              ? 'Short text'
              : 'Long text'
          "
        />
        <input
          v-else-if="currentQuestionOption.value === 'number'"
          type="number"
          class="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 py-2 px-4 placeholder:text-neutral-400 outline-none rounded-md"
          readonly
          placeholder="Number"
        />
        <input
          v-else-if="currentQuestionOption.value === 'email'"
          type="text"
          class="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 py-2 px-4 placeholder:text-neutral-400 outline-none rounded-md"
          readonly
          placeholder="email@example.com"
        />
        <input
          v-else-if="currentQuestionOption.value === 'date'"
          type="text"
          class="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 py-2 px-4 placeholder:text-neutral-400 outline-none rounded-md"
          readonly
          placeholder="dd/mm/yyyy"
        />
        <div
          v-else-if="currentQuestionOption.value === 'rating'"
          class="flex items-center gap-x-1 text-neutral-300 dark:text-neutral-500"
        >
          <IconRating v-for="n in 5" :key="n" class="w-7 h-7" />
        </div>
        <Answer
          v-else-if="
            currentQuestionOption.value === 'multiple_choice' ||
            currentQuestionOption.value === 'single_choice' ||
            currentQuestionOption.value === 'dropdown'
          "
          v-model="choiceItems"
          :question-type="questionConfig.type"
        />
      </div>

      <QuestionValidation
        v-if="showValidation && supportsValidation(questionConfig.type)"
        v-model="validationModel"
        :question-type="questionConfig.type"
      />
    </div>

    <div
      class="w-full sm:max-w-[220px] flex flex-col md:divide-y md:divide-neutral-300 dark:md:divide-neutral-500"
    >
      <div class="flex flex-grow flex-col gap-y-2 p-3">
        <XDropdown
          v-model="currentQuestionOption"
          :options="questionTypeOptions"
        />
        <XToggle
          label="Required"
          :id="`toggle-${question.id}`"
          v-model="questionConfig.required"
        />
        <button
          v-if="supportsValidation(currentQuestionOption.value)"
          class="flex items-center bg-sky-400 hover:bg-sky-500 p-2 text-sm rounded-md"
          @click="showValidation = !showValidation"
        >
          <IconAdjustment class="w-5 h-5 mr-2" />
          {{ showValidation ? "Hide Options" : "More Options" }}
        </button>
      </div>

      <div
        class="justify-between gap-y-2 gap-x-2 px-3 sm:pt-3 pb-3"
        :class="{ 'flex md:hidden': !isSelected, flex: isSelected }"
      >
        <button
          class="w-1/4 h-10 flex items-center justify-center bg-sky-500 disabled:bg-sky-600 text-white disabled:text-sky-900 rounded-md"
          @click="moveQuestion('up')"
          :disabled="disableUp"
        >
          <IconArrowDown class="w-6 h-6 rotate-180" />
        </button>
        <button
          class="w-1/4 h-10 flex items-center justify-center bg-sky-500 disabled:bg-sky-600 text-white disabled:text-sky-900 rounded-md"
          @click="moveQuestion('down')"
          :disabled="disableDown"
        >
          <IconArrowDown class="w-6 h-6" />
        </button>
        <button
          class="w-1/4 h-10 flex items-center justify-center bg-sky-500 disabled:bg-sky-600 text-white disabled:text-sky-800 rounded-md"
          @click="$emit('duplicate:question', questionConfig)"
        >
          <IconCopy class="w-6 h-6" />
        </button>
        <button
          class="w-1/4 h-10 flex items-center justify-center bg-sky-500 text-white rounded-md"
          @click="$emit('delete:question', questionConfig.id)"
        >
          <IconDelete class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>
