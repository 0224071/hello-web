<script lang="ts" setup>
  import Css1px from "../../web-static/src/components/doc-ex/css-1px/index.vue"
  import Example1 from "../../web-static/src/components/doc-ex/css-1px/example1.vue"
  import Example2 from "../../web-static/src/components/doc-ex/css-1px/example2.vue"
  import DemoWrapper from "../../web-static/src/components/doc-ex/wrapper.vue"
</script>

# 解決 CSS 在 1px 粗細不一樣的問題

## 前言

當我們把 absolute 元素的寬度或高度設為 1px 時，有時候會出現不一樣的粗細，主要是因為瀏覽器的解析問題。
[StackOverflow 1](https://stackoverflow.com/questions/73012470/1px-wide-element-looks-thicker-than-a-border-of-1px-width)
[StackOverflow 2](https://stackoverflow.com/questions/28918363/css-1px-border-appear-thicker-on-non-high-density-monitors-retina-with-chrome)
<DemoWrapper>
<css-1px />
</DemoWrapper>

## 解決方法

在元素上加上以下 CSS 即可解決此問題：

```css
.fix-1px {
  transform: scale(0.999999);
}
```

<DemoWrapper>
  <Example1 />
</DemoWrapper>

---

或者使用 border:

```scss
.line-group {
  > div {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px; // [!code --]
    background-color: var(--vp-c-neutral); // [!code --]
    border-top: 1px solid var(--vp-c-neutral); // [!code ++]
  }
}
```

<DemoWrapper>
  <Example2 />
</DemoWrapper>
