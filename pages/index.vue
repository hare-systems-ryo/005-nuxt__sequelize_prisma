<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['app', 'app-check-login'],
});
useHead({
  title: 'Home',
});
const storeApp = useStoreApp();
const logout = () => {
  const user = useSupabaseUser();
  const client = useSupabaseAuthClient();
  client.auth.signOut();
  storeApp.log('logout : OK >> email >> ' + user.value?.email);
  setTimeout(() => {
    useRouter().push('/login');
  }, 800);
};
// ----------------------------------------------------------------------------
</script>
<template>
  <div class="">
    <v-container class="bg-white">
      <div class="" style="display: flex">
        <v-btn color="primary" to="/test" class="mx-1">test</v-btn>
        <v-btn color="primary" to="/web-log" class="mx-1">web-log</v-btn>
        <v-btn color="primary" class="ms-auto" @click="logout">logout</v-btn>
      </div>
      <test>AAAA</test>
      <div>
        {{ Hoge('fuge') }}
      </div>
    </v-container>
    <v-container class="bg-white mt-3">
      <div class="" style="display: flex">
        <v-btn color="primary" class="ms-auto" @click="storeApp.log('')">Log Push</v-btn>
      </div>
    </v-container>
  </div>
</template>
<style lang="scss" scoped></style>
