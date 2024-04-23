import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Hello Web',
  titleTemplate: ':title - Hello Web',
  description: '網頁技術文章',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'VitePress | Vite & Vue Powered Static Site Generator' }],
    ['meta', { property: 'og:site_name', content: 'Hello Web' }],
    ['meta', { property: 'og:image', content: '/apple-touch-icon.png' }],
    ['meta', { property: 'og:url', content: 'https://hello-web-docs-nu.vercel.app/' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '技術文章', link: '/deep-cant-use-with-fragments-and-teleport' },
    ],
    // 文章側邊欄
    sidebar: [
      {
        text: '技術文章',
        collapsed: false,
        items: [
          { text: '解決子元件有多元素和 Teleport 在 root 時，父組件會無法使用 :deep() 去附加樣式', link: '/deep-cant-use-with-fragments-and-teleport' },
        ],
      },
    ],

    // TOC
    outline: 'deep',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    /** 本地搜尋 */
    search: {
      provider: 'local',
    //   provider: 'algolia',
    //   options: {
    //     appId: '1B7KUMWSIR',
    //     apiKey: '28d78ddebb3cc285c6398fe631445cd7',
    //     indexName: 'Hello Web',
    //   },
    },
    /** 上次更新時間 */
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    /** 文檔頁腳 */
    docFooter: {
      prev: '前一篇',
      next: '下一篇',
    },
  },
  cleanUrls: true,
})
