<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        {{ props.title }}
        <q-btn
          :label="$t('addstudent')"
          class="float-right text-capitalize text-indigo-8 shadow-3"
          icon="person"
          @click="addDialog = true"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table :rows="props.data" :columns="columns()" row-key="name">
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
              :to="`/student/${props.row.id}`"
            />
            <q-btn
              icon="edit"
              size="sm"
              flat
              dense
              @click="editStudent(props.row)"
            />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click="deleteStudent(props.row.id, props.row.name)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <students-dialog
    v-if="editDialog"
    :dialog="editDialog"
    @close="close()"
    type="edit"
    :student="selectedStudent"
    @saved="saved"
  />
  <students-dialog
    v-if="addDialog"
    :dialog="addDialog"
    @close="close()"
    type="add"
    @saved="saved"
  />
</template>

<script setup lang="ts">
import { User } from '../../interfaces/user';
import { inject, ref } from 'vue';
import StudentsDialog from './StudentsDialog.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { TableColumn } from '../../interfaces/TableColumn';
const api: AxiosInstance | undefined = inject('api');
const emit = defineEmits(['update']);
const $q = useQuasar();
const { t } = useI18n();
const editDialog = ref(false);
const addDialog = ref(false);
const selectedStudent = ref({});
const props = defineProps({
  title: String,
  data: Array,
});

function editStudent(user: User) {
  selectedStudent.value = user;
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

function deleteStudent(id: number, name: string) {
  // confrim first then delete
  $q.dialog({
    title: t('confirm'),
    message: `${t('studentDeleteConfirm')} ${name}`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    //send delete
    api
      ?.delete(`/students/${id}`)
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

const columns = (): Array<TableColumn> => [
  {
    name: 'id',
    label: t('index'),
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
    name: 'Age',
    label: t('age'),
    field: 'age',
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

<style scoped></style>
