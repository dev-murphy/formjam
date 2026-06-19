<script lang="ts" setup>
import { onUnmounted, watch, ref, computed } from "vue";

import { useEditor, EditorContent, Extension } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import IconBold from "@/components/icons/text/Bold.vue";
import IconItalics from "@/components/icons/text/Italics.vue";
import IconUnderline from "@/components/icons/text/Underline.vue";
import IconLink from "@/components/icons/text/Link.vue";
import IconList from "@/components/icons/layout/List.vue";
import IconNumberedList from "@/components/icons/text/NumberedList.vue";
import IconClearFormat from "@/components/icons/text/ClearFormat.vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    type?: "title" | "question" | "description";
  }>(),
  {
    placeholder: "Untitled",
    type: "question",
  }
);
const emits = defineEmits<{ (e: "update:modelValue", val: string): void }>();

const DisableEnter = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () =>
        props.type === "title" || editor.value === undefined ? true : false,
    };
  },
});

const characterLimit = computed(() => {
  return props.type === "title" ? 200 : 500;
});

const timerId = ref<NodeJS.Timeout | null>(null);
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    DisableEnter, // custom extension for disabling enter
    Underline,
    Link.configure({
      openOnClick: false,
      linkOnPaste: false,
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    CharacterCount.configure({
      limit: characterLimit.value,
    }),
  ],
  editorProps: {
    attributes: {
      class: createInputClass(),
    },
    transformPastedText(text) {
      const transformedText = text
        .replaceAll("\n", " ")
        .replaceAll("\r", " ")
        .trim();
      return transformedText;
    },
    transformPastedHTML(text) {
      // Dev note:
      // This function is used for pasting text without any new lines,
      // this only applies to title inputs from website

      // first, convert the text being pasted into HTML
      const domParser = new DOMParser();
      const html = domParser.parseFromString(text, "text/html");

      // get text content from the pasted text
      const content = html.documentElement.textContent;

      // used one paragraph and paste all the content in there
      html.body.innerHTML = `<!--StartFragment--><p>${content}</p><!--EndFragment-->`;
      return html.documentElement.innerHTML;
    },
  },
  onUpdate: ({ editor }) => {
    if (timerId.value) {
      clearTimeout(timerId.value);
    }
    timerId.value = setTimeout(() => {
      emits("update:modelValue", editor.getHTML() || "");
    }, 1000);
  },
  onFocus: () => {
    isMenuOpen.value = true;
  },
  onBlur: () => {
    isMenuOpen.value = false;
  },
  onDestroy: () => {
    emits("update:modelValue", editor.value?.getHTML() || "");
  },
});

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value;
    if (isSame) return;
    editor.value?.commands.setContent(value);
  }
);

function setLink() {
  const previewUrl = editor.value?.getAttributes("link").href;
  const url = window.prompt("URL", previewUrl);

  if (url === null) return;

  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    editor.value?.chain().focus().unsetUnderline().run();
    return;
  }

  editor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();

  editor.value?.chain().focus().setUnderline().run();
}

function setList(listType: "bulletList" | "orderedList") {
  if (editor.value?.isActive(listType)) {
    editor.value.chain().focus().liftListItem("listItem").run();
    return;
  }

  if (listType === "orderedList") {
    editor.value?.chain().focus().toggleOrderedList().run();
  } else if (listType === "bulletList") {
    editor.value?.chain().focus().toggleBulletList().run();
  }
}

function createInputClass() {
  let baseClasses = "prose max-w-[100%] outline-none ";
  if (props.type === "question") {
    baseClasses +=
      "py-0.5 text-lg dark:text-white  dark:prose-strong:text-white";
  } else if (props.type === "title") {
    baseClasses +=
      "border-b border-neutral-200 dark:border-neutral-500 pb-1 dark:text-white dark:prose-strong:text-white text-3xl";
  } else if (props.type === "description") {
    baseClasses +=
      "prose-sm border-b border-neutral-200 dark:border-neutral-600 pb-1 text-sm text-black/50 dark:text-neutral-300  dark:prose-strong:text-white";
  }

  return baseClasses;
}

const isMenuOpen = ref(false);

onUnmounted(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="w-full overflow-hidden relative">
    <editor-content :editor="editor" class="w-full peer" />

    <div
      v-if="editor"
      class="menu md:h-12 flex flex-col sm:flex-row items-center gap-x-1 pt-3 md:pt-0 pl-1 text-black dark:text-white overflow-hidden"
      :class="{ open: isMenuOpen }"
    >
      <div class="flex items-center gap-x-1">
        <button
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          :class="{
            'bg-gray-200 dark:bg-neutral-800': editor?.isActive('bold'),
          }"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          aria-label="Bold Text"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <IconBold class="w-6 h-6" />
        </button>
        <button
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          :class="{
            'bg-gray-200 dark:bg-neutral-800': editor?.isActive('italic'),
          }"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          aria-label="Italicize Text"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <IconItalics class="w-6 h-6" />
        </button>
        <button
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          :class="{
            'bg-gray-200 dark:bg-neutral-800': editor?.isActive('underline'),
          }"
          :disabled="editor.isActive('link')"
          aria-label="Underline Text"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <IconUnderline class="w-6 h-6" />
        </button>
        <button
          v-if="type === 'description'"
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          :class="{
            'bg-gray-200 dark:bg-neutral-800': editor?.isActive('bulletList'),
          }"
          aria-label="Toggle Bullet List"
          @click="setList('bulletList')"
        >
          <IconList class="w-6 h-6" />
        </button>
        <button
          v-if="type === 'description'"
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          :class="{
            'bg-gray-200 dark:bg-neutral-800': editor?.isActive('orderedList'),
          }"
          aria-label="Toggle Numbered List"
          @click="setList('orderedList')"
        >
          <IconNumberedList class="w-6 h-6" />
        </button>
        <button
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          :class="{
            'bg-gray-200 dark:bg-neutral-800': editor?.isActive('link'),
          }"
          aria-label="Add/Remove Url to Text"
          @click="setLink"
        >
          <IconLink class="w-6 h-6" />
        </button>
        <button
          class="hover:bg-gray-200 dark:hover:bg-neutral-800 p-1 rounded-md"
          @click="editor.chain().focus().unsetAllMarks().run()"
          aria-label="Clear All Text Marks"
        >
          <IconClearFormat class="w-6 h-6" />
        </button>
      </div>

      <div
        class="h-full flex flex-col sm:flex-row items-center gap-1 py-2 md:px-4 text-base md:text-lg"
      >
        <span
          class="block w-12 sm:w-2 h-0.5 sm:h-2 bg-black dark:bg-sky-500 rounded-full"
        ></span>
        <p class="leading-0 text-neutral-400">
          <span class="text-black/70 dark:text-white font-bold">{{
            editor.storage.characterCount.characters()
          }}</span>
          / {{ characterLimit }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
@reference "@/style.css";

.tiptap a {
  @apply text-primary-purple;
}

/* Placeholder (at the top) */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.tiptap > p,
.tiptap ol li p,
.tiptap ul li p {
  margin-top: 4px;
  margin-bottom: 4px;
}

.tiptap > div p {
  margin-top: 2px;
  margin-bottom: 2px;
}

.menu {
  max-height: 0px;
  transition: max-height 0.25s ease-out;
  overflow: hidden;
}

.menu.open,
.menu:focus-within {
  max-height: 500px;
  transition: max-height 0.6s ease-in;
}
</style>
