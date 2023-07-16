<script setup lang="ts">
useHead({
  htmlAttrs: { lang: () => 'ja', prefix: 'og: http://ogp.me/ns#' },
  meta: [
    { 'http-equiv': 'refresh', content: '' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0,maximum-scale=1.0' },
    { name: 'keywords', content: () => 'keywords' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#FFF' },
    { hid: 'robots', name: 'robots', content: 'noindex' },
  ],
  link: [],
  script: [],
  noscript: [{ children: 'JavaScript is required' }],
  title: '',
  bodyAttrs: {
    class: () => 'lang-ja',
  },
});
const storeApp = useStoreApp();
// ----------------------------------------------------------------------------
</script>
<template>
  <nuxt-layout>
    <div class="px-6 pt-10">
      <nuxt-page />
    </div>
    <client-only>
      <div class="logs pa-2">
        <template v-for="(row, index) in storeApp.state.logs" :key="index">
          <div class="">{{ row }}</div>
        </template>
      </div>
    </client-only>
  </nuxt-layout>
</template>
<style lang="scss" scoped>
.logs {
  background-color: rgb(163, 50, 15);
  color: rgb(255, 255, 255);
  z-index: 1;
  height: 10em;
  min-width: 30%;
  width: calc(100% - 30px);
  overflow-x: auto;
  overflow-y: auto;
  position: fixed;
  inset: auto 0 0 auto;
  margin: 0 10px 10px 0;
  opacity: 0.8;
}
</style>
