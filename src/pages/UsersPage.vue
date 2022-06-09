<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <UsersTable
      v-if="!loading"
      :title="$t('users')"
      :data="users"
      :cols="columns()"
      @update="getUsers"
    />
  </q-page>
</template>

<script setup lang="ts">
// import { User } from '../types/user';
import { ref, inject, onBeforeMount } from 'vue';
import UsersTable from '../components/users/UsersTable.vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useI18n } from 'vue-i18n';
// import { useRouter } from 'vue-router';
import { TableColumn } from '../interfaces/TableColumn';
// import { useQuasar } from 'quasar';
// const $q = useQuasar();
// const router = useRouter();
const api: AxiosInstance | undefined = inject('api');
const { t } = useI18n();
const users = ref([]);
const loading = ref(true);

const getUsers = () => {
  api
    ?.get('users', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res: AxiosResponse) => {
      users.value = res.data;
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
  getUsers();
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
    field: 'fullname',
    sortable: true,
    align: 'left',
  },
  {
    name: 'username',
    label: t('username'),
    field: 'username',
    sortable: true,
    align: 'left',
  },
  {
    name: 'email',
    label: t('email'),
    field: 'email',
    sortable: true,
    align: 'left',
  },
  {
    name: 'User Group',
    label: t('usergroup'),
    field: (row): string => t(row.group.name),
    sortable: true,
    align: 'left',
  },
  {
    name: 'status',
    label: t('status'),
    field: (row) => (row.status ? t('active') : t('inactive')),
    sortable: false,
    align: 'center',
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
