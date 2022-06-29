<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-bar>
          {{
            $t(props.type) +
            ' ' +
            $t('user') +
            ' ' +
            (props.user?.fullname ?? $t('new'))
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

        <q-card-section>
          <p class="text-red">
            <span v-for="(error, index) in errors" :key="index">
              <span v-for="(msg, index) in error" :key="index">{{ msg }}</span>
            </span>
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  v-model="formData.fullname"
                  :label="$t('fullname') + ' *'"
                  :hint="$t('fullname')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('cannot_be_empty'),
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  v-model="formData.username"
                  :label="$t('username') + `*`"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || $t('cannot_be_empty'),
                  ]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="password"
                  v-model="formData.password"
                  :label="$t('password')"
                  :hint="$t('password')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (props.type !== 'edit' && val.length >= 8) ||
                      'كلمة المرور لا تقل عن 8 أحرف أو ارقام',
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="password"
                  v-model="formData.password_confirmation"
                  :label="$t('confirmpassword')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (props.type !== 'edit' && val == formData.password) ||
                      'كلمة المرور غير متطابقة',
                  ]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="email"
                  v-model="formData.email"
                  :label="$t('email')"
                  :hint="$t('email')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'لا يمكن ترك البريد فارغا',
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-select
                  clearable
                  filled
                  color="light-green-10"
                  v-model="formData.user_group_id"
                  :options="usergroups"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  label="مجموعة المستخدم"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-between q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <!-- row -->
                <q-toggle
                  v-model="formData.status"
                  :label="$t('userstatus')"
                  :false-value="0"
                  :true-value="1"
                  color="green"
                  left-label
                />
              </div>
            </div>
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
import { UserRequest } from 'src/interfaces/user';
import { inject, onMounted, ref } from 'vue';
// import { useRouter } from 'vue-router';
const api: AxiosInstance | undefined = inject('api');
// const router = useRouter();
const props = defineProps({
  dialog: Boolean,
  type: String,
  user: Object,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const loading = ref(false);
const usergroups = ref([]);
const errors = ref([]);

onMounted(() => {
  api
    ?.get('usergroups', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res: AxiosResponse) => {
      usergroups.value = res.data;
    })
    .catch((err: AxiosError) => {
      // console.error(err);
      if (err) {
      }
    });
});

const formData = ref<UserRequest>({
  fullname: props.user?.fullname,
  username: props.user?.username,
  email: props.user?.email,
  password: '',
  password_confirmation: '',
  user_group_id: props.user?.user_group_id ?? 1,
  status: props.user?.status ?? 0,
});

function onSubmit() {
  //check type then decide

  loading.value = true;
  let url = 'users';
  if (props.type == 'edit') {
    if (formData.value.password == '' || !formData.value.password?.length) {
      delete formData.value.password;
      delete formData.value.password_confirmation;
    }
    url = 'users/' + props.user?.id;
    api
      ?.put(url, formData.value)
      .then((res: AxiosResponse) => {
        if (res.data) {
          emit('saved', res.data);
          loading.value = false;
        }
      })
      .catch((err: AxiosError) => {
        errors.value = err?.response?.data;
        loading.value = false;
      });
  } else {
    api
      ?.post(url, formData.value)
      .then((res: AxiosResponse) => {
        if (res.data) {
          emit('saved', res.data);
          loading.value = false;
        }
      })
      .catch((err: AxiosError) => {
        errors.value = err?.response?.data;
        loading.value = false;
      });
  }
}

// function close() {
//   emit('close');
//   console.log(emit);
// }
</script>
