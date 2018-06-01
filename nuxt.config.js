module.exports = {
  mode: "spa",
  env: {
    baseHistoryUrl: process.env.BASE_HISTORY_URL || "http://localhost:4567/data",
    baseSampleUrl: process.env.BASE_SAMPLE_URL || "http://localhost:4567/samples",
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'd3-history-timeline',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  css: [
    '@/assets/scss/app.scss'
  ],
  modules: [
    '@nuxtjs/axios',
    ['@nuxtjs/bootstrap-vue', { css: false }]
  ]
}
