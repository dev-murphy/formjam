<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useFormStore } from "@/store/forms";
import { setPageTitle } from "@/utils/form";
import debounce from "@/utils/debouncer";
import pb from "@/db/pocketBase";
import type { Form } from "@/types/pocketbase";

import XEditor from "@/components/inputs/Editor.vue";

const props = defineProps<{ formId: string }>();
const formStore = useFormStore();

const title = ref("");
const description = ref("");

watch(title, (newTitle) => {
  if (!props.formId) return;
  debounce(async () => {
    await formStore.updateFormField(props.formId, {
      title: newTitle !== "<p></p>" ? newTitle : "Untitled Form",
    });
    setPageTitle(newTitle);
  }, 800);
});

watch(description, (newDescription) => {
  if (!props.formId) return;
  debounce(async () => {
    await formStore.updateFormField(props.formId, {
      description: newDescription,
    });
  }, 800);
});

onMounted(async () => {
  let formData = formStore.forms.find((f) => f.id === props.formId);
  if (!formData) {
    formData = await pb.collection("forms").getOne<Form>(props.formId);
  }
  title.value = formData.title === "Untitled Form" ? "" : formData.title;
  description.value = formData.description;
});
</script>

<template>
  <div
    class="flex flex-col gap-y-2 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg"
  >
    <XEditor type="title" placeholder="Untitled Form" v-model.lazy="title" />
    <XEditor
      type="description"
      placeholder="Form description"
      v-model.lazy="description"
    />
  </div>
</template>
