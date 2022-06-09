<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10 bg-grey-1">
              <q-icon
                name="img:icon.png"
                size="5rem"
                color="blue-5"
                bg-color=""
              />
            </q-avatar>
          </q-card-section>
          <q-card-section class="q-mt-xs">
            <div class="text-center q-pt-lg">
              <div class="col text-h5 text-bold text-blue-9 q-mb-md">
                إدارة معهد المسار السريع
              </div>
              <div class="col text-h6 ellipsis text-blue-8">
                {{ $t('login') }}
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="login-error text-red q-pa-sm" v-if="loginError">
              <p class="ellipsis text-center">
                {{ loginError.message as string }}
              </p>
            </div>
            <q-form class="q-gutter-md" @submit.prevent.stop="login">
              <q-input
                filled
                v-model="username"
                :label="$t('username')"
                lazy-rules
                :rules="[
                  (val) => !!val || 'ادخل البريد الإلكتروني أو اسم المستخدم',
                ]"
                error-message="ادخل البريد الإلكتروني أو اسم المستخدم"
                :error="!!loginError?.errors?.email"
              />

              <q-input
                type="password"
                filled
                v-model="password"
                :label="$t('password')"
                lazy-rules
                :rules="[
                  (val) => !!val || 'أدخل كلمة المرور',
                  (val) =>
                    val.length >= 5 || 'كلمة المرور لا تقل عن 8 حروف أو ارقام',
                ]"
                error-message="أدخل كلمة المرور صحيحة"
                :error="!!loginError?.errors?.password"
              />

              <div>
                <q-btn label="Login" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar, QSpinnerFacebook } from 'quasar';
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/mainStore';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginError } from '../interfaces/loginError';
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const api: AxiosInstance | undefined = inject('api');
// app.provide('backApi', window.backApi);
const loginError = ref<LoginError>();
const username = ref(null);
const password = ref(null);
const login = async () => {
  //show login loader
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'green',
    spinnerSize: 140,
    backgroundColor: 'blue',
    message: 'جاري تسجيل الدخول ,فضلا إنتظر',
    messageColor: 'black',
  });

  api
    ?.post('login', { email: username.value, password: password.value })
    .then(async (res: AxiosResponse) => {
      // console.log(res);
      if (res.status == 200) {
        console.log('res');
        if (await authStore.login(res.data)) {
          router.push({
            name: 'homePage',
          });
          $q.loading.hide();
        }
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.status);
      loginError.value = err.response?.data; //dev only
      $q.loading.hide();
    });
};
onMounted(() => {
  console.log('mounted');
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(-135deg, #2d65ff 0%, #42a5f5b0 100%);
}
</style>
