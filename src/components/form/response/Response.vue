<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useResponseStore } from "@/store/responses";
import { useQuestionStore } from "@/store/questions";
import { useSettingsStore } from "@/store/settings";

import ResponseHeading from "@/components/form/response/ResponseHeading.vue";
import SummaryView from "@/components/form/response/SummaryView.vue";
import QuestionView from "@/components/form/response/QuestionView.vue";
import IndividualView from "@/components/form/response/IndividualView.vue";
import Loader from "@/components/anim/Loader.vue";

const route = useRoute();
const responseStore = useResponseStore();
const questionStore = useQuestionStore();
const settingsStore = useSettingsStore();

const section = computed(() => settingsStore.formSections.responseSection);

async function load(formId: string) {
  if (!questionStore.questions.length) {
    await questionStore.fetchQuestions(formId);
  }
  await responseStore.fetchResponses(formId);
}

onMounted(() => load(route.params.formId as string));

watch(
  () => route.params.formId,
  (id) => id && load(id as string),
);
</script>

<template>
  <div class="flex flex-col gap-6 pb-10">
    <ResponseHeading />

    <div
      v-if="responseStore.loading"
      class="flex justify-center py-20 text-sky-500"
    >
      <Loader class="h-8 w-8" />
    </div>

    <template v-else>
      <div
        v-if="responseStore.totalResponses === 0"
        class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-20 text-center dark:border-neutral-700"
      >
        <p class="text-lg font-medium text-neutral-600 dark:text-neutral-300">
          No responses yet
        </p>
        <p class="text-sm text-neutral-400">
          Share your form to start collecting responses.
        </p>
      </div>

      <template v-else>
        <SummaryView v-if="section === 'Summary'" />
        <QuestionView v-else-if="section === 'Question'" />
        <IndividualView v-else-if="section === 'Individual'" />
      </template>
    </template>
  </div>
</template>
