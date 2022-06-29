<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white" style="min-width: 70vw">
        <q-bar>
          {{
            $t(props.type) +
            ' ' +
            $t('student') +
            ' ' +
            (props.student?.name ?? $t('new'))
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
                  v-model="formData.name"
                  :label="$t('name') + ' *'"
                  :hint="$t('name')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('cannot_be_empty'),
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="text"
                  v-model="formData.qualification"
                  label="المؤهل"
                  lazy-rules
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="tel"
                  v-model="formData.phone"
                  :label="$t('phone')"
                  :hint="$t('phone')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        val.match(
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                        )) ||
                      'رقم الهاتف غير صحيح',
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="text"
                  v-model="formData.nid"
                  label="رقم الهوية"
                  lazy-rules
                  :rules="[
                    (val) =>
                      /^(\s*|\d+)$/.test(val) || 'رقم الهوية مكون من أرقام فقط',
                  ]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-start q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="email"
                  v-model="formData.email"
                  :label="$t('email')"
                  lazy-rules
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-between q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <!-- row -->
                <q-toggle
                  v-model="formData.active"
                  :label="$t('studentstatus')"
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
                  <q-btn :label="$t('save')" type="submit" color="primary" />
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
import { StudentRequest } from 'src/interfaces/students';
import { inject, ref } from 'vue';
// import { studentouter } from 'vue-router';
const api: AxiosInstance | undefined = inject('api');
// const router = studentouter();
const props = defineProps({
  dialog: Boolean,
  type: String,
  student: Object,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
// const studentgroups = ref([]);
const errors = ref(null);

const formData = ref<StudentRequest>({
  name: props.student?.name,
  phone: props.student?.phone,
  nid: props.student?.nid ?? 0,
  email: props.student?.email,
  qualification: props.student?.age,
  active: props.student?.active ?? 0,
});

function onSubmit() {
  //check type then decide
  let url = 'students';
  if (props.type == 'edit') {
    url = 'students/' + props.student?.id;
    api
      ?.put(url, formData.value)
      .then((res: AxiosResponse) => {
        if (res.data) {
          emit('saved', res.data);
        }
      })
      .catch((err: AxiosError) => {
        errors.value = err?.response?.data;
      });
  } else {
    api
      ?.post(url, formData.value)
      .then((res: AxiosResponse) => {
        if (res.data) {
          emit('saved', res.data);
        }
      })
      .catch((err: AxiosError) => {
        errors.value = err?.response?.data;
      });
  }
}
</script>
