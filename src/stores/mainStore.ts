import { User } from './../types/user';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') ?? '{}')
      : null,
  }),
  getters: {
    // user: () => JSON.parse(localStorage.getItem("user")),
  },
  actions: {
    login: async function (user: User | null) {
      try {
        // this.user = await api.post({ login, password });
        // showTooltip(`Welcome back ${this.userData.name}!`);
        localStorage.setItem('user', JSON.stringify({ user })); //suppose to be user data

        this.user = user ?? null; //will be user data
        return true;
      } catch (error) {
        // showTooltip(error);
        // let the form component display the error
        return await error;
      }
    },
    logout: async function () {
      try {
        console.error('loging out');
        localStorage.removeItem('user'); //suppose to be user data

        this.user = null; //will be user data
        return true;
      } catch (error) {
        // showTooltip(error);
        // let the form component display the error
        return await error;
      }
    },
  },
  // hydrate(storeState, initialState) {
  //   // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
  //   storeState.user = useLocalStorage('user', null);
  // },
});

export const useAppStore = defineStore('appStore', {
  state: () => {
    return {
      locale: localStorage.getItem('userLang') ?? 'ar',
    };
  },
  actions: {
    changeLang: async function (localeV: string) {
      console.error('change lang from store');
      try {
        localStorage.setItem('userLang', localeV); //suppose to be user data
        this.locale = localeV; //will be user data
        // const i18n = useI18n();
        const { locale } = useI18n({ useScope: 'global' });
        locale.value = localeV;
        return true;
      } catch (error) {
        // showTooltip(error);
        // let the form component display the error
        return await error;
      }
    },
  },
});
