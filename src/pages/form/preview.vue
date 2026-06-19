<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";
import type { Answer } from "@/types/form";
import { getDefaultAnswer, setupParagraphInputs } from "@/utils/form";

import { useFormStore } from "@/store/forms";
import { useQuestionStore } from "@/store/questions";
import IconLongText from "@/components/icons/question/LongText.vue";

// prime vue components
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";

import IconArrowDown from "@/components/icons/controls/ArrowDown.vue";
import IconAlert from "@/components/icons/misc/Alert.vue";

const route = useRoute();

const formStore = useFormStore();
const questionStore = useQuestionStore();

const formTitle = ref("");
const formData = ref<Answer[]>([]);

const title = computed(() => {
  const elem = document.createElement("h1");
  elem.innerHTML = formTitle.value;
  return elem.innerText
    ? elem.innerText + " | FormJAM"
    : "Untitled Form | FormJAM";
});
useTitle(title);

function clearForm() {
  formData.value = formData.value.map((answer) => {
    return {
      id: answer.id,
      type: answer.type,
      answer: getDefaultAnswer(answer.type),
    };
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

  let paragraphInputs: string[] = [];

  formData.value = questionStore.questions.map(({ type, id }) => {
    if (type === "paragraph") paragraphInputs.push(id);
    return { id, type, answer: getDefaultAnswer(type) };
  });

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
          <b>Please Note:</b> The submissions on the preview page will not be
          saved to the database.
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
        v-for="(question, index) in questionStore.questions"
        class="w-full dark:bg-neutral-700 flex flex-col border border-gray-300 dark:border-transparent p-4 mx-auto shadow-md rounded-lg"
      >
        <h2
          v-html="
            question.text +
            `${
              question.required
                ? '<span class=\'text-red-500 select-none\'> *</span>'
                : ''
            }`
          "
          class="flex gap-1 text-xl prose prose-p:my-0 dark:text-white"
          :class="{
            'pb-3': !question.description,
          }"
        ></h2>
        <p
          v-if="question.description"
          v-html="question.description"
          class="question-description prose prose-p:my-0.5 prose-li:my-0.5 text-neutral-600 dark:text-neutral-500 pb-3 text-sm"
        ></p>

        <div v-if="formData[index]" class="flex-grow">
          <div
            v-if="question.type === 'short-text'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px] dark:text-sky-400">T</p>
            <input
              type="text"
              v-model="formData[index].answer"
              placeholder="Enter your answer here"
              class="w-full bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-if="question.type === 'paragraph'"
            class="flex items-start gap-x-3"
          >
            <IconLongText class="w-6 h-6 mt-2.5 dark:text-sky-400" />
            <textarea
              :id="`textarea-${question.id}`"
              placeholder="Enter your answer here"
              v-model="formData[index].answer"
              data-lpignore="true"
              class="w-full h-8 bg-transparent py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 dark:placeholder:text-neutral-400 dark:text-white resize-none outline-none"
            />
          </div>

          <div
            v-else-if="
              question.type === 'single-choice' ||
              question.type === 'checkboxes'
            "
            v-for="answer in question.answers"
            :key="answer.id"
            class="flex items-center pb-1.5 gap-2"
          >
            <Checkbox
              v-if="question.type === 'checkboxes'"
              :aria-labelledby="answer.text"
              :name="`${question.id}`"
              :value="answer.id"
              :input-id="answer.id"
              v-model="formData[index].answer"
            />

            <RadioButton
              v-if="question.type === 'single-choice'"
              :aria-labelledby="answer.text"
              :name="`${question.id}`"
              :value="answer.id"
              :input-id="answer.id"
              v-model="formData[index].answer"
            />
            <label :for="answer.id" class="mb-0.5 cursor-pointer">{{
              answer.text
            }}</label>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <RouterLink
          :to="`/form/${route.params.formId}/success`"
          :query="route.query"
        >
          <button class="custom-btn py-2 px-5 font-medium rounded-lg">
            Submit Form
          </button>
        </RouterLink>

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
