import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Hello Web',
  titleTemplate: ':title - Hello Web',
  description: '網頁技術文章',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'author', content: 'Hello Web' }],
    ['meta', { name: 'keywords', content: '前端, 網頁, 技術部落格, Vue, JavaScript' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '技術文章', link: '/deep-cant-use-with-fragments-and-teleport' },
    ],

    sidebar: [
      {
        text: '技術文章',
        items: [
          { text: '解決子元件有多元素和 Teleport 在 root 時，父組件會無法使用 :deep() 去附加樣式', link: '/deep-cant-use-with-fragments-and-teleport' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    /** 本地搜尋 */
    search: {
    //   provider: 'local',
      provider: 'algolia',
      options: {
        appId: '1B7KUMWSIR',
        apiKey: '28d78ddebb3cc285c6398fe631445cd7',
        indexName: 'Hello Web',
      },
    },
  },
})
