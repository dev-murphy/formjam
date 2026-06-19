<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFormStore } from "@/store/forms";
import { smallerOrEqual } from "@/utils/breakpoints";

import IconAdd from "@/components/icons/controls/Add.vue";
import Loader from "@/components/anim/Loader.vue";

defineProps<{ view: "list" | "grid" }>();

const router = useRouter();
const formStore = useFormStore();
const isLoading = ref(false);
const error = ref("");

async function gotoEditFormPage() {
  isLoading.value = true;
  error.value = "";
  try {
    const id = await formStore.createForm();
    router.push({ name: "EditForm", params: { formId: id } });
  } catch (e: any) {
    error.value = "Failed to create form. Please try again.";
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="max-w-full">
    <p v-if="error" class="text-sm text-red-500 mb-2">{{ error }}</p>
    <button
      v-if="view === 'grid'"
      role="button"
      title="Create Form Card"
      class="w-full h-full flex bg-sky-200 dark:bg-neutral-900 py-6 px-6 border-2 border-dashed border-sky-300 dark:border-neutral-700 hover:border-sky-500 dark:hover:border-sky-600 rounded-lg cursor-pointer"
      :class="{
        'flex-row items-center gap-x-4': smallerOrEqual,
        'flex-col items-center justify-center': !smallerOrEqual,
      }"
      data-cy="create_form_card"
      @click="gotoEditFormPage"
    >
      <div class="custom-btn p-1 rounded-xl">
        <IconAdd v-if="!isLoading" class="w-9 h-9 text-sky-600" />
        <Loader v-else class="w-9 h-9 text-sky-600" />
      </div>
      <div
        class="flex flex-col"
        :class="{
          'items-start': smallerOrEqual,
          'items-center': !smallerOrEqual,
        }"
      >
        <p
          class="font-bold font-epilogue dark:text-white"
          :class="{
            'text-xl': smallerOrEqual,
            'text-lg pt-4': !smallerOrEqual,
          }"
        >
          Create new form
        </p>
        <p class="text-sm text-sky-800 dark:text-sky-500 font-medium tracking-wide">
          Click here to create a blank form
        </p>
      </div>
    </button>
    <div
      v-else
      class="bg-sky-200 dark:bg-neutral-700 dark:border dark:border-transparent dark:hover:border-neutral-600 flex items-center justify-between p-3 rounded-2xl"
    >
      <h1 class="text-lg dark:text-white">
        <span v-if="smallerOrEqual">Want a new form?</span>
        <span v-else>Do you want create a new form?</span>
      </h1>
      <button
        class="custom-btn flex items-center gap-x-1 p-2 text-sky-700 dark:text-neutral-800 font-medium rounded-lg"
        data-cy="create_form_btn"
        @click="gotoEditFormPage"
      >
        <IconAdd class="hidden sm:block w-6 h-6" />
        <p>Create <span class="hidden sm:inline"> blank form </span></p>
      </button>
    </div>
  </div>
</template>
