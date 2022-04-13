import { defineStore } from 'pinia';

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
    login: async function (user: Record<string, unknown>) {
      try {
        // this.user = await api.post({ login, password });
        // showTooltip(`Welcome back ${this.userData.name}!`);
        localStorage.setItem('user', JSON.stringify({ user })); //suppose to be user data

        this.user = user ?? {}; //will be user data
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
      locale: 'ar',
    };
  },
});
