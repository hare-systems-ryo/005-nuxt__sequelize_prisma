<script setup lang="ts">
// [ com-api ]
const storeApp = useStoreApp();
// ----------------------------------------------------------------------------
definePageMeta({
  layout: 'app',
  middleware: ['app', 'app-check-login'],
});
useHead({
  title: 'Test',
});
const apiTest = async () => {
  const { data, error } = await useFetch('/api/test', {
    method: 'get',
    headers: useRequestHeaders(['cookie']),
  });
  if (error.value || !data.value) {
    return storeApp.err('apiTest : Error >> ' + error.value);
  }
  const res = data.value;
  if (res.result !== true) {
    return storeApp.err('apiTest : Error >> ' + data.value.message);
  }
  storeApp.log('apiTest : Completed!' + data.value.message);
};
</script>
<template>
  <div class="">
    <v-container class="bg-white">
      <div class="" style="display: flex">
        <v-btn color="primary" to="/">Home</v-btn>
      </div>
    </v-container>
    <v-container class="bg-white mt-3">
      <v-btn color="primary" @click="apiTest">apiTest</v-btn>
    </v-container>
    <div class="py-10"></div>
    <div class="py-10"></div>
  </div>
</template>

<style lang="scss" scoped>
.aspect-container {
  position: relative;
  &::before {
    content: '';
    display: block;
    position: relative;
    padding-top: 66.66%;
  }
  > * {
    position: absolute;
    inset: 0 0 0 0;
  }
}
</style>
utils/com
