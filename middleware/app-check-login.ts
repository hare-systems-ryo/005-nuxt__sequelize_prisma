export default defineNuxtRouteMiddleware((to, from) => {
  console.log('middleware app-check-login');
  try {
    const user = useSupabaseUser();
    if (user.value === null) {
      if (process.client) {
        const storeApp = useStoreApp();
        storeApp.err('router : redirect >> login');
      }
      return navigateTo('/login');
    }
  } catch (e: any) {
    console.error(e);
  }
});
