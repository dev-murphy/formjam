<script lang="ts" setup>
import pb from "@/db/pocketBase";

import { UserType } from "@/types/pocketbase";

import { useForm } from "vee-validate";
import * as yup from "yup";

import XTextInput from "@/components/inputs/ValidatedTextInput.vue";

let { firstName, lastName, email } = pb.authStore.model as unknown as UserType;

const { handleSubmit } = useForm({
  initialValues: {
    firstName,
    lastName,
    email,
  },
  validationSchema: yup.object({
    firstName: yup
      .string()
      .required("Your first name is required")
      .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-\/.]+$/, "Please enter valid name")
      .min(3, "Your first name must contain at least 3 characters"),
    lastName: yup
      .string()
      .required("Your last name is required")
      .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-\/.]+$/, "Please enter valid name")
      .min(3, "Your last name must contain at least 3 characters"),
    email: yup
      .string()
      .required("Your email is required")
      .email("Your email must be valid"),
  }),
});

const onSubmit = handleSubmit(async ({ firstName, lastName }) => {
  try {
    await pb
      .collection("users")
      .update(pb.authStore.model!.id, { firstName, lastName });
  } catch (error: any) {
    // TODO: MURPHY ADD THIS
  }
});
</script>
<template>
  <form id="personal_form_form" class="flex flex-col">
    <h2
      class="mb-2 dark:text-neutral-400 text-lg font-medium tracking-widest uppercase"
    >
      Personal Information
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <XTextInput
        id="profile_firstname"
        type="text"
        name="firstName"
        label="First Name"
        data-cy="profile_firstname_input"
        autocomplete="given-name"
      />

      <XTextInput
        id="profile_lastname"
        type="text"
        name="lastName"
        label="Last Name"
        data-cy="profile_lastname_input"
        autocomplete="family-name"
      />

      <XTextInput
        id="profile_email"
        type="text"
        name="email"
        label="Email Address"
        data-cy="profile_email_input"
        autocomplete="email"
      />
    </div>

    <button
      @click="onSubmit"
      class="custom-btn w-full sm:w-[200px] ml-auto p-2 mt-4 dark:text-neutral-800 font-medium rounded-md"
    >
      Save Changes
    </button>
  </form>
</template>
