// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    [
      '@nuxtjs/eslint-module',
      {
        formatter: 'stylish',
      },
    ],
    '@pinia/nuxt',
    [
      '@nuxtjs/supabase',
      {
        // Options
      },
    ],
    [
      '@invictus.codes/nuxt-vuetify',
      {
        // 独自のテーマを設定する場合、テーマ名はCSSに出力されるので短い単語がベスト
        vuetifyOptions: {
          //   theme: {
          //     defaultTheme: 'myTheme',
          //     themes: {
          //       myTheme: {
          //         dark: false,
          //         colors: {
          //           main0: '#192a61',
          //           main1: '#1c03a2',
          //           main2: '#4443ff',
          //           main3: '#628cff',
          //           accent1: '#ff8000',
          //           accent2: '#ffac7c',
          //           info: '#ac80ff',
          //           link: '#0fa17e',
          //           download: '#11691f',
          //           success: '#2bb60c',
          //           warning: '#efb819',
          //           error: '#d80329',
          //           white: '#FFF',
          //           black: '#000',
          //           dark: '#224466',
          //           gray: '#babac9',
          //           back: '#EDF2F7',
          //         },
          //       },
          //     },
          //   },
        },
        moduleOptions: {
          treeshaking: true,
          useIconCDN: true,
          styles: 'sass',
          autoImport: true,
        },
      },
    ],
  ],
  css: ['@/assets/main.scss'],
});
