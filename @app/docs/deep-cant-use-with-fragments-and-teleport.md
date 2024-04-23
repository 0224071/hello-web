<script lang="ts" setup>
    import { ref } from "vue"
    import DemoWrapper from "../web-static/components/doc-ex/wrapper.vue"
    import NoDeepFragments from "../web-static/components/doc-ex/deep-cant-use/no-deep-child-fragments.vue"
    import DeepFragments1 from "../web-static/components/doc-ex/deep-cant-use/deep-child-fragments-1.vue"
    import DeepFragments2 from "../web-static/components/doc-ex/deep-cant-use/deep-child-fragments-2.vue"
    import DeepTeleport1 from "../web-static/components/doc-ex/deep-cant-use/deep-child-teleport-1.vue"
    import NoDeepChildTeleport from "../web-static/components/doc-ex/deep-cant-use/no-deep-child-teleport.vue"

    const isShow1 = ref(false)
    const isShow2 = ref(false)
</script>

# 解決 Vue 父組件無法影響子組件樣式的方法

Vue 提供了一個 [scoped CSS](https://vuejs.org/api/sfc-css-features.html#deep-selectors) 的機制，讓我們可以將樣式限定在組件範圍內，從而避免全域汙染的問題。然而，當我們想要在父組件中影響子組件的樣式時，也就是透過`:deep()`([Deep Selectors](https://vuejs.org/api/sfc-css-features.html#deep-selectors))時，可能會遇到一些 scoped CSS 的限制。接下來就來介紹那些限制以及如何解決。

## scoped css 的限制

### [Fragment](https://v3-migration.vuejs.org/new/fragments#fragments)

::: code-group

```vue:line-numbers [parent.vue]
<!-- parent.vue -->
<template>
  <child />
</template>

<style lang="scss" scoped>
:deep() .content {
  color: green; // [!code highlight]
}
</style>
```

```vue:line-numbers [child.vue]
<!-- child.vue -->
<template>
  <div class="content"> <!-- [!code highlight] -->
    子元件
  </div>
  <div class="content"> <!-- [!code highlight] -->
    子元件
  </div>
</template>

<style lang="scss" scoped>
.content {
  color: red;
}
</style>
```

:::
::: raw
<DemoWrapper>
<NoDeepFragments></NoDeepFragments>
</DemoWrapper>
:::

可以看到 parent 的 css 並沒有作用到 child 上，原因是 scope id 沒有被繼承到 child 的每個根元素上

::: info
:bulb:這邊 Fragment 之所以無法使用 `:deep()` 是因為 Fragment 會被編譯成多個根元素，而 `:deep()` 跟 attribute inheritance 一樣只能作用在單一根元素上。

因為怕會被汙染，原因可以看下面的範例

```vue:line-numbers
<!-- child.vue -->
<template>
  <!-- 如果屬性和 scoped id 能被 Fragment 繼承的話，除了 child.vue，更有可能污染到其他元件 -->
  <ComponentA />
  <!-- 被影響 -->
  <ComponentB />
  <!-- 被影響 -->
</template>
```

:::

### [Teleport](https://vuejs.org/guide/built-ins/teleport.html#teleport)

::: code-group

```vue:line-numbers [parent.vue]
<!-- parent.vue -->
<template>
  <child />
</template>

<style lang="scss" scoped>
:deep() .content {
  color: green; // [!code highlight]
}
</style>
```

```vue:line-numbers [child.vue]
<!-- child.vue -->
<template>
  <Teleport to="body"> <!-- [!code highlight] -->
    <div class="content">
      子元件
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.content {
  color: red;
}
</style>
```

::: code-group
::: raw
<DemoWrapper>
<button @click="isShow1=true" :class="$style.button">點我</button>
<NoDeepChildTeleport v-model:is-show="isShow1" />
</DemoWrapper>

<style module>
.button {
  display: block;
  margin-bottom: 10px;
  padding: 5px 10px;
  background: #32363f;
  color: rgba(255, 255, 245, 0.86);
  cursor: pointer;
  &:hover {
    background: lighten(#32363f, 10%);
  }
}
</style>

:::

這樣一樣 parent 的 css 並沒有作用到 child 上，原因是 Teleport 可以將元素移動到其他地方，所以 scope id 一樣怕會被汙染到其他地方

## 解決方法

### 1. 使用全域 CSS。

Teleport:white_check_mark:、Fragment:white_check_mark:

```css
/* global.css */
.content {
  color: green;
}
```

### 2. 調整組件結構

- Fragment:white_check_mark:

<!-- eslint-skip -->

```vue:line-numbers
<!-- parent.vue -->
<template>
  <div>  <!-- [!code ++]-->
    <child />
  </div> <!-- [!code ++]-->
</template>
<style lang="scss" scoped>
  :deep() .content {
    color: green;
  }
</style>
```

::: raw
<DemoWrapper>
<DeepFragments1></DeepFragments1>
</DemoWrapper>
:::
原本父組件沒有任何 html 元素，所以 scope id 沒有地方放，因此增加一個 div 讓 scope id 插入

- Teleport:x:

> 暫時沒有辦法只用調整組件結構解決

### 3. 手動傳遞 scope id

概念跟我們使用禁用 [Attribute Inheritance](https://vuejs.org/guide/components/attrs#disabling-attribute-inheritance) 後，手動傳遞 attribute 一樣，這邊我們可以手動傳遞 scope id

我們寫一個 function 專門用來取得 scope id

```ts:line-numbers
// use-scope-id.ts
import { type ConcreteComponent, computed, getCurrentInstance } from 'vue'

type ConcreteComponentWithScopeId = ConcreteComponent & { __scopeId: string | undefined }
export function useScopeId() {
  const instance = getCurrentInstance()

  // 當前組件的 scope id
  const scopeId = instance?.vnode.scopeId // [!code highlight]
  // 父組件的 scope id。取得使用 Teleport 和 Fragment 當根元素時，傳不進來的 scope id
  const parentScopedId = (instance?.parent?.type as ConcreteComponentWithScopeId).__scopeId // [!code highlight]

  return {
    parentScopedId,
    scopeId,
  }
}

```

取出 scope id 後，我們就可以手動傳遞 scope id 了

- Fragment

::: code-group

```vue:line-numbers [parent.vue]
<!-- parent.vue -->
<template>
  <child />
</template>

<style lang="scss" scoped>
:deep() .content { // [!code --]
.content { // [!code ++]
  color: green;
}
</style>

```

```vue:line-numbers [child.vue]
<!-- child.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useScopeId } from '../../../composables/doc-ex/use-scope-id'

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
```

:::

::: raw
<DemoWrapper>
<DeepFragments2></DeepFragments2>
</DemoWrapper>
:::

- Teleport

::: raw
<DemoWrapper>
<button @click="isShow2=true" :class="$style.button">點我</button>
<DeepTeleport1 v-model:is-show="isShow2" />
</DemoWrapper>

<style module>
.button {
  display: block;
  margin-bottom: 10px;
  padding: 5px 10px;
  background: #32363f;
  color: rgba(255, 255, 245, 0.86);
  cursor: pointer;
  &:hover {
    background: lighten(#32363f, 10%);
  }
}
</style>

:::
