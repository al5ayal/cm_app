<template>
  <q-layout view="lHh Lpr lFf">
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

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> {{ $t('mainMenu') }}</q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />

        <q-item>
          <q-item-section avatar>
            <q-icon name="language" />
          </q-item-section>

          <q-item-section>
            <!-- <q-item-label>{{ $t('language') }}</q-item-label> -->
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
        </q-item>

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
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useQuasar } from 'quasar';
import languages from 'quasar/lang/index.json';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/mainStore';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const $q = useQuasar();
const lang = ref(localStorage.getItem('userLang'));
const drawerOpen = ref(false);
const i18n = useI18n();

const appLanguages = languages.filter((lang) => {
  return ['ar', 'en-US'].includes(lang.isoName);
});

const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}));

const router = useRouter();
async function logout() {
  if (await authStore.logout()) {
    router.push({
      name: 'login',
    });
  }
}
onMounted(() => {
  import('quasar/lang/' + lang.value).then((lang) => {
    $q.lang.set(lang.default);
  });
});
watch(lang, (val) => {
  import('quasar/lang/' + val).then((lang) => {
    $q.lang.set(lang.default);
  });

  i18n.locale.value = lang.value == 'ar' ? 'ar' : 'en-US';

  localStorage.setItem('userLang', i18n.locale.value);
});

// function changeLang(locale: string) {
//   i18n.locale.value = locale;

//   localStorage.setItem('userLang', locale);
//   // appStore.changeLang(locale);
//   //workign needs to be in store or not since it`s global
//   // but for sure needs to be in the localstorage
//   // there is useLocalStorage from '@vueuse/localStorage'
// }
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];
</script>
