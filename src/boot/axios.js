import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useAuthStore, useAppStore } from '../stores/mainStore';

let headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

//should pass token from here one

const api = axios.create({
  // baseURL: '/cm_api/public/api/', //fro remote host
  // baseURL: 'https://al5ayal.com/fasttrack/public/api/', //fro remote host
  baseURL: 'http://192.168.100.13:8000/api/',
  withCredentials: true,
  crossDomain: true,
  headers,
});

// let user = JSON.parse(localStorage.getItem('user'));

export default boot(({ app, router }) => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  // let user = JSON.parse(localStorage.getItem('user'));
  api.interceptors.request.use(
    function (config) {
      const token = authStore.user?.accessToken ?? null;
      // console.log('form interceptors requests ' + token);
      // Do something before request is sent
      if (token && token !== '') {
        config.headers.Authorization = 'Bearer ' + token;
        // console.error('Access token good');
      } else {
        // console.error('not good token');
        // if (authStore.logout()) {
        //   router.push('/login');
        // }
      }
      // console.error('not good token');
      return config;
    },
    function (error) {
      // console.error('errror from request interceptors');
      // Do something with request error
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    function (response) {
      authStore.network_error = false;
      // authStore.setNetwork(false);
      if (response.status == 401) {
        alert('You are not authorized');
        // console.log('unauth from interceptors');
      }
      return response;
    },
    (error) => {
      //check if axios netowrk error
      if (error.response == undefined) {
        // console.log(error);
        // console.log('network error');
        // netowrk error notify store and layout popup
        authStore.network_error = true;
        // authStore.setNetwork(true);
      }
      if (error.response && error.response.status === 401) {
        if (error.response.data.message == 'Unauthenticated.') {
          //user data isnot valid any mores
          if (authStore.logout()) {
            //pupup session ended please login
            router.push('/login');
          }
        } else {
          // it`s just an authorized so take him home
          router.push('/');
        }
      }
      if (error.response && error.response.status === 404) {
        //user data isnot valid any mores
        appStore.failContent = true;
      }
      return Promise.reject(error);
    }
  );
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.provide('axios', axios);
  // app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  app.provide('api', api);
  // app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api };
