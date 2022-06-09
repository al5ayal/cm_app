<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white" style="min-width: 75vw" v-if="courses.length">
        <q-bar>
          {{
            $t(props.type) +
            ' ' +
            $t('cohort') +
            ' ' +
            (props.user?.name ?? $t('new'))
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
          <p>{{ errors }}</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  v-model="formData.name"
                  :label="$t('name') + ' *'"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('cannot_be_empty'),
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  lang="en"
                  step="0.01"
                  type="number"
                  v-model="formData.price"
                  :label="$t('price')"
                  lazy-rules
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm col-12">
                <q-input
                  type="text"
                  v-model="formData.description"
                  :label="$t('description') + ` *`"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || $t('cannot_be_empty'),
                  ]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-start q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-select
                  type="text"
                  v-model="formData.course_id"
                  :options="courses"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  :label="$t('course') + ` *`"
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
                  type="date"
                  v-model="formData.start_date"
                  :label="$t('startDate')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="date"
                  color="light-green-10"
                  v-model="formData.end_date"
                  :label="$t('endDate')"
                />
              </div>
            </div>
            <!-- row -->
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

      <q-card v-else class="bg-white" style="min-width: 60vw">
        <q-bar>
          {{
            $t(props.type) +
            ' ' +
            $t('cohort') +
            ' ' +
            (props.cohort?.name ?? $t('new'))
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
        <q-card-section class="text-center">
          <h6 class="bg-white text-center">{{ $t('noCourses') }}</h6>
          <q-btn to="/courses" :label="$t('clickHere')" color="secondary" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useQuasar } from 'quasar';
import { Cohort } from 'src/interfaces/orders';
import { inject, onBeforeMount, ref } from 'vue';
// import { useRouter } from 'vue-router';
const $q = useQuasar();
const api: AxiosInstance | undefined = inject('api');
// const router = useRouter();
const props = defineProps({
  dialog: Boolean,
  type: String,
  cohort: Object,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const courses = ref([]);
const errors = ref('');

onBeforeMount(() => {
  $q.loading.show({
    message: 'جاري التحميل',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary',
  });
  api
    ?.get('courses')
    .then((res: AxiosResponse) => {
      courses.value = res.data;
      $q.loading.hide();
    })
    .catch((err: AxiosError) => {
      // console.error(err);
      if (err) {
        errors.value = JSON.stringify(err?.response?.data);
        $q.loading.hide();
      }
    });
});

const formData = ref<Cohort>({
  id: props.cohort?.id,
  name: props.cohort?.name,
  description: props.cohort?.description,
  price: props.cohort?.price,
  course_id: props.cohort?.course_id,
  start_date: props.cohort?.start_date ?? '2022-05-20',
  end_date: props.cohort?.start_date ?? '2022-05-20',
});

function onSubmit() {
  //check type then decide
  let url = 'cohorts';
  if (props.type == 'edit') {
    // console.log(formData.value);
    // return;
    api
      ?.put(`cohorts/${props.cohort.id}`, formData.value)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        emit('saved', res.data);
      })
      .catch((err: AxiosError) => {
        console.error(err?.response?.data);
        errors.value = JSON.stringify(err?.response?.data);
      });
  } else {
    api
      ?.post(url, formData.value)
      .then((res: AxiosResponse) => {
        // console.log(res.data);
        emit('saved', res.data);
      })
      .catch((err: AxiosError) => {
        // console.error(err?.response?.data);
        errors.value = JSON.stringify(err?.response?.data);
      });
  }
}
</script>
