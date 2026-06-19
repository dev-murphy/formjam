<script lang="ts" setup>
import { ref, computed } from "vue";
import type { FormCardEmitType, FormItemPropType } from "@/types/form";

import IconDelete from "@/components/icons/controls/Delete.vue";
import IconForm from "@/components/icons/misc/Form.vue";
import IconDots from "@/components/icons/menu/Dots.vue";
import IconEdit from "@/components/icons/controls/Edit.vue";
import IconCheck from "@/components/icons/input/Check.vue";

// prime vue components
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Menu from "primevue/menu";

const props = defineProps<FormItemPropType>();
const emits = defineEmits<FormCardEmitType>();

const menu = ref();
const menuItems = ref([
  {
    label: "Delete",
    command: () => {
      openDialog();
    },
  },
  { label: "Rename", disabled: true },
]);

function toggle(event: Event) {
  menu.value.toggle(event);
}

const confirm = useConfirm();
const toast = useToast();

function openDialog() {
  confirm.require({
    message: "Are you sure you want to delete the form?",
    header: "Delete the Form",
    accept: () => {
      emits("deleteForm");
      toast.add({
        severity: "success",
        summary: "Form Deleted",
        detail: "Form was successfully deleted from the database",
        life: 2000,
      });
      confirm.close();
    },
    reject: () => {
      confirm.close();
    },
  });
}

// ** Dev note **
// Since the title in rich text, I decided to rendered the rich text
// in a hidden element, and extract it using `textContent` property.
// A ref was used to avoid having to create custom ids
const titleElem = ref<HTMLDivElement>();
const unformattedTitle = computed(() => {
  if (titleElem.value === undefined) return props.title;
  return titleElem.value.textContent;
});

function getCypressAttribute(label: string) {
  if (label === "Delete") {
    return "form_card_delete_btn";
  } else if (label === "Rename") {
    return "form_card_rename_btn";
  }
}

const timeoutId = ref<NodeJS.Timeout>();
function triggerSelect(duration: number = 500) {
  timeoutId.value = setTimeout(() => {
    emits("selectForm");
  }, duration);
}

function cancel() {
  clearTimeout(timeoutId.value);
}
</script>

<template>
  <div
    class="w-full flex items-center hover:bg-sky-100 dark:hover:bg-neutral-900 px-5 py-3 cursor-pointer rounded-full"
    @click="!selectMode && $emit('editForm')"
    @mousedown="!selectMode && triggerSelect()"
    @mouseup="!selectMode && cancel()"
    @touchstart="!selectMode && triggerSelect()"
    @touchend="!selectMode && cancel()"
  >
    <button @click.stop="selectMode && $emit('selectForm')">
      <div v-if="isSelected" class="bg-green-500 p-1.5 rounded-lg">
        <IconCheck
          class="icon-check w-6 h-6 text-white dark:text-neutral-900"
        />
      </div>
      <div v-else class="bg-sky-500 p-1.5 rounded-lg">
        <IconForm class="w-6 h-6 text-white dark:text-neutral-900" />
      </div>
    </button>

    <div class="flex flex-wrap items-center justify-between flex-grow ml-3">
      <div ref="titleElem" class="hidden" v-html="title"></div>
      <p
        class="w-full max-w-[150px] sm:max-w-[300px] font-medium truncate dark:text-white"
        v-html="unformattedTitle"
      ></p>

      <p class="text-sm sm:text-base dark:text-neutral-400">
        <span class="hidden sm:inline">Last opened: </span>{{ lastEdited }}
      </p>
    </div>

    <div class="relative flex-shrink-0 ml-20" @click.stop="toggle">
      <button
        class="hover:bg-black/10 dark:hover:bg-neutral-700 p-1 rounded-full"
      >
        <IconDots class="w-[24px] h-[24px]" />
      </button>

      <Menu ref="menu" :model="menuItems" id="overlay_menu" :popup="true">
        <template #item="{ item }">
          <div
            class="flex items-center gap-x-3 px-5 py-2"
            :data-cy="getCypressAttribute(item.label as string)"
          >
            <IconDelete
              v-if="item.label === 'Delete'"
              class="w-6 h-6 text-red-500"
            />
            <IconEdit v-if="item.label === 'Rename'" class="w-6 h-6" />
            {{ item.label }}
          </div>
        </template>
      </Menu>
    </div>
  </div>
</template>

<style>
.icon-check * {
  stroke-width: 3px;
}
</style>
