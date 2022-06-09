<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white" style="min-width: 75vw">
        <q-bar>
          {{
            $t(props.type) +
            ' ' +
            $t('course') +
            ' ' +
            (props.course?.name ?? $t('new'))
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
            <div class="row justify-start q-col-gutter-sm">
              <div class="col">
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
import { Course } from 'src/interfaces/orders';
import { inject, ref } from 'vue';
const api: AxiosInstance | undefined = inject('api');
const props = defineProps({
  dialog: Boolean,
  type: String,
  course: Object,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const errors = ref('');

const formData = ref<Course>({
  id: props.course?.id,
  name: props.course?.name,
  description: props.course?.description,
});

function onSubmit() {
  //check type then decide
  if (props.type == 'edit') {
    api
      ?.put(`courses/${props.course?.id}`, formData.value)
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
      ?.post('courses', formData.value)
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
