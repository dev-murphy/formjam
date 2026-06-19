<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import type { LocalAnswer, AnswerValue } from "@/types/form";
import pb from "@/db/pocketBase";

import debounce from "@/utils/debouncer";
import { setupParagraphInputs } from "@/utils/form";
import { validateAnswer } from "@/utils/validation";

import { useFormStore } from "@/store/forms";
import { useQuestionStore } from "@/store/questions";
import { useSettingsStore } from "@/store/settings";
import IconLongText from "@/components/icons/question/LongText.vue";

import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";

const route = useRoute();
const router = useRouter();

const formStore = useFormStore();
const questionStore = useQuestionStore();
const settingsStore = useSettingsStore();

const formTitle = ref("");
const responseId = ref("");
// keyed by question.id → { recordId: response_answers.id, value }
const localAnswers = ref<Record<string, LocalAnswer>>({});
// validation errors keyed by question.id
const errors = ref<Record<string, string>>({});

const title = computed(() => {
  const elem = document.createElement("h1");
  elem.innerHTML = formTitle.value;
  return elem.innerText
    ? elem.innerText + " | FormJAM"
    : "Untitled Form | FormJAM";
});
useTitle(title);

function getDefaultValue(questionType: string): AnswerValue {
  return questionType === "multiple_choice" ? [] : "";
}

function clearForm() {
  for (const question of questionStore.questions) {
    if (localAnswers.value[question.id]) {
      localAnswers.value[question.id].value = getDefaultValue(question.type);
    }
  }
}

watch(
  localAnswers,
  () => {
    debounce(async () => {
      await Promise.all(
        Object.values(localAnswers.value).map((answer) =>
          pb.collection("response_answers").update(answer.recordId, {
            value: answer.value,
          }),
        ),
      );
    }, 1000);
  },
  { deep: true },
);

async function startNewResponse(formId: string) {
  const record = await pb.collection("responses").create({
    form: formId,
    respondent: pb.authStore.model?.id || null,
    is_complete: false,
  });

  responseId.value = record.id;
  settingsStore.formData.form_id = record.id;
  settingsStore.formData.is_submitted = false;

  const paragraphInputs: string[] = [];
  localAnswers.value = {};

  for (const question of questionStore.questions) {
    if (question.type === "long_text") paragraphInputs.push(question.id);

    const answerRecord = await pb.collection("response_answers").create({
      response: record.id,
      question: question.id,
      value: getDefaultValue(question.type),
    });

    localAnswers.value[question.id] = {
      recordId: answerRecord.id,
      value: getDefaultValue(question.type),
    };
  }

  setupParagraphInputs(paragraphInputs);
}

async function loadExistingResponse(existingResponseId: string) {
  const answerRecords = await pb
    .collection("response_answers")
    .getFullList({ filter: `response="${existingResponseId}"` });

  responseId.value = existingResponseId;
  localAnswers.value = {};

  for (const record of answerRecords) {
    localAnswers.value[record.question] = {
      recordId: record.id,
      value: record.value as AnswerValue,
    };
  }
}

function validateForm(): boolean {
  const next: Record<string, string> = {};
  for (const question of questionStore.questions) {
    const validation = question.settings?.validation;
    if (!validation?.enabled) continue;
    const answer = localAnswers.value[question.id]?.value ?? "";
    const error = validateAnswer(answer, validation);
    if (error) next[question.id] = error;
  }
  errors.value = next;
  return Object.keys(next).length === 0;
}

async function submit() {
  if (!validateForm()) return;

  settingsStore.formData.is_submitted = true;

  await pb.collection("responses").update(responseId.value, {
    is_complete: true,
    submitted_at: new Date().toISOString(),
  });

  router.push({
    path: `/form/${route.params.formId}/success`,
    query: route.query,
  });
}

onMounted(async () => {
  const formId = route.params.formId as string;

  if (formStore.forms.length === 0) {
    await formStore.fetchForms();
  }

  formTitle.value =
    formStore.forms.find((form) => form.id === formId)?.title || "";

  await questionStore.fetchQuestions(formId);

  if (settingsStore.formData.form_id && !settingsStore.formData.is_submitted) {
    try {
      await loadExistingResponse(settingsStore.formData.form_id);
      return;
    } catch (e) {
      console.error(e);
    }
  }

  await startNewResponse(formId);
});
</script>

<template>
  <div class="px-5 py-6">
    <form class="w-full max-w-[1000px] flex flex-col gap-3 mx-auto">
      <h1
        v-html="formTitle"
        class="prose prose-2xl text-center dark:text-white"
      ></h1>

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
            `${
              question.required
                ? '<span class=\'text-red-500 select-none\'> *</span>'
                : ''
            }`
          "
          class="flex gap-1 text-xl dark:text-white"
          :class="{ 'pb-3': !question.description }"
        ></h2>
        <p
          v-if="question.description"
          v-html="question.description"
          class="question-description prose prose-p:my-0.3 prose-li:my-0.5 text-gray-600 dark:text-neutral-500 pb-3 text-sm"
        ></p>

        <div v-if="localAnswers[question.id]" class="flex-grow">
          <div
            v-if="question.type === 'short_text'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">T</p>
            <input
              type="text"
              v-model="localAnswers[question.id].value"
              placeholder="Enter your answer here"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-if="question.type === 'long_text'"
            class="flex items-start gap-x-3"
          >
            <IconLongText class="w-6 h-6 mt-2.5" />
            <textarea
              :id="`textarea-${question.id}`"
              placeholder="Enter your answer here"
              v-model="localAnswers[question.id].value"
              data-lpignore="true"
              class="w-full h-8 bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white resize-none outline-none"
            />
          </div>

          <div
            v-if="question.type === 'number'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">#</p>
            <input
              type="number"
              v-model="localAnswers[question.id].value"
              @input="delete errors[question.id]"
              placeholder="Enter a number"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-if="question.type === 'email'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">@</p>
            <input
              type="email"
              v-model="localAnswers[question.id].value"
              @input="delete errors[question.id]"
              placeholder="email@example.com"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div v-if="question.type === 'date'" class="flex items-center gap-x-3">
            <p class="font-rokkitt text-[26px] dark:text-sky-400">D</p>
            <input
              type="date"
              v-model="localAnswers[question.id].value"
              @input="delete errors[question.id]"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:text-white outline-none"
            />
          </div>

          <div v-if="question.type === 'rating'" class="flex items-center gap-1">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="
                localAnswers[question.id].value = String(n);
                delete errors[question.id];
              "
              class="text-3xl leading-none transition-colors"
              :class="
                n <= Number(localAnswers[question.id].value)
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
                v-model="localAnswers[question.id].value"
              />
              <RadioButton
                v-if="question.type === 'single_choice'"
                :aria-labelledby="choice.label"
                :name="`${question.id}`"
                :value="choice.id"
                :input-id="choice.id"
                v-model="localAnswers[question.id].value"
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
              v-model="localAnswers[question.id].value"
              class="w-full bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 py-2 px-3 rounded-md outline-none focus:border-sky-500 dark:text-white"
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
                v-model="localAnswers[question.id].value"
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
