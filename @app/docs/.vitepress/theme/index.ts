// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DefaultLayout from './layouts/index.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: DefaultLayout,
  enhanceApp() {
    // ...
  },
} satisfies Theme
