<script lang="ts" setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import { setupParagraphInputs } from "@/utils/form";
import { preventNonNumericInput } from "@/utils/common";
import { validateAnswer, isEmpty } from "@/utils/validation";
import type { AnswerValue } from "@/types/form";

import { useFormStore } from "@/store/forms";
import { useQuestionStore } from "@/store/questions";
import IconLongText from "@/components/icons/question/LongText.vue";
import IconArrowDown from "@/components/icons/controls/ArrowDown.vue";
import IconAlert from "@/components/icons/misc/Alert.vue";

import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";

const route = useRoute();
const router = useRouter();
const formStore = useFormStore();
const questionStore = useQuestionStore();

const formTitle = ref("");
// keyed by question.id, no PocketBase persistence (preview only)
const localAnswers = ref<Record<string, AnswerValue>>({});
// validation errors keyed by question.id
const errors = ref<Record<string, string>>({});
// becomes true after the first submit attempt; gates "required" errors so empty
// required fields don't light up red before the respondent has tried to submit.
const submitted = ref(false);

const title = computed(() => {
  const elem = document.createElement("h1");
  elem.innerHTML = formTitle.value;
  return elem.innerText
    ? elem.innerText + " | FormJAM"
    : "Untitled Form | FormJAM";
});
useTitle(title);

function getDefaultValue(type: string): AnswerValue {
  return type === "multiple_choice" ? [] : "";
}

function clearForm() {
  for (const question of questionStore.questions) {
    localAnswers.value[question.id] = getDefaultValue(question.type);
  }
  errors.value = {};
  submitted.value = false;
}

function validateForm(): boolean {
  const next: Record<string, string> = {};
  for (const question of questionStore.questions) {
    const answer = localAnswers.value[question.id] ?? "";

    // Required fields must be answered before the form can be submitted.
    if (submitted.value && question.required && isEmpty(answer)) {
      next[question.id] = "This field is required.";
      continue;
    }

    const validation = question.settings?.validation;
    if (!validation?.enabled) continue;
    const error = validateAnswer(answer, validation);
    if (error) next[question.id] = error;
  }
  errors.value = next;
  return Object.keys(next).length === 0;
}

function submit() {
  submitted.value = true;
  if (!validateForm()) return;
  router.push(`/form/${route.params.formId}/success`);
}

// Re-validate live as the respondent types into / selects answers so errors
// surface (and clear) immediately, not only on submit.
watch(localAnswers, () => validateForm(), { deep: true });

onMounted(async () => {
  const formId = route.params.formId as string;

  if (formStore.forms.length === 0) {
    await formStore.fetchForms();
  }

  formTitle.value =
    formStore.forms.find((form) => form.id === formId)?.title || "";

  await questionStore.fetchQuestions(formId);

  const paragraphInputs: string[] = [];

  for (const question of questionStore.questions) {
    if (question.type === "long_text") paragraphInputs.push(question.id);
    localAnswers.value[question.id] = getDefaultValue(question.type);
  }

  setupParagraphInputs(paragraphInputs);
});
</script>

