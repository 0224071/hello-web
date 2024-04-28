import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
/** 文章選單 */
import { generateSidebar } from 'vitepress-sidebar'

/**
 * sidebar 選項
 * https://vitepress-sidebar.jooy2.com/api
 */
const vitepressSidebarOptions = {
  // 使用文件標題作為標題
  useTitleFromFileHeading: true,
  // 排除文件
  excludeFiles: ['404.md','todo.md'],

  // 摺疊選單
  collapsed: false,
  // 摺疊根組。有 highlighted 效果
  rootGroupCollapsed: false,
  // 根據標題數字排序
  sortMenusOrderNumericallyFromTitle: true,
  capitalizeFirst: true,
}

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
    sidebar: generateSidebar(vitepressSidebarOptions),

    // TOC
    outline: {
      level: 'deep',
      label: '目錄',
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    // ],
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
      text: '上次更新',
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
    /** 外部連結圖示 */
    externalLinkIcon: true,
    darkModeSwitchTitle: '切換深色模式',
    lightModeSwitchTitle: '切換淺色模式',
    lastUpdatedText: '上次更新',
  },
  cleanUrls: true,
  rewrites: {

  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPSidebarItem\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/custom-sidebar-item.vue', import.meta.url),
          ),
        },
      ],
    },
    plugins: [
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'icon',
            enabledCollections: ['tabler'],
          }),
        ],
      }),

      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
    ],
  },

})
