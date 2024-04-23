import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Hello Web',
  titleTemplate: ':title - Custom Suffix',
  description: '紀錄和分享網頁開發的點點滴滴',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '技術文章', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: '技術文章',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '解決子元件有多元素和 Teleport 在 root 時，父組件會無法使用 :deep() 去附加樣式', link: '/deep-cant-use-with-fragments-and-teleport' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
