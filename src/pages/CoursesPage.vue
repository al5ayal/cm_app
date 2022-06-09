<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <CoursesTable
      v-if="!loading"
      :title="$t('cohorts')"
      :data="courses"
      @update="getCourses"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, inject, onBeforeMount } from 'vue';
import CoursesTable from '../components/courses/CoursesTable.vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
const api: AxiosInstance | undefined = inject('api');
const courses = ref([]);
const loading = ref(true);

const getCourses = () => {
  api
    ?.get('courses')
    .then((res: AxiosResponse) => {
      courses.value = res.data;
      loading.value = false;
    })
    .catch((err: AxiosError) => {
      if (err) {
      }
    });
};

onBeforeMount(() => {
  getCourses();
});
</script>

<style></style>
