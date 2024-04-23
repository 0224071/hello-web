<script setup lang="ts">
import ChildTeleport from './child-teleport.vue'

const isShow = defineModel<boolean>('isShow', {
  required: true,
})
</script>

<template>
  <ChildTeleport v-model:is-show="isShow" />
</template>

<style lang="scss" scoped>
:deep() .content {
  color: green;
}
</style>
