<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white" style="min-width: 85vw">
        <q-bar>
          {{ $t('newsubscription') }}
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

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit">
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm col-12">
                <q-select
                  v-model="formData.type"
                  :options="types"
                  :label="$t('type')"
                  :option-label="(opt) => $t(opt)"
                />
              </div>
              <div class="col-sm col-12">
                <q-select
                  v-model="formData.rel"
                  :options="rels"
                  :label="$t('relation')"
                  :option-label="(opt) => $t(opt)"
                />
              </div>
              <div class="col-sm col-12" v-if="formData.rel == 'delegate'">
                <q-select
                  v-model="formData.delegate_id"
                  :options="delegates"
                  :label="$t('delegate')"
                  option-label="name"
                  option-value="id"
                  clearable
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('selectdelagte')]"
                />
              </div>
            </div>
            <!-- row -->
            <div class="row justify-between q-gutter-xs q-col-gutter-md">
              <div class="col-sm-6 col-12">
                <q-select
                  v-model="selectedCohort"
                  :options="cohorts"
                  :label="$t('cohort')"
                  option-label="name"
                  :error-message="$t('cohortExist')"
                  :error="errors?.cohort?.length > 0"
                />
              </div>
              <div class="col-sm-2 col-12 self-center text-center">
                <q-btn
                  class="float-left"
                  :label="$t('add')"
                  type="button"
                  color="primary"
                  @click="addToMenu"
                  :disable="!selectedCohort"
                />
              </div>
              <div class="col-sm-3 col-12 self-center">
                <q-input
                  class="q-field"
                  type="date"
                  :label="$t('dueDate')"
                  v-model="formData.due_date"
                  placeholder="dd-mm-yyyy"
                  min="2022-01-01"
                  max="2030-12-31"
                />
              </div>
            </div>
            <!-- row -->
            <div
              class="row justify-around q-my-md"
              v-if="formData.details?.length"
            >
              <div class="col-12">
                <order-items-table
                  :items="formData.details"
                  @removeItem="removeItem"
                />
              </div>
            </div>
            <!-- row -->
            <div
              class="column justify-center items-center q-col-gutter-sm q-mt-sm"
            >
              <div class="col">
                <div>
                  <q-btn
                    :label="$t('save')"
                    :loading="loading"
                    type="submit"
                    color="primary"
                    :disabled="!formData.details?.length"
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
import { inject, onMounted, ref, watch } from 'vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Delegate } from '../../../interfaces/delegate';
import { Cohort, OrderRequest } from '../../../interfaces/orders';
import OrderItemsTable from './OrderItemsTable.vue';
// import { studentouter } from 'vue-router';
const api: AxiosInstance | undefined = inject('api');
// const router = studentouter();
const props = defineProps({
  dialog: Boolean,
  student_id: Number,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const loading = ref(false);
const rels = ['direct', 'delegate'];
const types = ['new', 'renew'];
const errors = ref<Record<string, string>>({});
const selectedCohort = ref<Cohort>();
const cohorts = ref<Array<Cohort>>([]);
const delegates = ref<Array<Delegate>>([]);

const formData = ref<OrderRequest>({
  student_id: Number(props?.student_id),
  type: 'new',
  rel: 'direct',
  delegate_id: null,
  tax: 0,
  total_amount: 0,
  due_date: '2022-05-20',
  details: [],
});

function addToMenu() {
  if (!selectedCohort.value) return;
  if (
    formData.value.details?.find(
      (item) => item.name == selectedCohort?.value?.name
    )
  ) {
    errors.value.cohort = 'cohortExist';
    return;
  } else {
    errors.value.cohort = '';
  }
  const item: Record<string, unknown> = {
    index: Number(formData?.value?.details?.length) + 1,
    cohort_id: selectedCohort?.value?.id,
    name: selectedCohort?.value?.name,
    price: Number(selectedCohort?.value?.price),
    discount: 0,
    tax: (Number(selectedCohort?.value?.price) * 0.15).toFixed(2),
    total_amount: Number(selectedCohort?.value?.price),
  };

  formData?.value?.details?.push(item);
  formData.value.due_date = selectedCohort?.value?.end_date as string;
  selectedCohort.value = undefined;
}
watch(formData.value, () => {
  formData.value.tax = Number(
    formData.value.details
      ?.reduce((total, item) => total + Number(item.tax), 0)
      .toFixed(2)
  );

  formData.value.total_amount = Number(
    formData.value.details
      ?.reduce((total, item) => total + Number(item.total_amount), 0)
      .toFixed(2)
  );
  // console.log('watcher data changed');
});

function removeItem(index: number) {
  const indx: typeof index = Number(
    formData?.value?.details?.findIndex((item) => item.index == index)
  );
  formData?.value?.details?.splice(indx, 1);
}

onMounted(() => {
  //get delagtes list
  api
    ?.get('delegates')
    .then((res: AxiosResponse) => {
      if (res.data) {
        delegates.value = res.data;
      }
    })
    .catch((err: AxiosError) => {
      errors.value = JSON.stringify(err?.response?.data);
    });
  //get cohorts list
  api
    ?.get('cohorts')
    .then((res: AxiosResponse) => {
      if (res.data) {
        cohorts.value = res.data;
      }
    })
    .catch((err: AxiosError) => {
      errors.value = JSON.stringify(err?.response?.data);
    });
});
function onSubmit() {
  loading.value = true;
  //check type then decide clean up
  let orderData = JSON.parse(JSON.stringify(formData.value));

  orderData.details = orderData.details.filter((item) => {
    delete item.index;
    delete item.name;
    delete item.tax;
    delete item.total_amount;
    return item;
  });

  api
    ?.post('orders', orderData)
    .then((res: AxiosResponse) => {
      if (res.data) {
        emit('saved', res.data);
        loading.value = false;
      }
    })
    .catch((err: AxiosError) => {
      errors.value.from = JSON.stringify(err?.response?.data);
      loading.value = false;
    });
}
</script>
