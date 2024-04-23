<script setup lang="ts">
import { computed } from 'vue'
import { useScopeId } from '@/composables/doc-ex/use-scope-id'

const { parentScopedId } = useScopeId()
const parentScopedAttribute = computed(() => {
  if (!parentScopedId)
    return {}
  return { [parentScopedId]: '' }
})
</script>

<template>
  <div class="content" v-bind="{ ...parentScopedAttribute }">
    子元件
  </div>
  <div class="content" v-bind="{ ...parentScopedAttribute }">
    子元件
  </div>
</template>

<style lang="scss" scoped>
.content {
  color: red;
}
</style>
