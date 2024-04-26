// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DefaultLayout from './layouts/index.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultLayout, null, {
      'aside-outline-after': () => h('div', { }, 'Before'),
    })
  },
  enhanceApp() {
    // ...
  },
} satisfies Theme
