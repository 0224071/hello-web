<script setup lang="ts">
import compare from "./components/compare.vue";

const topPathStyles = ["30px", "50px", "82px"];
const bottomPathStyles = ["31px", "51px", "83px"];
</script>

<template>
  <compare>
    <template #before>
      <div class="line-group">
        <div
          v-for="style in topPathStyles"
          :key="style"
          :style="{ top: style }"
        />
        <div
          v-for="style in bottomPathStyles"
          :key="style"
          :style="{ bottom: style }"
        />
      </div>
    </template>
    <template #after>
      <div class="line-group">
        <div
          v-for="style in topPathStyles"
          :key="style"
          class="fix-1px"
          :style="{ top: style }"
        />
        <div
          v-for="style in bottomPathStyles"
          :key="style"
          class="fix-1px"
          :style="{ bottom: style }"
        />
      </div>
      <div style="text-align: right">加上 transform: scale(0.9999)</div>
    </template>
  </compare>
</template>

<style lang="scss" scoped>
.line-group {
  position: relative;
  width: 100%;
  height: 200px;
  > div {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--vp-c-neutral);
  }
}

.fix-1px {
  transform: scale(0.9999);
}
</style>
