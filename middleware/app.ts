export default defineNuxtRouteMiddleware((to, from) => {
  const storeApp = useStoreApp();
  if (process.client) {
    storeApp.log(`router :[from:${from.fullPath} ] >> [to:${to.fullPath} ] `);
  } else {
    console.log(`router :[from:${from.fullPath} ] >> [to:${to.fullPath} ] `);
  }
});
