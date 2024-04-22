// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [],
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier',
  },
}, {
  // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
  files: ['**/*.vue'],
  rules: {
    // https://eslint.vuejs.org/rules/block-lang.html
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts',
        },
        style: {
          lang: 'scss',
        },
      },
    ],
    // https://eslint.vuejs.org/rules/require-prop-types.html
    'vue/require-prop-types': 'error',
    // https://future-architect.github.io/eslint-plugin-vue-scoped-css/rules/enforce-style-type.html
    'vue-scoped-css/enforce-style-type': 'error',
  },
})
