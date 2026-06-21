<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSettingsStore } from "@/store/settings";
import FormQuestionList from "@/components/form/question/FormQuestionList.vue";
import Response from "@/components/form/response/Response.vue";

const route = useRoute();
const settingsStore = useSettingsStore();

const section = computed(() => settingsStore.formSections.editSection);
</script>

<template>
  <div class="px-5 pt-5">
    <div class="mx-auto w-full max-w-[1000px]">
      <Response v-if="section === 'Responses'" />
      <FormQuestionList v-else :form-id="route.params.formId as string" />
    </div>
  </div>
</template>
