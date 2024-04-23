<script setup lang="ts">
import ChildFragments from './child-fragments.vue'
</script>

<template>
  <ChildFragments />
</template>

<style lang="scss" scoped>
:deep() .content {
  color: green;
}
</style>
