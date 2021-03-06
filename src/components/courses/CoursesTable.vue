<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <q-table dense :rows="props.data" :columns="columns()" row-key="name">
        <template v-slot:top>
          <div class="text-h6 text-grey-8">
            {{ props.title }}
          </div>
          <q-space />
          <q-btn
            label="إضافة مقرر جديد"
            class="float-right text-capitalize text-indigo-8 shadow-3"
            icon="person"
            @click="addDialog = true"
          />
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
              icon="edit"
              size="sm"
              flat
              dense
              @click="editUser(props.row)"
            />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click="deleteUser(props.row.id, props.row.name)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <courses-dialog
    v-if="editDialog"
    :dialog="editDialog"
    @close="close()"
    type="edit"
    :course="selectedCohort"
    @saved="saved"
  />
  <courses-dialog
    v-if="addDialog"
    :dialog="addDialog"
    @close="close()"
    type="add"
    @saved="saved"
  />
</template>

<script setup lang="ts">
import { Cohort } from '../../interfaces/orders';
import { TableColumn } from '../../interfaces/TableColumn';
import { inject, ref } from 'vue';
import CoursesDialog from './CoursesDialog.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
const api: AxiosInstance | undefined = inject('api');
const emit = defineEmits(['update']);
const $q = useQuasar();
const { t } = useI18n();
const editDialog = ref(false);
const addDialog = ref(false);
const selectedCohort = ref({});
const props = defineProps({
  title: String,
  data: Array,
  cols: [],
});

function editUser(cohort: Cohort) {
  selectedCohort.value = cohort;
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

function deleteUser(id: number, name: string) {
  // confrim first then delete
  $q.dialog({
    title: t('confirm'),
    message: `${t('deleteConfirm')} ${name}`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    //send delete
    api
      ?.delete(`/cohorts/${id}`)
      .then((res: AxiosResponse) => {
        // console.log(res.data);
        saved(res.data);
      })
      .catch((err: AxiosError) => {
        // console.error(err?.response?.data);
        saved({ error: true, message: JSON.stringify(err?.response?.data) });
      });
  });
}

const columns = (): Array<TableColumn> => [
  {
    name: 'index',
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
    name: 'description',
    label: t('description'),
    field: 'description',
    sortable: true,
    align: 'left',
  },

  //TODO: status detect whether cohort finidhed or not
  // {
  //   name: 'status',
  //   label: t('status'),
  //   field: (row) => (row.status ? t('active') : t('inactive')),
  //   sortable: false,
  //   align: 'center',
  // },

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
