<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        {{ props.title }}
        <q-btn
          label="Export"
          class="float-right text-capitalize text-indigo-8 shadow-3"
          icon="person"
        />
        <q-btn
          label="Add User"
          class="float-right text-capitalize text-indigo-8 shadow-3 q-mx-sm"
          icon="person"
          @click="addDialog = true"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table :rows="props.data" :columns="props.cols" row-key="name">
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
              @click="deleteUser(props.row.id, props.row.fullname)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <users-dialog
    v-if="editDialog"
    :dialog="editDialog"
    @close="close()"
    type="edit"
    :user="selectedUser"
    @saved="saved"
  />
  <users-dialog
    v-if="addDialog"
    :dialog="addDialog"
    @close="close()"
    type="add"
    @saved="saved"
  />
</template>

<script setup lang="ts">
import { User } from '../interfaces/user';
import { inject, ref } from 'vue';
import UsersDialog from './users/UsersDialog.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
const api: AxiosInstance | undefined = inject('api');
const emit = defineEmits(['update']);
const $q = useQuasar();
const i18n = useI18n();
const editDialog = ref(false);
const addDialog = ref(false);
const selectedUser = ref({});
const props = defineProps({
  title: String,
  data: Array,
  cols: [],
});

function editUser(user: User) {
  selectedUser.value = user;
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
      message: i18n.t(data.message),
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
    title: i18n.t('confirm'),
    message: `${i18n.t('deleteConfirm')} ${name}`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    //send delete
    api
      ?.delete(`/users/${id}`)
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
</script>

<style scoped></style>
