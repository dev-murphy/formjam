<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import pb from "@/db/pocketBase";

import { useForm } from "vee-validate";
import * as yup from "yup";

import Loader from "@/components/anim/Loader.vue";
import XTextInput from "@/components/inputs/ValidatedTextInput.vue";
import XCheckbox from "@/components/inputs/Checkbox.vue";
import FormErrorMessage from "@/components/form/FormErrorMessage.vue";

const rememberMe = ref(false);
const googleLoading = ref(false);

async function signInWithGoogle() {
  googleLoading.value = true;
  try {
    await pb.collection("users").authWithOAuth2({ provider: "google" });
    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value = "Google sign-in failed. Please try again.";
    resetErrorMessage();
  }
  googleLoading.value = false;
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .email("Your email must be valid")
      .required("Your email is required"),
    password: yup
      .string()
      .required("Your password is required")
      .min(8, "Your password must be at least 8 characters")
      .max(25, "Your password must be at most 25 characters"),
  }),
});

const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");
const errorTimeoutId = ref<NodeJS.Timeout | null>(null);
const onSubmit = handleSubmit(async ({ email, password }) => {
  loading.value = true;
  try {
    await pb.collection("users").authWithPassword(email, password);
    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value = "Failed to authenticate";
    resetErrorMessage();
  }
  loading.value = false;
});

function resetErrorMessage() {
  errorTimeoutId.value = setTimeout(() => {
    errorMessage.value = "";
  }, 5000);
}

function closeErrorMessage() {
  if (!errorTimeoutId.value) return;
  clearTimeout(errorTimeoutId.value);
  errorMessage.value = "";
}
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[540px] px-5"
  >
    <h2
      class="text-primary-dark-500 dark:text-white text-3xl xs:text-4xl text-center font-bold"
    >
      Log In to
      <RouterLink
        to="/"
        class="text-primary-dark-100/70 dark:text-white/50"
        data-cy="login_goto_home_link"
        >FormJAM</RouterLink
      >
    </h2>
    <p
      class="pt-2 pb-7 text-base xs:text-xl text-center text-sky-500 dark:text-sky-200"
    >
      Ready to get started? Log in to your account.
    </p>

    <form id="login_form" class="flex flex-col gap-y-4" @submit="onSubmit">
      <FormErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
        @close-error-message="closeErrorMessage"
      />

      <XTextInput
        id="login_email"
        name="email"
        type="text"
        label="Email Address"
        data-cy="login_email_input"
        autocomplete="email"
      />

      <XTextInput
        id="login_password_input"
        name="password"
        type="password"
        label="Password"
        data-cy="login_password_input"
        autocomplete="current-password"
      />

      <div
        class="flex flex-col xs:flex-row items-center justify-between gap-y-2"
      >
        <XCheckbox
          id="loginRememberMe"
          text="Remember me?"
          v-model="rememberMe"
          class="pt-1"
          data-cy="login_rememberme_input"
        />

        <RouterLink
          to="/auth/reset-your-password"
          class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-200 font-semibold underline"
          data-cy="login_goto_password_reset_link"
        >
          Forgot your password
        </RouterLink>
      </div>

      <div
        class="flex flex-col xs:flex-row items-center justify-between gap-x-4 gap-y-4"
      >
        <p
          class="flex-shrink-0 text-black dark:text-white text-base sm:text-lg select-none"
        >
          Is this your first time?
          <RouterLink
            to="/auth/signup"
            class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-semibold underline"
            data-cy="login_goto_signup_link"
            >Sign Up</RouterLink
          >
        </p>

        <button
          type="submit"
          class="custom-btn w-full xs:max-w-[150px] px-4 py-1.5 text-black rounded-lg"
          data-cy="login_submit_btn"
        >
          <Loader v-if="loading" class="w-5 h-5 mx-auto" />
          <p v-else class="font-semibold tracking-wide">Log in</p>
        </button>
      </div>

      <div class="flex items-center gap-x-3 mt-2">
        <div class="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
        <span class="text-sm text-neutral-500 dark:text-neutral-400">or</span>
        <div class="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
      </div>

      <button
        type="button"
        class="w-full flex items-center justify-center gap-x-3 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 py-2 px-4 rounded-lg transition-colors"
        data-cy="login_google_btn"
        @click="signInWithGoogle"
        :disabled="googleLoading"
      >
        <Loader v-if="googleLoading" class="w-5 h-5" />
        <template v-else>
          <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span class="text-sm font-medium text-neutral-700 dark:text-white"
            >Continue with Google</span
          >
        </template>
      </button>
    </form>
  </div>
</template>
