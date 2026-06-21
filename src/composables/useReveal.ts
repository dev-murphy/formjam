import { ref, type Ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

/**
 * Flip `visible` to true the first time `target` scrolls into view. Used to
 * trigger chart entrance/draw animations only once the chart is on screen.
 */
export function useReveal(
  target: Ref<HTMLElement | null>,
  options: { once?: boolean; threshold?: number } = {},
) {
  const { once = true, threshold = 0.2 } = options;
  const visible = ref(false);

  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true;
        if (once) stop();
      } else if (!once) {
        visible.value = false;
      }
    },
    { threshold },
  );

  return { visible };
}
