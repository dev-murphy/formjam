<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import IconAdd from "@/components/icons/controls/Add.vue";
import IconSection from "@/components/icons/controls/PageBreak.vue";
import IconShare from "@/components/icons/controls/Share.vue";
import IconCopy from "@/components/icons/controls/Copy.vue";

import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";

defineEmits<{ (e: "add:question"): void }>();

const route = useRoute();
const toast = useToast();

const visible = ref(false);
function toggleVisible() {
  visible.value = !visible.value;
}

const urlInput = ref<HTMLInputElement | null>(null);
function copyText() {
  if (urlInput.value === null) return;

  urlInput.value.select();
  urlInput.value.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(urlInput.value.value);

  toast.add({
    severity: "success",
    summary: "Link Copied",
    detail: "The form link was copied to clipboard",
    life: 2000,
  });
}
</script>

<template>
  <div
    class="fixed bottom-4 md:bottom-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 md:relative w-max md:w-14 h-min flex md:flex-col gap-4 items-center bg-gray-200 dark:bg-neutral-700 border-2 border-gray-400 dark:border-neutral-600 px-4 md:px-0 py-4 rounded-xl"
  >
    <button @click="$emit('add:question')">
      <IconAdd class="w-6 h-6 text-black dark:text-white" />
    </button>

    <button>
      <IconSection class="w-6 h-6 text-black dark:text-white" />
    </button>

    <button @click="toggleVisible">
      <IconShare class="w-6 h-6 text-black dark:text-white" />
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      dismissable-mask
      header="Send Form"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <h2 class="text-xl">Send Form via Link</h2>
      <div
        class="flex items-center justify-between bg-gray-100 dark:bg-neutral-800 p-3 mt-2 rounded-lg"
      >
        <input
          ref="urlInput"
          type="text"
          :value="`https://formjam.vercel.app/form/${route.params.formId}/view`"
          class="w-[70%] bg-transparent py-2 border-b border-gray-100 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-500 focus:border-sky-500 outline-none dark:text-white"
        />
        <button class="bg-black/10 p-1.5 rounded-md" @click="copyText">
          <IconCopy class="w-7 h-7" />
        </button>
      </div>

      <div class="w-full flex items-center justify-end gap-x-4 mt-3">
        <button
          class="w-[100px] hover:bg-gray-100 dark:hover:bg-neutral-800 active:bg-gray-200 dark:active:bg-neutral-700 py-2 rounded-lg"
          @click="toggleVisible"
        >
          Cancel
        </button>
        <button class="custom-btn w-[100px] py-2 rounded-lg" @click="copyText">
          Copy
        </button>
      </div>
    </Dialog>
  </div>
</template>
