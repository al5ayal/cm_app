<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="() => (drawerOpen = !drawerOpen)"
        />

        <q-toolbar-title>
          {{ $t('AppName') }}
        </q-toolbar-title>

        <!-- <div>version: 0.0.1</div> -->
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Menu"
          @click="() => (drawerOpen = !drawerOpen)"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> {{ $t('mainMenu') }}</q-item-label>
        <MainMenuItems />
        <!-- <q-item>
          <q-item-section avatar>
            <q-icon name="language" />
          </q-item-section>

          <q-item-section>
            <q-select
              v-model="lang"
              :options="langOptions"
              :label="$t('langChangeDesc')"
              dense
              borderless
              emit-value
              map-options
              options-dense
              style="min-width: 150px"
            />
          </q-item-section>
        </q-item> -->

        <q-item clickable @click="logout()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            {{ $t('logout') }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="!appStore.failContent" />
      <content-not-found v-else />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { QSpinnerGears, useQuasar, useMeta, QSpinnerFacebook } from 'quasar';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import MainMenuItems from '../components/MainMenuItems.vue';
import ContentNotFound from '../components/ContentNotFound.vue';
// import languages from 'quasar/lang/index.json';
import { useAuthStore, useAppStore } from '../stores/mainStore';
import { useRouter } from 'vue-router';
// import ExpandNavLink from 'src/components/ExpandNavLink.vue';

const authStore = useAuthStore();
const appStore = useAppStore();
const $q = useQuasar();
// const lang = ref(localStorage.getItem('userLang')); //should ref the store
const drawerOpen = ref(false);
const i18n = useI18n();
const api: AxiosInstance | undefined = inject('api');

// const appLanguages = languages.filter((lang) => {
//   return ['ar', 'en-US'].includes(lang.isoName);
// });

// const langOptions = appLanguages.map((lang) => ({
//   label: lang.nativeName,
//   value: lang.isoName,
// }));

const router = useRouter();
async function logout() {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'red',
    spinnerSize: 140,
    backgroundColor: 'blue',
    message: 'جاري تسجيل الخروج ,فضلا إنتظر',
    messageColor: 'black',
  });

  api
    ?.post('logout')
    .then(async (res: AxiosResponse) => {
      // console.log(res);
      if (res.status == 200) {
        const loggedout = await authStore.logout();
        if (loggedout) {
          router.push({
            name: 'login',
          });
          $q.loading.hide();
        }
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.status);
      $q.loading.hide();
    });
}

watch(
  () => authStore.network_error,
  (val) => {
    if (val) {
      $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        messageColor: 'black',
        backgroundColor: 'yellow',
        html: true,
        message:
          i18n.t('netError') +
          `<br> <br> <button class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-secondary text-white q-btn--actionable q-focusable q-hoverable q-btn--active" tabindex="0" type="button" onclick="location.reload()"><span class="q-focus-helper"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block">${i18n.t(
            'reload'
          )}</span><i class="q-icon on-right notranslate material-icons" aria-hidden="true" role="img">replay</i></span></button>`,
      });
    } else {
      $q.loading.hide();
    }
  }
);

const metaData = {
  // sets document title
  title: i18n.t('AppName'),
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => title,

  // meta tags
  meta: {
    description: { name: 'description', content: 'Page 1' },
    keywords: { name: 'keywords', content: 'Quasar website' },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle: string) {
        return `${ogTitle} - ${metaData.title}`;
      },
    },
  },

  // <noscript> tags
  noscript: {
    default: 'Your browser is not supported',
  },
};
useMeta(metaData);
</script>
