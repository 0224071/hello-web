<template>
  <div class="demo">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.demo {
  position: relative;
  padding: 2em;
  margin-bottom: 10px;
  font-size: var(--vt-doc-code-font-size);
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  transition: background-color 0.5s;
}
</style>
