<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <CohortsTable
      v-if="!loading"
      :title="$t('cohorts')"
      :data="cohorts"
      @update="getCohorts"
    />
  </q-page>
</template>

<script setup lang="ts">
// import { User } from '../types/user';
import { ref, inject, onBeforeMount } from 'vue';
import CohortsTable from '../components/cohorts/CohortsTable.vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
// import { useRouter } from 'vue-router';

// import { useQuasar } from 'quasar';
// const $q = useQuasar();
// const router = useRouter();
const api: AxiosInstance | undefined = inject('api');
const cohorts = ref([]);
const loading = ref(true);

const getCohorts = () => {
  api
    ?.get('cohorts')
    .then((res: AxiosResponse) => {
      cohorts.value = res.data;
      loading.value = false;
    })
    .catch((err: AxiosError) => {
      if (err) {
      }
      // console.log(err);
      // console.error(err.response);
    });
};

onBeforeMount(() => {
  getCohorts();
});
</script>

<style></style>
