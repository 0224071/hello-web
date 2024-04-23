<script setup lang="ts">
import ChildTeleport from './child-teleport-add-scope-id.vue'

const isShow = defineModel<boolean>('isShow', {
  required: true,
})
</script>

<template>
  <ChildTeleport v-model:is-show="isShow" />
</template>

<style lang="scss" scoped>
.content {
  color: green;
}
</style>
