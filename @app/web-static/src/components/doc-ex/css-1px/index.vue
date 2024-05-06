<script setup lang="ts">
const topPathStyles = ["29px", "49px", "81px", "120px", "150px", "180px"];
</script>

<template>
  <div class="line-group">
    <div v-for="style in topPathStyles" :key="style" :style="{ top: style }" />
  </div>
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
</style>
