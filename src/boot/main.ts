import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { useAuthStore } from '../stores/mainStore';

declare global {
  interface Window {
    backApi: Record<string, unknown>;
  }
}
export default boot(({ app, router }) => {
  //app injecting globals
  app.config.globalProperties.backApi = window.backApi;
  app.provide('backApi', window.backApi);
  //register pinia :: getActive pinia was called with no active pnina
  // Set i18n instance on app
  app.use(createPinia());
  // auth store
  const authStore = useAuthStore();
  // middleware
  router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !authStore.user) {
      console.error(authStore.user);
      console.error('is not auth');
      next({ name: 'login' });
    } else if (to.name == 'login' && authStore.user) {
      next({ name: 'home' });
    } else {
      console.error('is otherrr auth');
      next();
    }
  });
});
