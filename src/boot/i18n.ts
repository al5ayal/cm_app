import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';
export const i18n = createI18n({
  locale:  'ar',
  fallbackLocale: 'ar',
  messages,
});
export default boot(({ app }) => {
  //get the last user language stored in browser if not set it

  // Set i18n instance on app
  app.provide('i18n', i18n);
  app.use(i18n);
});
