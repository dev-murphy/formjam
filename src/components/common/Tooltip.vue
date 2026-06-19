<script lang="ts" setup>
import type { TooltipPropType } from "@/types/common";
defineProps<TooltipPropType>();
</script>

<template>
  <div class="relative">
    <div class="slot peer">
      <slot />
    </div>
    <div
      class="absolute max-w-[250px] invisible peer-hover:visible bg-neutral-700 p-2.5 text-sm text-white rounded-md"
      :class="{
        'tooltip top bottom-full left-1/2 -translate-x-1/2 -translate-y-2':
          align === 'top',
        'tooltip bottom top-full left-1/2 -translate-x-1/2 translate-y-2':
          align === 'bottom',
        'tooltip left right-full top-1/2 -translate-y-1/2 -translate-x-2':
          align === 'left',
        'tooltip right left-full top-1/2 -translate-y-1/2 translate-x-2':
          align === 'right',
      }"
    >
      <span
        class="absolute inline-block border-[7px] border-transparent"
        :class="{
          'top-[1px] -translate-y-full left-1/2 -translate-x-1/2 border-b-neutral-700':
            align === 'bottom',
          'bottom-[1px] translate-y-full left-1/2 -translate-x-1/2 border-t-neutral-700':
            align === 'top',
          'left-[1px] -translate-x-full top-1/2 -translate-y-1/2 border-r-neutral-700':
            align === 'right',
          'right-[1px] translate-x-full top-1/2 -translate-y-1/2 border-l-neutral-700':
            align === 'left',
        }"
      ></span>
      <slot name="tooltip" />
    </div>
  </div>
</template>

<style>
@reference "@/style.css";

.tooltip {
  @apply transition-all duration-500 delay-150 opacity-0;
}

.tooltop.left {
  @apply -translate-x-[25px];
}
.tooltip.right {
  @apply translate-x-[25px];
}
.tooltip.top {
  @apply -translate-y-[25px];
}
.tooltip.bottom {
  @apply translate-y-[25px];
}

.slot:hover + .tooltip.top {
  @apply opacity-100 -translate-y-2;
}

.slot:hover + .tooltip.bottom {
  @apply opacity-100 translate-y-2;
}

.slot:hover + .tooltip.left {
  @apply opacity-100 -translate-x-2;
}

.slot:hover + .tooltip.right {
  @apply opacity-100 translate-x-2;
}
</style>
