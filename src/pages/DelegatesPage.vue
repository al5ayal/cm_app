<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <DelegatesTable
      v-if="!loading"
      :title="$t('delegates')"
      :data="delegates"
      @update="getStudents"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, inject, onBeforeMount } from 'vue';
import DelegatesTable from '../components/delegates/DelegatesTable.vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance | undefined = inject('api');
const delegates = ref([]);
const loading = ref(true);

const getStudents = () => {
  api
    ?.get('delegates', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res: AxiosResponse) => {
      delegates.value = res.data;
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
  getStudents();
});
</script>

<style></style>
