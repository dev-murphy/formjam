<script lang="ts" setup>
import { useRouter } from "vue-router";
import IconSuccess from "@/components/icons/misc/Success.vue";

const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center pt-16">
    <IconSuccess class="w-24 h-24" />
    <h1 class="py-2 text-2xl font-medium dark:text-white">Response Saved.</h1>
    <p class="dark:text-white">You submitted the form successfully.</p>
    <button @click="router.go(-1)" class="underline dark:text-white">
      Submit another response
    </button>
  </div>
</template>
