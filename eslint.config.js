import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  {
    // 旧Nuxt実装はVue 3への移植完了まで比較用に保持する。
    ignores: [
      'dist/**',
      '.nuxt/**',
      'base_html/**',
      'pages/**',
      'components/**',
      'layouts/**',
      'store/**',
      'modules/**',
      'nuxt.config.js',
      '.eslintrc.js',
    ],
  },
  eslint.configs.recommended,
  ...vue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
