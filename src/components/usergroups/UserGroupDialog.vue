<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
      :full-width="true"
    >
      <q-card class="bg-white">
        <q-bar>
          {{
            $t(props.type) +
            ' ' +
            $t('group') +
            ' ' +
            (props.group?.name ?? $t('new'))
          }}
          <q-space />
          <q-btn
            dense
            flat
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup @click="emit('close')">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-xs">
          <p>{{ errors }}</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-12">
                <q-input
                  filled
                  v-model="formData.name"
                  :label="$t('name') + ' *'"
                  :hint="$t('name')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('cannot_be_empty'),
                  ]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-12">
                <q-checkbox
                  v-model="allPerms"
                  val="all"
                  label="كل الصلاحيات"
                  color="red"
                  true-value="all"
                  false-value=""
                />
                <p v-if="allPerms.length">{{ $t('allPermsNote') }}</p>
              </div>
              <template v-if="!allPerms.length">
                <div
                  class="col-sm-6 col-12"
                  v-for="(pl, index) in policiesList"
                  :key="index"
                >
                  <h6 class="text-h6 q-ma-none">{{ $t(pl.toLowerCase()) }}</h6>
                  <q-checkbox
                    v-model="abilities"
                    :val="`show${pl}`"
                    :label="$t('show') + ` ${$t(pl.toLowerCase())}`"
                    color="green"
                    size="xs"
                  />
                  <q-checkbox
                    v-model="abilities"
                    :val="`create${pl}`"
                    :label="$t('create') + ` ${$t(pl.toLowerCase())}`"
                    color="teal"
                    size="xs"
                  />
                  <q-checkbox
                    v-model="abilities"
                    :val="`edit${pl}`"
                    :label="$t('edit') + ` ${$t(pl.toLowerCase())}`"
                    color="blue"
                    size="xs"
                  />
                  <q-checkbox
                    v-model="abilities"
                    :val="`delete${pl}`"
                    :label="$t('delete') + ` ${$t(pl.toLowerCase())}`"
                    color="red"
                    size="xs"
                  />
                </div>
                <!-- col-12 -->
              </template>
            </div>
            <!-- row -->
            <div class="column justify-center items-center q-col-gutter-sm">
              <div class="col">
                <div>
                  <q-btn
                    :label="$t('save')"
                    type="submit"
                    color="primary"
                    :loading="loading"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { UserGroupRequest } from 'src/interfaces/user';
import { inject, ref } from 'vue';
// import { useRouter } from 'vue-router';
const api: AxiosInstance | undefined = inject('api');
const loading = ref<boolean>(false);
const props = defineProps({
  dialog: Boolean,
  type: String,
  group: Object,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const abilities = ref<Array<string>>(props.group?.abilities?.split(',') ?? []);
const allPerms = ref('');
const errors = ref('');

const policiesList: Array<string> = [
  'Users',
  'Students',
  'Delegates',
  'Courses',
  'Cohorts',
  'Reports',
];

const formData = ref<UserGroupRequest>({
  name: props.group?.name,
  abilities: abilities.value.join(','), //split into array
});

function onSubmit() {
  loading.value = true;
  // before all convert formData.abilities onto join by comma string
  if (allPerms.value.length) {
    formData.value.abilities = allPerms.value;
  } else {
    formData.value.abilities = abilities.value.join(',');
  }
  //check type then decide

  let url = 'usergroups';
  if (props.type == 'edit') {
    url = 'usergroups/' + props.group?.id;
    api
      ?.put(url, formData.value)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        emit('saved', res.data);
        loading.value = false;
      })
      .catch((err: AxiosError) => {
        console.error(err);
        errors.value = JSON.stringify(err?.response?.data);
        loading.value = false;
      });
  } else {
    api
      ?.post(url, formData.value)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        emit('saved', res.data);
        loading.value = false;
      })
      .catch((err: AxiosError) => {
        console.error(err);
        errors.value = JSON.stringify(err?.response?.data);
        loading.value = false;
      });
  }
}
</script>
