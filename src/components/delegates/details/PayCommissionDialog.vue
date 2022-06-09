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
          {{ $t('pay_comm') }}
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
          <div
            class="row justify-around q-col-gutter-sm"
            v-if="Object.keys(errors).length"
          >
            {{ errors.paying }}
          </div>
          <q-form @submit="onSubmit">
            <div class="row justify-around q-col-gutter-sm">
              <div class="col-sm-6 col-12">
                <q-select
                  v-model="formData.order_id"
                  :options="orders"
                  option-label="id"
                  option-value="id"
                  emit-value
                  :label="$t('chooseInvoiceTransaction')"
                  :rules="[(val) => val || $t('chooseInvoiceTransaction')]"
                  @update:model-value="getOrderDetails"
                />
              </div>
              <div class="col-sm-6 col-12">
                <q-select
                  v-model="formData.paymentType"
                  :options="paymentTypes"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  :label="$t('paymentType')"
                  :rules="[(val) => val || $t('choosepaymentType')]"
                />
              </div>
            </div>
            <!-- row -->
            <div
              class="row justify-between q-gutter-sm q-col-gutter-md"
              v-if="formData.order_id"
            >
              <div class="col-sm col-12 text-center">
                <q-field filled :label="$t('baseAmount')" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ selectedOrder.delegate_commission }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col-sm col-12 text-center">
                <q-field filled :label="$t('payments')" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ selectedOrder.paid_commission }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col-sm col-12 text-center">
                <q-field filled :label="$t('remaining')" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      <q-chip
                        v-if="
                          Number(selectedOrder.delegate_commission) -
                            Number(selectedOrder.paid_commission) <=
                          0
                        "
                        outline
                        color="green-10"
                        text-color="white"
                        icon-right="bookmark"
                      >
                        {{ $t('payDone') }}
                      </q-chip>
                      <span v-else>
                        {{
                          (
                            Number(selectedOrder.delegate_commission) -
                            Number(selectedOrder.paid_commission)
                          ).toFixed(2)
                        }}
                      </span>
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
            <!-- row -->
            <div
              class="row justify-start q-gutter-sm q-col-gutter-md"
              v-if="
                formData.order_id &&
                Number(selectedOrder.delegate_commission) -
                  Number(selectedOrder.paid_commission) >
                  0
              "
            >
              <div class="col-sm col-12">
                <q-radio
                  v-model="payAmount"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="full"
                  :label="$t('payFull')"
                />
                <q-radio
                  v-model="payAmount"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="part"
                  :label="$t('payPart')"
                />
              </div>
              <div class="col-sm col-12">
                <q-field
                  filled
                  :label="$t('duePayAmount')"
                  stack-label
                  v-if="payAmount == 'full'"
                >
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ formData.amount }}
                    </div>
                  </template>
                </q-field>
                <q-input
                  v-if="payAmount == 'part'"
                  outlined
                  v-model.number="formData.amount"
                  type="number"
                  lang="en"
                  step="0.01"
                  :label="$t('duePayAmount')"
                  :rules="[
                    (val) =>
                      Number(val) <= Number(paymentLimit.toFixed(2)) ||
                      `المبلغ المسموح دفعه لا يمكن أن يزيد عن ${paymentLimit.toFixed(
                        2
                      )}`,
                  ]"
                />
              </div>
              <div class="col-sm col-12 text-center">
                <q-input
                  v-model="formData.note"
                  autogrow
                  type="text"
                  outlined
                  :label="$t('transactionNote')"
                />
              </div>
            </div>
            <!-- row -->
            <div
              class="column q-col-gutter-sm q-mt-sm"
              v-if="formData.order_id"
            >
              <small class="text-red">
                ملحوظة المبلغ المحدد / الواجب دفعة لا يمكن ان يزيد عن
                {{ paymentLimit.toFixed(2) }} وهو نسبة قيمة العمولة من إجمالى
                المحصل من الطالب
              </small>
            </div>
            <!-- row -->
            <div
              class="column justify-center items-center q-col-gutter-sm q-mt-sm"
            >
              <div class="col">
                <div>
                  <q-btn
                    :label="$t('pay')"
                    type="submit"
                    color="primary"
                    :loading="loading"
                    :disabled="!formData.order_id || Number(paymentLimit) <= 0"
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
import { computed, ComputedRef, inject, onBeforeMount, ref, watch } from 'vue';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Order, OrderPayRequest } from '../../../interfaces/orders';
// import { studentouter } from 'vue-router';
const api: AxiosInstance | undefined = inject('api');
// const router = studentouter();
const props = defineProps({
  dialog: Boolean,
  orders: Array,
  delegate_id: Number,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const payAmount = ref('full');
const paymentTypes = ref([]);
const paymentLimit = ref(0);
const errors = ref<Record<string, string>>({});
const orderDetails = ref({});
const formData = ref<OrderPayRequest>({
  account_id: Number(props?.delegate_id),
  amount: 0,
  order_id: undefined,
  note: '',
  paymentType: undefined,
});

const loading = ref<boolean>(false);

onBeforeMount(() => {
  //get orders list
  api
    ?.get('accounts/parent/payable')
    .then((res: AxiosResponse) => {
      if (res.data) {
        paymentTypes.value = res.data;
      }
    })
    .catch((err: AxiosError) => {
      errors.value.paymentTypes = JSON.stringify(err?.response?.data);
    });
  //get cohorts list
});

function onSubmit() {
  //check type then decide clean up
  loading.value = true;

  api
    ?.post('delegates/pay', formData.value)
    .then((res: AxiosResponse) => {
      if (res.data) {
        emit('saved', res.data);
        loading.value = false;
      }
    })
    .catch((err: AxiosError) => {
      errors.value.paying = JSON.stringify(err?.response?.data);
      loading.value = false;
    });
}

function getOrderDetails(val: number) {
  api
    ?.get(`orders/${val}`)
    .then((res: AxiosResponse) => {
      if (res.data) {
        orderDetails.value = res.data;
      }
    })
    .catch((err: AxiosError) => {
      errors.value.from = JSON.stringify(err?.response?.data);
    });
}

const selectedOrder: ComputedRef<Order> = computed<Order>(
  () =>
    props?.orders?.find(
      (order) => order.id === formData.value.order_id
    ) as Order
);

watch([() => formData.value.order_id, payAmount], () => {
  formData.value.note = `صرف دفعة من عمولة فاتورة رقم ${Number(
    formData.value?.order_id
  )}`;
  if (payAmount.value == 'part') {
    formData.value.note = `صرف دفعة من عمولة فاتورة رقم ${Number(
      formData.value?.order_id
    )}`;
  }
  if (payAmount.value == 'full') {
    formData.value.note = ` مبلغ عمولة فاتورة رقم ${Number(
      formData.value?.order_id
    )}`;
  }

  //delegate commission - paid commission
  const payableCommission: number =
    Number(selectedOrder.value.paid_amount) /
    Number(selectedOrder.value?.total_amount - selectedOrder.value?.tax);

  paymentLimit.value =
    Number(selectedOrder.value.delegate_commission) * payableCommission -
    Number(selectedOrder.value.paid_commission);
  formData.value.amount = Number(paymentLimit.value.toFixed(2));
});
</script>