<template>
  <div class="px-5 py-6">
    <form class="w-full max-w-[1000px] flex flex-col gap-3 mx-auto">
      <div
        class="bg-sky-200/50 dark:bg-neutral-900 flex items-center justify-center gap-x-2 py-3 text-sky-500 rounded-md"
      >
        <IconAlert class="w-6 h-6" />
        <p class="font-medium">
          <b>Please Note:</b> Submissions on the preview page are not saved.
        </p>
      </div>

      <div class="flex gap-x-4 pb-2">
        <RouterLink
          :to="`/form/${route.params.formId}/edit`"
          class="w-fit custom-btn flex items-center px-1 text-white font-medium rounded-lg"
        >
          <IconArrowDown class="w-8 h-8 rotate-90" />
        </RouterLink>
        <h1
          v-html="formTitle"
          class="prose prose-2xl dark:text-white text-center"
        ></h1>
      </div>

      <div
        v-for="question in questionStore.questions"
        :key="question.id"
        class="w-full dark:bg-neutral-700 flex flex-col border p-4 mx-auto shadow-md rounded-lg"
        :class="
          errors[question.id]
            ? 'border-red-400'
            : 'border-gray-300 dark:border-transparent'
        "
      >
        <h2
          v-html="
            question.label +
            `${question.required ? '<span class=\'text-red-500 select-none\'> *</span>' : ''}`
          "
          class="flex gap-1 text-xl prose prose-p:my-0 dark:text-white"
          :class="{ 'pb-3': !question.description }"
        ></h2>
        <p
          v-if="question.description"
          v-html="question.description"
          class="question-description prose prose-p:my-0.5 prose-li:my-0.5 text-neutral-600 dark:text-neutral-500 pb-3 text-sm"
        ></p>

        <div class="flex-grow">
          <div
            v-if="question.type === 'short_text'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">T</p>
            <input
              type="text"
              v-model="localAnswers[question.id]"
              placeholder="Enter your answer here"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-else-if="question.type === 'long_text'"
            class="flex items-start gap-x-3"
          >
            <IconLongText class="w-6 h-6 mt-2.5 dark:text-sky-400" />
            <textarea
              :id="`textarea-${question.id}`"
              placeholder="Enter your answer here"
              v-model="localAnswers[question.id]"
              data-lpignore="true"
              class="w-full h-8 bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white resize-none outline-none"
            />
          </div>

          <div
            v-else-if="question.type === 'number'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">#</p>
            <input
              type="number"
              v-model="localAnswers[question.id]"
              @input="delete errors[question.id]"
              @keydown="preventNonNumericInput"
              placeholder="Enter a number"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-else-if="question.type === 'email'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">@</p>
            <input
              type="email"
              v-model="localAnswers[question.id]"
              @input="delete errors[question.id]"
              placeholder="email@example.com"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-else-if="question.type === 'date'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">D</p>
            <input
              type="date"
              v-model="localAnswers[question.id]"
              @input="delete errors[question.id]"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:text-white outline-none"
            />
          </div>

          <div
            v-else-if="question.type === 'rating'"
            class="flex items-center gap-1"
          >
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="
                localAnswers[question.id] = String(n);
                delete errors[question.id];
              "
              class="text-3xl leading-none transition-colors"
              :class="
                n <= Number(localAnswers[question.id])
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              "
              :aria-label="`Rate ${n}`"
            >
              ★
            </button>
          </div>

          <template
            v-else-if="
              question.type === 'single_choice' ||
              question.type === 'multiple_choice'
            "
          >
            <div
              v-for="choice in question.expand?.question_choices ?? []"
              :key="choice.id"
              class="flex items-center pb-1.5 gap-2"
            >
              <Checkbox
                v-if="question.type === 'multiple_choice'"
                :aria-labelledby="choice.label"
                :name="`${question.id}`"
                :value="choice.id"
                :input-id="choice.id"
                v-model="localAnswers[question.id]"
              />
              <RadioButton
                v-if="question.type === 'single_choice'"
                :aria-labelledby="choice.label"
                :name="`${question.id}`"
                :value="choice.id"
                :input-id="choice.id"
                v-model="localAnswers[question.id]"
              />
              <label
                :for="choice.id"
                class="mb-0.5 cursor-pointer dark:text-white"
              >
                {{ choice.label }}
              </label>
            </div>
          </template>

          <div v-else-if="question.type === 'dropdown'">
            <select
              v-model="localAnswers[question.id]"
              class="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 py-2 px-3 rounded-md outline-none focus:border-sky-500 dark:text-white"
            >
              <option value="" disabled>Select an option</option>
              <option
                v-for="choice in question.expand?.question_choices ?? []"
                :key="choice.id"
                :value="choice.id"
              >
                {{ choice.label }}
              </option>
            </select>
          </div>

          <div
            v-else-if="question.type === 'linear_scale'"
            class="flex gap-x-2 flex-wrap"
          >
            <label
              v-for="n in 10"
              :key="n"
              class="flex flex-col items-center gap-y-1 cursor-pointer"
            >
              <input
                type="radio"
                :name="`${question.id}`"
                :value="String(n)"
                v-model="localAnswers[question.id]"
                class="cursor-pointer accent-sky-500"
              />
              <span class="text-sm dark:text-white">{{ n }}</span>
            </label>
          </div>
        </div>

        <p v-if="errors[question.id]" class="mt-2 text-sm text-red-500">
          {{ errors[question.id] }}
        </p>
      </div>

      <div class="flex justify-between">
        <button
          @click.prevent="submit"
          class="custom-btn py-2 px-5 font-medium rounded-lg"
        >
          Submit Form
        </button>

        <button
          role="button"
          class="hover:bg-sky-50 border border-transparent active:border-sky-400 py-2 px-5 text-sky-500 font-medium rounded-md"
          @click.prevent="clearForm"
        >
          Clear Form
        </button>
      </div>
    </form>
  </div>
</template>

<style>
.question-description > p,
.question-description ol li p,
.question-description ul li p {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
