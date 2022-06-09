<template>
  <q-page class="q-px-md">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <div class="row justify-between q-my-sm q-col-gutter-sm">
      <div class="col-4">
        <q-btn
          icon="picture_as_pdf"
          :label="$t('printD')"
          @click="generatePdf"
        />
      </div>
      <div class="col-4 text-center">
        <q-chip
          v-if="Number(order?.total_amount) - Number(order?.paid_amount) <= 0"
          outline
          color="green-10"
          text-color="white"
          icon-right="check"
        >
          {{ $t('payDone') }}
        </q-chip>
        <q-chip
          v-else
          outline
          color="red-8"
          text-color="white"
          icon-right="close"
        >
          {{ $t('payNotDone') }}
        </q-chip>
      </div>
      <div class="col-4 text-right">
        <q-btn
          icon="arrow_back"
          :label="$t('goback')"
          @click="$router.go(-1)"
        />
      </div>
    </div>

    <!-- pdf -->
    <q-card v-if="!loading" class="q-pa-none bg-white" ref="invoicebody">
      <q-card-section>
        <!-- <div class="text-h6 text-grey-8">
          {{ $t('student_details') }}
        </div> -->
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-4">
            <q-list dense class="q-pa-none">
              <q-item class="text-weight-bold">
                <q-item-section>
                  {{ $t('AppName') }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">الهاتف :</span>
                    {{ $t('AppPhone') }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">السجل التجاري:</span>
                    {{ $t('AppCR') }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">الرقم الضريبي:</span>
                    {{ $t('AppVat') }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="">
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">العنوان:</span>
                    {{ $t('AppAddress') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-4 text-center self-center">
            <!-- <q-icon name="school" size="7rem" color="primary" /> -->
            <q-icon name="img:icon.png" size="7rem" color="primary" />
            <p class="text-center">فاتورة اجل</p>
          </div>
          <div class="col-4 text-right">
            <q-list dense class="q-pa-none">
              <q-item class="text-weight-bold">
                <q-item-section> Fast Track Training Institute </q-item-section>
              </q-item>

              <q-item class="text-weight-bold">
                <q-item-section>
                  <q-item-label> Tel +966565621312 </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="text-weight-bold">
                <q-item-section>
                  <q-item-label> CR 4030286263 </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="text-weight-bold">
                <q-item-section>
                  <q-item-label> VAT 311045260300003 </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="">
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">Address:</span> Ahmad Al
                    Attas, Al Zahra, Jeddah
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <!-- <div class="text-h6 text-grey-8">
          {{ $t('student_details') }}
        </div> -->
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-4">
            <q-list dense class="q-pa-none">
              <q-item>
                <q-item-section>
                  {{ $t('invoiceDate') + ': ' + order?.inv_date }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{ $t('invoiceNumber') + '# ' + order?.id }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{ $t('invoiceDueDate') + ': ' + order?.due_date }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-4">
            <q-list dense class="q-pa-none">
              <q-item class="text-center">
                <q-item-section>
                  <q-item-label>
                    <q-icon :name="`img:${order?.qrCode}`" size="7rem" />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-4">
            <q-list dense class="q-pa-none">
              <q-item>
                <q-item-section>
                  {{ $t('clientname') + ': ' + order?.student?.name }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{ $t('phone') + ': ' + order?.student?.phone }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{ $t('address') + ': ' + order?.student?.address }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <invoice-table :order="order" :title="$t('supscriptions')" />
      </q-card-section>
      <!-- <q-separator class="q-mt-xl" /> -->
      <q-card-section class="vertical-bottom q-mt-xl">
        <q-separator class="q-mt-xl" />
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-4">{{ $t('address') + ': ' + $t('AppAddress') }}</div>
          <div class="col-4 text-center">
            {{ $t('phone') + ': ' + $t('AppPhone') }}
          </div>
          <div class="col-4 text-right">
            {{ $t('website') + ': ' + $t('AppWebsite') }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { AxiosInstance } from 'axios';
import { inject, onBeforeMount, ref } from 'vue';
import html2pdf from 'html2pdf.js/dist/html2pdf.js';
import InvoiceTable from '../components/invoice/InvoiceTable.vue';
import { Order } from 'src/interfaces/orders';
const api: AxiosInstance | undefined = inject('api');
const invoicebody = ref<HTMLInputElement | null>(null);

const props = defineProps({
  id: String,
});
const loading = ref(true);

const order = ref<Order>();

function getInvoiceData() {
  api
    ?.get(`orders/orderInvoice/${props.id}`)
    .then((res) => {
      if (res.status == 200) {
        order.value = res.data;
        loading.value = false;
      }
    })
    .catch((error) => {
      if (error?.response?.status == 404) {
        // Page not found
        loading.value = false;
      }
    });
}
onBeforeMount(() => {
  // get all needed student data
  getInvoiceData();
});

const pdfOptions = {
  margin: 0,
  filename: `Almassar_invoice_${props.id}.pdf`,
  image: { type: 'jpeg', quality: 2 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
};

function generatePdf() {
  console.log(html2pdf());
  const content = invoicebody.value.$el.outerHTML;
  html2pdf().set(pdfOptions).from(content).save();
}
</script>
