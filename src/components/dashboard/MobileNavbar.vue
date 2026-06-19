<script lang="ts" setup>
import { ref, watch } from "vue";
import { useFormStore } from "@/store/forms";
import { useRouter, useRoute } from "vue-router";
import pb from "@/db/pocketBase";

import Menu from "primevue/menu";

import IconSearch from "@/components/icons/input/Search.vue";
import IconLogout from "@/components/icons/controls/Logout.vue";
import IconUser from "@/components/icons/menu/User.vue";

import XTextInput from "@/components/inputs/TextInput.vue";
import ThemeToggle from "@/components/common/ThemeToggle.vue";

const router = useRouter();
const route = useRoute();
const formStore = useFormStore();

const menu = ref();
const menuItems = ref([
  {
    label: "Profile",
    command: () => {
      router.push("/profile");
    },
  },
  {
    label: "Log out",
    command: () => {
      logout();
    },
  },
]);

function toggle(event: Event) {
  menu.value.toggle(event);
}

const showSearchInput = ref(false);
function toggleSearchInput() {
  showSearchInput.value = !showSearchInput.value;
}

async function logout() {
  pb.authStore.clear();
  router.push({ name: "Login" });
}

function getCypressAttribute(label: any) {
  if (!label) return;

  if (label === "Log out") {
    return "dashboard_logout_btn";
  }
}

watch(
  () => formStore.searchTerm,
  (term: string) => {
    if (term !== "") {
      router.push({
        path: route.path,
        query: {
          search: term,
        },
      });
    } else {
      router.push({
        path: route.path,
      });
    }
  }
);
</script>

<template>
  <header>
    <div class="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-3">
      <div class="container flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-x-2">
          <img src="@/assets/images/logo.png" alt="logo" class="max-h-[30px]" />
          <p class="text-2xl text-neutral-700 dark:text-white">
            Form<span class="text-neutral-400 font-bold">JAM</span>
          </p>
        </RouterLink>

        <div class="flex gap-x-3">
          <ThemeToggle />
          <button
            class="custom-btn p-2 text-neutral-900 dark:text-white rounded-lg"
            @click="toggleSearchInput"
            data-cy="mobile_nav_open_search"
          >
            <IconSearch class="w-6 h-6" />
          </button>

          <button
            class="custom-btn p-2 text-neutral-900 dark:text-white rounded-lg"
            @click="toggle"
            data-cy="navbar_open_menu"
          >
            <IconUser class="w-6 h-6" />
          </button>

          <Menu ref="menu" :model="menuItems" id="overlay_menu" :popup="true">
            <template #item="{ item }">
              <div
                class="flex items-center gap-x-3 px-5 py-2"
                :data-cy="getCypressAttribute(item.label)"
              >
                <IconLogout v-if="item.label === 'Log out'" class="w-6 h-6" />
                {{ item.label }}
              </div>
            </template>
          </Menu>
        </div>
      </div>
    </div>

    <div
      v-if="showSearchInput"
      class="flex items-center justify-center gap-x-4 bg-gray-100 dark:bg-neutral-900 py-2"
    >
      <XTextInput
        id="mobile-search-input"
        type="text"
        v-model="formStore.searchTerm"
        placeholder="Search"
        is-searchable
      />
    </div>
  </header>
</template>
