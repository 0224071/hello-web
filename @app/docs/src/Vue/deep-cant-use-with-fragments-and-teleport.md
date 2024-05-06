<script lang="ts" setup>
    import { ref } from "vue"

    import DemoWrapper from "../../../web-static/src/components/doc-ex/wrapper.vue"
    import NoDeepFragments from "../../../web-static/src/components/doc-ex/deep-cant-use/no-deep-child-fragments.vue"
    import DeepFragments1 from "../../../web-static/src/components/doc-ex/deep-cant-use/deep-child-fragments-1.vue"
    import DeepFragments2 from "../../../web-static/src/components/doc-ex/deep-cant-use/deep-child-fragments-2.vue"
    import DeepTeleport1 from "../../../web-static/src/components/doc-ex/deep-cant-use/deep-child-teleport-1.vue"
    import NoDeepChildTeleport from "../../../web-static/src/components/doc-ex/deep-cant-use/no-deep-child-teleport.vue"

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

```vue:line-numbers{3-9,13,16} [child.vue]
<!-- child.vue -->
<script setup lang="ts">
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

```vue:line-numbers{3-9,16} [child.vue]
<!-- child.vue -->
<script setup lang="ts">
const { parentScopedId } = useScopeId()
const parentScopedAttribute = computed(() => {
  if (!parentScopedId)
    return {}

  return { [parentScopedId]: '' }
})
</script>

<template>
  <Teleport to="body">
    <div
      class="content"
      v-bind="{ ...parentScopedAttribute }"
    >
      子元件
    </div>
  </Teleport>
