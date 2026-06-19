<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTitle } from "@vueuse/core";
import type { SubmittedForm } from "@/types/form";
import pb from "@/db/pocketBase";

import debounce from "@/utils/debouncer";
import { getDefaultAnswer, setupParagraphInputs } from "@/utils/form";

import { useFormStore } from "@/store/forms";
import { useQuestionStore } from "@/store/questions";
import { useSettingsStore } from "@/store/settings";
import IconLongText from "@/components/icons/question/LongText.vue";

// prime vue components
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";

const route = useRoute();
const router = useRouter();

const formStore = useFormStore();
const questionStore = useQuestionStore();
const settingsStore = useSettingsStore();

const formTitle = ref("");
const formResponse = ref<SubmittedForm>({
  form: "",
  user: "",
  is_submitted: false,
  form_data: [],
});

const title = computed(() => {
  const elem = document.createElement("h1");
  elem.innerHTML = formTitle.value;
  return elem.innerText
    ? elem.innerText + " | FormJAM"
    : "Untitled Form | FormJAM";
});
useTitle(title);

function clearForm() {
  formResponse.value.form_data = formResponse.value.form_data.map((answer) => {
    return {
      id: answer.id,
      type: answer.type,
      answer: getDefaultAnswer(answer.type),
    };
  });
}

watch(
  () => formResponse.value.form_data,
  async (formValue) => {
    debounce(async () => {
      await pb
        .collection("submitted_forms")
        .update(settingsStore.formData.form_id, {
          form_data: formValue,
        });
    }, 1000);
  },
  { deep: true }
);

async function newForm(formId: string) {
  formResponse.value.user = pb.authStore.model?.id ?? "";
  formResponse.value.form = formId;
  const record = await pb
    .collection("submitted_forms")
    .create(formResponse.value);

  settingsStore.formData.form_id = record.id;
  settingsStore.formData.is_submitted = false;

  let paragraphInputs: string[] = [];

  formResponse.value.form_data = questionStore.questions.map(({ type, id }) => {
    if (type === "paragraph") paragraphInputs.push(id);
    return { id, type, answer: getDefaultAnswer(type) };
  });

  setupParagraphInputs(paragraphInputs);
}

async function submit() {
  formResponse.value.is_submitted = true;
  settingsStore.formData.is_submitted = true;

  await pb
    .collection("submitted_forms")
    .update(settingsStore.formData.form_id, {
      is_submitted: true,
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
      const response = await pb
        .collection("submitted_forms")
        .getOne(settingsStore.formData.form_id);

      formResponse.value.form_data = response.form_data;
      return;
    } catch (e) {
      console.error(e);
    }
  }

  await newForm(formId);
});
</script>

<template>
  <div class="px-5 py-6">
    <form class="w-full max-w-[1000px] flex flex-col gap-3 mx-auto">
      <h1
        v-html="formTitle"
        class="prose prose-2xl text-center"
      ></h1>

      <div
        v-for="(question, index) in questionStore.questions"
        class="w-full flex flex-col border border-gray-300 p-4 mx-auto shadow-md rounded-lg"
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
          class="flex gap-1 text-xl"
          :class="{
            'pb-3': !question.description,
          }"
        ></h2>
        <p
          v-if="question.description"
          v-html="question.description"
          class="question-description prose prose-p:my-0.3 prose-li:my-0.5 text-gray-600 pb-3 text-sm"
        ></p>

        <div v-if="formResponse.form_data[index]" class="flex-grow">
          <div
            v-if="question.type === 'short-text'"
            class="flex items-center gap-x-3"
          >
            <p class="font-rokkitt text-[26px]">T</p>
            <input
              type="text"
              v-model="formResponse.form_data[index].answer"
              placeholder="Enter your answer here"
              class="w-full py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 outline-none"
              @keypress.enter.prevent
            />
          </div>

          <div
            v-if="question.type === 'paragraph'"
            class="flex items-start gap-x-3"
          >
            <IconLongText class="w-6 h-6 mt-2.5" />
            <textarea
              :id="`textarea-${question.id}`"
              placeholder="Enter your answer here"
              v-model="formResponse.form_data[index].answer"
              data-lpignore="true"
              class="w-full h-8 py-2 border-b border-gray-200 hover:border-gray-400 focus:border-sky-500 resize-none outline-none"
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
              v-model="formResponse.form_data[index].answer"
            />

            <RadioButton
              v-if="question.type === 'single-choice'"
              :aria-labelledby="answer.text"
              :name="`${question.id}`"
              :value="answer.id"
              :input-id="answer.id"
              v-model="formResponse.form_data[index].answer"
            />
            <label :for="answer.id" class="mb-0.5 cursor-pointer">{{
              answer.text
            }}</label>
          </div>
        </div>
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
