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
          {{ ' إيصال صرف رقم ' + props.receipt?.id }}
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

        <q-card-section class="row bg-grey-2 justify-center">
          <div class="col-11 q-pa-md bg-white shadow-1" ref="receiptbody">
            <div class="row justify-between bg-grey-3 q-pa-none">
              <div class="col q-pa-sm">
                {{ $t('AppName') }} <br />
                FastTrack Institute for Training
              </div>
              <div class="col text-right">
                <q-icon name="school" size="4rem" color="primary" />
              </div>
            </div>
            <q-separator />
            <div
              class="row rounded-borders bordered q-mt-xs q-pa-sm items-end justify-between"
            >
              <div class="col-12 text-center self-center q-ma-none q-pa-none">
                <p
                  class="q-ma-none"
                  style="font-size: 1.2rem; font-weight: bolder"
                >
                  سند صرف
                </p>
                <p class="text-weight-bold q-ma-none">PAYMENT VOUCHER</p>
              </div>
              <div class="col-3 self-start">
                <div class="row justify-between q-gutter-sm">
                  <div class="col text-center">
                    <p class="q-ma-xs">هلله</p>
                    <p class="bg-grey-3">
                      {{ props.receipt?.amount.toString().split('.')[1] ?? 0 }}
                    </p>
                  </div>
                  <div class="col-8 text-center">
                    <p class="q-ma-xs">ريال</p>
                    <p class="bg-grey-3">
                      {{ props.receipt?.amount.toString().split('.')[0] ?? 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-6 text-right self-start">
                التاريخ {{ date.formatDate(receipt?.created_at, 'YYYY/MM/DD') }}
                <br />
                رقم السند {{ receipt?.id }}
              </div>
              <div class="col-12">
                <p class="q-my-xs row justify-between">
                  <span>إصرفوا إلى السيد/ السيدة:</span>
                  <span class="col q-px-sm underLined text-center">{{
                    props.delegate?.name
                  }}</span>
                  <span>:Pay To M/S</span>
                </p>
              </div>
              <!--col -->
              <div class="col-12">
                <p class="q-my-xs row justify-between">
                  <span>مبلغ وقدره:</span>
                  <span class="col q-px-sm underLined text-center">
                    {{ tafqeet(props.receipt?.amount as number) }}
                  </span>
                  <span>:Amount</span>
                </p>
              </div>
              <!--col -->
              <div
                class="col-12"
                v-if="props.receipt?.changed[0].account.type == 'cash'"
              >
                <p class="q-my-xs row justify-between">
                  <span>مدفوع</span>
                  <span class="col q-px-sm underLined text-center">
                    نقداَ - Cash
                  </span>
                  <span>:Cash</span>
                </p>
              </div>
              <div
                class="col-12"
                v-if="
                  props.receipt?.changed[0].account.type !== 'cash' &&
                  props.receipt?.changed[0].account.type !== 'bank'
                "
              >
                <p class="q-my-xs row justify-between">
                  <span>مدفوع</span>
                  <span class="col q-px-sm underLined text-center">
                    من حساب بنك {{ props.receipt?.changed[0].account.name }}
                  </span>
                  <span>:Bank</span>
                </p>
              </div>
              <!--col -->
              <div class="col-12">
                <p class="q-my-xs row justify-between">
                  <span>وذلك مقابل:</span>
                  <span class="col q-px-sm underLined text-center">
                    {{ props.receipt?.note }}
                  </span>
                  <span>:Being For</span>
                </p>
              </div>
              <!--col -->
              <div class="col-12">
                <p class="q-my-md row justify-between">
                  <span class="col q-px-sm underLined text-center"></span>
                </p>
              </div>
              <!--col -->
              <div class="col-12 q-pt-md">
                <div class="row justify-center">
                  <p class="col-4 text-center">
                    المستلم / Receiver
                    <br />
                    ............................
                  </p>
                  <p class="col-4 text-center">
                    المحاسب / Accountant
                    <br />
                    ............................
                  </p>

                  <p class="col-4 text-center">
                    المدير / Manager
                    <br />
                    ............................
                  </p>
                </div>
              </div>
              <!--col -->
            </div>
            <!--row -->
          </div>
        </q-card-section>
        <q-card-section>
          <!-- {{ props.delegate }}

          {{ props.receipt }} -->
        </q-card-section>

        <q-card-section class="text-center">
          <q-btn
            icon="picture_as_pdf"
            :label="$t('printD')"
            color="primary"
            :loading="printing"
            @click="generatePdf"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import * as html2pdf from 'html2pdf.js/dist/html2pdf.js';
import { Delegate } from 'src/interfaces/delegate';
import { Receipt } from 'src/interfaces/receipt';
import { date } from 'quasar';
import * as Tafgeet from 'tafgeetjs';
const props = defineProps({
  dialog: Boolean,
  receipt: Object as PropType<Receipt>,
  delegate: Object as PropType<Delegate>,
});
const emit = defineEmits(['close', 'saved']);
const dialog = ref(props.dialog);
const maximizedToggle = ref(false);
const printing = ref(false);
const receiptbody = ref<HTMLInputElement | null>(null);
const pdfOptions = {
  margin: 0,
  filename: `Almassar_Institute_PayReceipt_${props.receipt?.id}.pdf`,
  image: { type: 'jpeg', quality: 2 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
};

function generatePdf() {
  printing.value = true;
  const content = receiptbody.value?.outerHTML;
  // console.log(receiptbody.value?.outerHTML);
  html2pdf().set(pdfOptions).from(content).save();
  printing.value = false;
}

const tafqeet = (amount: number) => new Tafgeet(amount, 'SAR').parse();
</script>
<style scoped lang="css">
.bordered {
  border: 1px solid #ccc;
}
.underLined {
  border-bottom: 1.5px dotted black;
}
</style>
