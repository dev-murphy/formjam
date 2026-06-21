<script lang="ts" setup>
import { ref, watch, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    play?: boolean;
    duration?: number;
    decimals?: number;
    suffix?: string;
  }>(),
  { play: true, duration: 900, decimals: 0, suffix: "" },
);

const display = ref(0);
let raf = 0;

function animate() {
  cancelAnimationFrame(raf);
  const end = props.value;
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - start) / props.duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    display.value = end * eased;
    if (t < 1) raf = requestAnimationFrame(step);
    else display.value = end;
  };

  raf = requestAnimationFrame(step);
}

watch(
  () => [props.play, props.value],
  () => {
    if (props.play) animate();
    else display.value = 0;
  },
  { immediate: true },
);

onUnmounted(() => cancelAnimationFrame(raf));
</script>

<template>
  <span>{{ display.toFixed(decimals) }}{{ suffix }}</span>
</template>
