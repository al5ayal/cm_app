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
            $t('delegate') +
            ' ' +
            (props.delegate?.name ?? $t('new'))
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
                  type="tel"
                  v-model="formData.phone"
                  :label="$t('phone')"
                  :hint="$t('phone')"
                  :rules="[
                    (val) =>
                      (val &&
                        val.match(
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                        )) ||
                      $t('invalidPhoneNumber'),
                  ]"
                  lazy-rules
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
                  lazy-rules
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="text"
                  v-model="formData.address"
                  :label="$t('address')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-select
                  filled
                  :options="commission_types"
                  option-value="value"
                  option-label="name"
                  emit-value
                  map-options
                  v-model="formData.commission_type"
                  :label="$t('commission_type')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-input
                  filled
                  type="number"
                  lang="en"
                  step="0.01"
                  v-model="formData.commission_amount"
                  :label="$t('commission_amount')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />
              </div>
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
import { Delegate } from '../../interfaces/delegate';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// import { delegateouter } from 'vue-router';
const { t } = useI18n();
const api: AxiosInstance | undefined = inject('api');
const loading = ref(false);
const props = defineProps({
  dialog: Boolean,
  type: String,
  delegate: Object,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const commission_types = [
  { name: t('percent'), value: '%' },
  { name: t('amount'), value: '+' },
];
// const delegategroups = ref([]);
const errors = ref('');

const formData = ref<Delegate>({
  id: props.delegate?.id,
  name: props.delegate?.name,
  phone: props.delegate?.phone,
  email: props.delegate?.email,
  address: props.delegate?.address,
  commission_type: props.delegate?.commission_type ?? '%',
  commission_amount: props.delegate?.commission_amount ?? 0,
});

function onSubmit() {
  loading.value = true;
  //check type then decide
  let url = 'delegates';
  if (props.type == 'edit') {
    url = 'delegates/' + props.delegate?.id;
    api
      ?.put(url, formData.value)
      .then((res: AxiosResponse) => {
        if (res.data) {
          emit('saved', res.data);
          loading.value = false;
        }
      })
      .catch((err: AxiosError) => {
        errors.value = JSON.stringify(err?.response?.data);
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
        errors.value = JSON.stringify(err?.response?.data);
        loading.value = false;
      });
  }
}
</script>
