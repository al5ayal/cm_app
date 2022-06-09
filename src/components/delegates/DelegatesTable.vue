<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        {{ props.title }}
        <q-btn
          label="إضافة مندوب جديد"
          class="float-right text-capitalize text-indigo-8 shadow-3"
          icon="person"
          @click="addDialog = true"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table
        :rows="tableData"
        :columns="columns()"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:top-left>
          <q-input type="search" v-model="filter" placeholder="بحث">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div>
              <q-badge
                :color="props.row.status ? 'green' : 'red'"
                :label="props.value"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-Action="props">
          <q-td :props="props">
            <q-btn
              icon="visibility"
              size="sm"
              flat
              dense
              :to="`/delegate/${props.row.id}`"
            />
            <q-btn
              icon="edit"
              size="sm"
              flat
              dense
              @click="editDelegate(props.row)"
            />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click="deleteDelegate(props.row.id, props.row.name)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <delegates-dialog
    v-if="editDialog"
    :dialog="editDialog"
    @close="close()"
    type="edit"
    :delegate="selectedDelegate"
    @saved="saved"
  />
  <delegates-dialog
    v-if="addDialog"
    :dialog="addDialog"
    @close="close()"
    type="add"
    @saved="saved"
  />
</template>

<script setup lang="ts">
import { User } from '../../interfaces/user';
import { TableColumn } from '../../interfaces/TableColumn';
import { inject, ref, watch } from 'vue';
import DelegatesDialog from './DelegatesDialog.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
const api: AxiosInstance | undefined = inject('api');
const emit = defineEmits(['update']);
const $q = useQuasar();
const { t } = useI18n();
const editDialog = ref(false);
const addDialog = ref(false);
const selectedDelegate = ref({});
const props = defineProps({
  title: String,
  data: Array,
});

const loading = ref(false);
const filter = ref('');
const tableData = ref(props.data);

function editDelegate(user: User) {
  selectedDelegate.value = user;
  editDialog.value = true;
}

function close() {
  editDialog.value = false;
  addDialog.value = false;
}
function saved(data: { message: string; error?: boolean }) {
  if (!data.message.length || data.error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: JSON.stringify(data),
      position: 'top',
    });
  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: t(data.message),
      position: 'top',
    });
    emit('update');
    editDialog.value = false;
    addDialog.value = false;
  }
}

function deleteDelegate(id: number, name: string) {
  // confrim first then delete
  $q.dialog({
    title: t('confirm'),
    message: `${t('deleteConfirm')} ${name}`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    //send delete
    api
      ?.delete(`/delegates/${id}`)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        saved(res.data);
      })
      .catch((err: AxiosError) => {
        console.error(err?.response?.data);
        saved({ error: true, message: JSON.stringify(err?.response?.data) });
      });
  });
}

watch(filter, (vale) => {
  search(vale);
});

function search(txt: string) {
  loading.value = true;
  //filter and search
  if (!txt.length) {
    tableData.value = props.data;
    loading.value = false;
  }
  if (filter.value.length >= 3) {
    api
      ?.get(`/delegates/find?txt=${txt}`)
      .then((res: AxiosResponse) => {
        tableData.value = res.data;
        loading.value = false;
        // console.log(res.data);
      })
      .catch((err: AxiosError) => {
        console.error(err?.response?.data);
        loading.value = false;
      });
  }
}

const columns = (): Array<TableColumn> => [
  {
    name: 'id',
    label: t('index'),
    field: 'id',
    sortable: true,
    align: 'left',
  },
  {
    name: 'name',
    label: t('name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'nid',
    label: 'رقم الهوية',
    field: 'nid',
    sortable: true,
    align: 'left',
  },
  {
    name: 'phone',
    label: t('phone'),
    field: 'phone',
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
    name: 'commission_type',
    label: t('commission_type'),
    field: 'commission_type',
    sortable: true,
    align: 'center',
  },
  {
    name: 'commission_amount',
    label: t('commission_amount'),
    field: 'commission_amount',
    sortable: true,
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

<style scoped></style>
