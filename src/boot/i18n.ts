import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export default boot(({ app }) => {
  //get the last user language stored in browser if not set it
  const i18n = createI18n({
    locale: localStorage.getItem('userLang') ?? 'ar',
    fallbackLocale: 'ar',
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
