<script setup lang="ts">
import { computed, ref } from "vue";
import { useElementSize } from "@vueuse/core";

const rate = ref(50);
const compareRef = ref<HTMLElement>();
const { height } = useElementSize(compareRef);
const heightStyle = computed(() => {
  return `${height.value}px`;
});

const ratePercentage = computed(() => {
  return `${rate.value}%`;
});
</script>

<template>
  <div ref="compareRef" class="compare">
    <div class="compare__content compare__content--before">
      <slot name="before" />
    </div>
    <div class="compare__content compare__content--after">
      <slot name="after" />
    </div>

    <input v-model="rate" type="range" class="slider" min="0" max="100" />
    <div class="hint">
      <div class="heart-beat">drag me</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hide {
  position: absolute;
  top: -99999px;
  left: -99999px;
}

.compare {
  position: relative;
  display: grid;
  grid-area: 1/1;
  &__content {
    grid-area: 1 / 1;
    height: 100%;

    --pos: v-bind(ratePercentage);
    &--before {
      mask: linear-gradient(to right, #000 0, var(--pos, 50%), #0000 0);
    }
    &--after {
      mask: linear-gradient(to right, #0000 0, var(--pos, 50%), #000 0);
    }
  }

  --thumb-width: 3px;
  .slider {
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 100%;
    appearance: none;
    background: transparent;
    &::-webkit-slider-thumb {
      display: block;
      width: var(--thumb-width);
      height: v-bind(heightStyle);
      appearance: none;
      cursor: e-resize;
      background: var(--vp-c-important-2);
      border-radius: 5px;
      box-shadow:
        0 0 10px var(--vp-c-important-2),
        0 0 20px var(--vp-c-important-2),
        0 0 50px var(--vp-c-important-2);
    }
  }
  .hint {
    position: absolute;
    top: 100%;
    left: v-bind(ratePercentage);
    display: block;
    width: 80px;
    font-size: 12px;
    text-align: center;
    user-select: none;
    transform: translateX(-50%);
  }

  @keyframes heart-beat {
    0% {
      transform: scale(1);
    }

    14% {
      transform: scale(1.3);
    }

    28% {
      transform: scale(1);
    }

    42% {
      transform: scale(1.3);
    }

    70% {
      transform: scale(1);
    }
  }

  @keyframes delay-heart-beat {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    50.01% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

  .heart-beat {
    --animate-duration: 1s;
    --animate-delay: 1 s;
    --animate-repeat: infinite;

    text-shadow: var(--vp-c-important-2) 0 0 10px;
    animation-name: heart-beat, delay-heart-beat;
    animation-duration: calc(var(--animate-duration) * 1.3),
      calc(var(--animate-duration) * 2.6);
    animation-timing-function: ease-in-out, ease-in-out;
    animation-delay: var(--animate-delay), 0s;
    animation-iteration-count: var(--animate-repeat), var(--animate-repeat);
    animation-fill-mode: both, both;
  }
}
</style>
