<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <StudentsTable
      v-if="!loading"
      :title="$t('students')"
      :data="students"
      @update="getStudents"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, inject, onBeforeMount } from 'vue';
import StudentsTable from '../components/students/StudentsTable.vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
const api: AxiosInstance | undefined = inject('api');
const students = ref([]);
const loading = ref(true);

const getStudents = () => {
  api
    ?.get('students', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res: AxiosResponse) => {
      students.value = res.data;
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
