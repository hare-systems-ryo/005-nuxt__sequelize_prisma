<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['app', 'app-check-logout'],
});
useHead({
  title: 'Login',
});
const storeApp = useStoreApp();
// -------------------------------------------------------------------------
const email = ref('');
const pass = ref('');
// -------------------------------------------------------------------------
const enjoiUs = async () => {
  const client = useSupabaseAuthClient();
  const { data, error } = await client.auth.signUp({
    email: email.value,
    password: pass.value,
  });
  if (error) {
    return storeApp.log('enjoiUs : error >> ' + email.value + error);
  }
  storeApp.log('次のメールアドレスに認証メールが届きますので認証リンクをクリックしてください。' + email.value);
  setTimeout(() => {
    useRouter().push('/');
  }, 300);
};

const login = async () => {
  const client = useSupabaseAuthClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.value,
    password: pass.value,
  });
  if (error) {
    return storeApp.err('login : error >> ' + email.value + ' ' + error);
  }
  storeApp.log('login : OK >> email >> ' + email.value);
  setTimeout(() => {
    useRouter().push('/');
  }, 300);
};
// ----------------------------------------------------------------------------
</script>
<template>
  <div class="">
    <v-container class="bg-white">
      <div>〇〇アプリ ログイン</div>
      <v-text-field v-model="email" label="email"></v-text-field>
      <v-text-field v-model="pass" label="pass"></v-text-field>
      <div class="" style="display: flex">
        <v-btn color="primary" class="me-auto" :disabled="!pass || !email" @click="enjoiUs">Enjoy us</v-btn>
        <v-btn color="primary" @click="login">Login</v-btn>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped></style>
