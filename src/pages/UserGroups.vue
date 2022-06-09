<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <UserGroupsTable
      v-if="!loading"
      :title="$t('usergroups')"
      :data="usergroups"
      :cols="columns()"
      @update="getUserGroups"
    />
  </q-page>
</template>

<script setup lang="ts">
// import { User } from '../types/user';
import { ref, inject, onBeforeMount } from 'vue';
import UserGroupsTable from '../components/usergroups/UserGroupsTable.vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useI18n } from 'vue-i18n';
// import { useRouter } from 'vue-router';
import { TableColumn } from '../interfaces/TableColumn';
// import { useQuasar } from 'quasar';
// const $q = useQuasar();
// const router = useRouter();
const api: AxiosInstance | undefined = inject('api');
const { t } = useI18n();
const usergroups = ref([]);
const loading = ref(true);

const getUserGroups = () => {
  api
    ?.get('usergroups', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res: AxiosResponse) => {
      usergroups.value = res.data;
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
  getUserGroups();
});

const columns = (): Array<TableColumn> => [
  {
    name: 'id',
    label: t('----'),
    field: 'id',
    sortable: true,
    align: 'center',
  },
  {
    name: 'name',
    label: t('name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'abilities',
    label: t('abilities'),
    field: 'abilities',
    sortable: true,
    align: 'left',
  },
  {
    name: 'Action',
    label: t('actions'),
    field: 'Action',
    sortable: false,
    align: 'center',
  },
];
</script>

<style></style>
