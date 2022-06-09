// import { Delegate } from './../interfaces/delegate';
import { UserData } from '../interfaces/user';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') ?? '')
      : null,
    network_error: false,
  }),
  getters: {
    // user: () => JSON.parse(localStorage.getItem("user")),
  },
  actions: {
    login: async function (user: UserData | null) {
      try {
        localStorage.setItem('user', JSON.stringify(user)); //suppose to be user data

        this.user = user ?? null; //will be user data
        return true;
      } catch (error) {
        return await error;
      }
    },
    logout: async function (): Promise<boolean | string> {
      try {
        // console.error('loging out');
        localStorage.removeItem('user'); //suppose to be user data

        this.user = null; //will be user data
        return true;
      } catch (error: unknown) {
        // showTooltip(error);
        // let the form component display the error
        // console.log(error);
        return 'error logging out';
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
      locale: 'ar',
      failContent: false,
      currentDelegate: undefined,
      taxRatio: 0.15,
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
