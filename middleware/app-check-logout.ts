export default defineNuxtRouteMiddleware((to, from) => {
  console.log('middleware app-check-logout');
  try {
    const storeApp = useStoreApp();
    const user = useSupabaseUser();
    if (user.value !== null) {
      if (process.client) {
        storeApp.err('router : redirect >> home');
      }
      return navigateTo('/');
    }
  } catch (e: any) {
    console.error(e);
  }
});
