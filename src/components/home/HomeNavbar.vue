<script lang="ts" setup>
import { ref } from "vue";

import IconMenu from "@/components/icons/menu/Menu.vue";
import IconClose from "@/components/icons/controls/Close.vue";
import ThemeToggle from "@/components/common/ThemeToggle.vue";

const showNavDropdown = ref(false);
function toggleNavDropdown() {
  showNavDropdown.value = !showNavDropdown.value;
}
</script>

<template>
  <header
    class="sticky top-0 w-full bg-primary-light-100 dark:bg-primary-dark-800 flex items-center py-4 px-3 md:px-6 text-neutral-900 dark:text-white z-[100]"
  >
    <div
      class="w-full max-w-[1200px] flex items-center justify-between mx-auto"
    >
      <div class="flex items-center gap-x-3 select-none">
        <img src="@/assets/images/logo.png" alt="logo" class="w-10 h-10" />
        <h1 class="text-xl md:text-2xl leading-4 font-bold">FormJAM</h1>
      </div>

      <div class="hidden md:flex items-center">
        <ThemeToggle />

        <div class="block w-[1px] h-8 bg-black/20 dark:bg-white/20 mx-4"></div>

        <nav class="flex items-center gap-x-3">
          <RouterLink to="/auth/signup">
            <button
              class="hover:bg-black/5 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/30 pt-2 pb-2.5 px-4 rounded-lg select-none"
              data-cy="home_signup_btn"
            >
              Sign up
            </button>
          </RouterLink>
          <RouterLink to="/auth/login">
            <button
              class="btn relative bg-primary-dark-500 pt-2 pb-2.5 px-4 font-medium rounded-md select-none"
              data-cy="home_login_btn"
            >
              <p class="relative z-10">Log in</p>
            </button>
          </RouterLink>
        </nav>
      </div>

      <div class="block md:hidden" @click.stop="toggleNavDropdown">
        <button
          class="p-1.5 border border-gray-300 dark:border-primary-dark-100 rounded-md"
          data-cy="home_menu_btn"
        >
          <IconMenu class="w-6 h-6" :class="{ hidden: showNavDropdown }" />
          <IconClose class="w-6 h-6" :class="{ hidden: !showNavDropdown }" />
        </button>

        <nav
          v-if="showNavDropdown"
          class="absolute top-full left-0 w-full flex flex-col gap-y-4 bg-white dark:bg-black p-4 z-[999]"
        >
          <RouterLink to="/auth/signup">
            <button
              class="w-full hover:bg-black/5 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/30 pt-2 pb-2.5 px-4 rounded-lg select-none"
              data-cy="home_mobile_signup_btn"
            >
              Sign up
            </button>
          </RouterLink>
          <RouterLink to="/auth/login">
            <button
              class="w-full btn relative bg-primary-dark-500 pt-2 pb-2.5 px-2 font-medium rounded-md select-none"
              data-cy="home_mobile_login_btn"
            >
              <p class="relative z-10">Log in</p>
            </button>
          </RouterLink>
          <div
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/10 rounded-md"
            @click.stop
          >
            <p>Appearance</p>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
@reference "@/style.css";
.btn::before {
  content: "";
  position: absolute;
  inset: 2px;
  opacity: 0.45;
  transform: translate3d(0, 0, -1px);
  background: linear-gradient(#ff007a, #7000ff, #ff007a, #7000ff);
  background-size: 400% 400%;
  animation: btn-pan-down 3s linear infinite;
  filter: blur(10px);
  clip-path: polygon(
    -100vmax -100vmax,
    100vmax -100vmax,
    100vmax 100vmax,
    -100vmax 100vmax,
    -100vmax -100vmax,
    0 0,
    0 100%,
    100% 100%,
    100% 0,
    0 0
  );
}

.btn {
  background-image: linear-gradient(to left, #ff007a, #7000ff, #ff007a);
  background-size: 200%;
  animation: btn-pan-down 3s linear infinite;
}

.btn::after {
  content: "";
  position: absolute;
  inset: 1px;
  @apply bg-white dark:bg-neutral-900 transition rounded-[5px];
}

@keyframes btn-pan-down {
  from {
    background-position: 0% center;
  }

  to {
    background-position: -200% center;
  }
}
</style>