</template>
```

:::

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

## [Playground](https://element-plus.run/#eyJzcmMvQXBwLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGgyPlxuICAgIEZyYWdtZW50XG4gIDwvaDI+XG4gIDxEZW1vRnJhZ21lbnQ+PC9EZW1vRnJhZ21lbnQ+XG4gIDxoMj5cbiAgICBUZWxlcG9ydFxuICA8L2gyPlxuICA8YnV0dG9uIEBjbGljaz1cImlzU2hvdz10cnVlXCI+6bue5oiRPC9idXR0b24+XG4gIDxEZW1vVGVsZXBvcnQgdi1tb2RlbDppcy1zaG93PVwiaXNTaG93XCI+PC9EZW1vVGVsZXBvcnQ+XG4gIFxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gXCJ2dWVcIlxuaW1wb3J0IERlbW9GcmFnbWVudCBmcm9tIFwiLi9kZW1vRnJhZ21lbnRQYXJlbnQudnVlXCJcbmltcG9ydCBEZW1vVGVsZXBvcnQgZnJvbSBcIi4vZGVtb1RlbGVwb3J0UGFyZW50LnZ1ZVwiXG5cbmNvbnN0IGlzU2hvdyA9IHJlZihmYWxzZSlcbjwvc2NyaXB0PlxuXG48c3R5bGUgc2NvcGVkPlxuLmVsLXBvcG92ZXIuZWwtcG9wcGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcblxufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7fVxufSIsInRzY29uZmlnLmpzb24iOiJ7XG4gIFwiY29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICBcInRhcmdldFwiOiBcIkVTTmV4dFwiLFxuICAgIFwianN4XCI6IFwicHJlc2VydmVcIixcbiAgICBcIm1vZHVsZVwiOiBcIkVTTmV4dFwiLFxuICAgIFwibW9kdWxlUmVzb2x1dGlvblwiOiBcIkJ1bmRsZXJcIixcbiAgICBcInR5cGVzXCI6IFtcImVsZW1lbnQtcGx1cy9nbG9iYWwuZC50c1wiXSxcbiAgICBcImFsbG93SW1wb3J0aW5nVHNFeHRlbnNpb25zXCI6IHRydWUsXG4gICAgXCJhbGxvd0pzXCI6IHRydWUsXG4gICAgXCJjaGVja0pzXCI6IHRydWVcbiAgfSxcbiAgXCJ2dWVDb21waWxlck9wdGlvbnNcIjoge1xuICAgIFwidGFyZ2V0XCI6IDMuM1xuICB9XG59XG4iLCJzcmMvdXNlU2NvcGVJZC50cyI6ImltcG9ydCB7IHR5cGUgQ29uY3JldGVDb21wb25lbnQsIGNvbXB1dGVkLCBnZXRDdXJyZW50SW5zdGFuY2UgfSBmcm9tICd2dWUnXHJcblxyXG50eXBlIENvbmNyZXRlQ29tcG9uZW50V2l0aFNjb3BlSWQgPSBDb25jcmV0ZUNvbXBvbmVudCAmIHsgX19zY29wZUlkOiBzdHJpbmcgfCB1bmRlZmluZWQgfVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlU2NvcGVJZCgpIHtcclxuICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXHJcblxyXG4gIC8vIOeVtuWJjee1hOS7tueahCBzY29wZSBpZFxyXG4gIGNvbnN0IHNjb3BlSWQgPSBpbnN0YW5jZT8udm5vZGUuc2NvcGVJZCBcclxuICAvLyDniLbntYTku7bnmoQgc2NvcGUgaWTjgILlj5blvpfkvb/nlKggVGVsZXBvcnQg5ZKMIEZyYWdtZW50IOeVtuagueWFg+e0oOaZgu+8jOWCs+S4jemAsuS+hueahCBzY29wZSBpZFxyXG4gIGNvbnN0IHBhcmVudFNjb3BlZElkID0gKGluc3RhbmNlPy5wYXJlbnQ/LnR5cGUgYXMgQ29uY3JldGVDb21wb25lbnRXaXRoU2NvcGVJZCkuX19zY29wZUlkIFxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcGFyZW50U2NvcGVkSWQsXHJcbiAgICBzY29wZUlkLFxyXG4gIH1cclxufSIsInNyYy9kZW1vRnJhZ21lbnRQYXJlbnQudnVlIjoiPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cclxuaW1wb3J0IENoaWxkIGZyb20gXCIuL2RlbW9GcmFnbWVudENoaWxkLnZ1ZVwiXHJcbjwvc2NyaXB0PlxyXG5cclxuPHRlbXBsYXRlPlxyXG4gIDxjaGlsZCAvPlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHN0eWxlICBzY29wZWQ+XHJcbi5jb250ZW50IHtcclxuICBjb2xvcjogZ3JlZW47IFxyXG59XHJcbjwvc3R5bGU+Iiwic3JjL2RlbW9GcmFnbWVudENoaWxkLnZ1ZSI6IjxzY3JpcHQgc2V0dXAgbGFuZz1cInRzXCI+XHJcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyB1c2VTY29wZUlkIH0gZnJvbSAnLi91c2VTY29wZUlkJ1xyXG5cclxuY29uc3QgeyBwYXJlbnRTY29wZWRJZCB9ID0gdXNlU2NvcGVJZCgpXHJcbmNvbnN0IHBhcmVudFNjb3BlZEF0dHJpYnV0ZSA9IGNvbXB1dGVkKCgpID0+IHtcclxuICBpZiAoIXBhcmVudFNjb3BlZElkKVxyXG4gICAgcmV0dXJuIHt9XHJcblxyXG4gIHJldHVybiB7IFtwYXJlbnRTY29wZWRJZF06ICcnIH1cclxufSlcclxuXHJcbjwvc2NyaXB0Pj5cclxuPHRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJjb250ZW50XCIgdi1iaW5kPVwiey4uLnBhcmVudFNjb3BlZEF0dHJpYnV0ZX1cIj4gXHJcbiAgICDlrZDlhYPku7ZcclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiY29udGVudFwiIHYtYmluZD1cInsuLi5wYXJlbnRTY29wZWRBdHRyaWJ1dGV9XCI+IFxyXG4gICAg5a2Q5YWD5Lu2XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgIHNjb3BlZD5cclxuLmNvbnRlbnQge1xyXG4gIGNvbG9yOiByZWQ7XHJcbn1cclxuPC9zdHlsZT4iLCJzcmMvZGVtb1RlbGVwb3J0UGFyZW50LnZ1ZSI6IjxzY3JpcHQgc2V0dXAgbGFuZz1cInRzXCI+XHJcbmltcG9ydCBDaGlsZCBmcm9tICcuL2RlbW9UZWxlcG9ydENoaWxkLnZ1ZSdcclxuXHJcbmNvbnN0IGlzU2hvdyA9IGRlZmluZU1vZGVsPGJvb2xlYW4+KCdpc1Nob3cnLCB7XHJcbiAgcmVxdWlyZWQ6IHRydWUsXHJcbn0pXHJcbjwvc2NyaXB0PlxyXG5cclxuPHRlbXBsYXRlPlxyXG4gIDxDaGlsZCB2LW1vZGVsOmlzLXNob3c9XCJpc1Nob3dcIiAvPlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHN0eWxlICBzY29wZWQ+XHJcbi5jb250ZW50IHtcclxuICBjb2xvcjogZ3JlZW47XHJcbn1cclxuPC9zdHlsZT5cclxuIiwic3JjL2RlbW9UZWxlcG9ydENoaWxkLnZ1ZSI6IjxzY3JpcHQgc2V0dXAgbGFuZz1cInRzXCI+XHJcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyB1c2VTY29wZUlkIH0gZnJvbSAnLi91c2VTY29wZUlkJ1xyXG5cclxuY29uc3QgaXNTaG93ID0gZGVmaW5lTW9kZWw8Ym9vbGVhbj4oJ2lzU2hvdycsIHtcclxuICByZXF1aXJlZDogdHJ1ZSxcclxufSlcclxuXHJcbmNvbnN0IHsgcGFyZW50U2NvcGVkSWQgfSA9IHVzZVNjb3BlSWQoKVxyXG5cclxuY29uc3QgcGFyZW50U2NvcGVkQXR0cmlidXRlID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gIGlmICghcGFyZW50U2NvcGVkSWQpXHJcbiAgICByZXR1cm4ge31cclxuXHJcbiAgcmV0dXJuIHsgW3BhcmVudFNjb3BlZElkXTogJycgfVxyXG59KVxyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8VGVsZXBvcnQgdG89XCJib2R5XCI+XHJcbiAgICA8ZGl2XHJcbiAgICAgIHYtc2hvdz1cImlzU2hvd1wiXHJcbiAgICAgIGNsYXNzPVwiY29udGVudCBkZW1vLWNvbnRlbnRcIlxyXG4gICAgICB2LWJpbmQ9XCJ7IC4uLnBhcmVudFNjb3BlZEF0dHJpYnV0ZSB9XCJcclxuICAgID5cclxuICAgICAg5a2Q5YWD5Lu2XHJcbiAgICAgIDxidXR0b24gIEBjbGljaz1cImlzU2hvdyA9IGZhbHNlXCI+XHJcbiAgICAgICAg6bue5oiR6Zec6ZaJXHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9UZWxlcG9ydD5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzdHlsZSBzY29wZWQ+XHJcblxyXG5cclxuLmNvbnRlbnQge1xyXG4gIGNvbG9yOiByZWQ7XHJcbn1cclxuLmRlbW8tY29udGVudCB7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHRvcDogNTAlO1xyXG4gIGxlZnQ6IDUwJTtcclxuICB6LWluZGV4OiA5OTk5OTk5OTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICB3aWR0aDogNDAwcHg7XHJcbiAgaGVpZ2h0OiA0MDBweDtcclxuICBmb250LXNpemU6IDMwcHg7XHJcbiAgYmFja2dyb3VuZDogI2JiYjtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxufVxyXG5cclxuXHJcbjwvc3R5bGU+XHJcbiIsIl9vIjp7fX0=)

## 參考資料

- https://vuejs.org/
- https://github.com/vuejs/core/issues/2669
