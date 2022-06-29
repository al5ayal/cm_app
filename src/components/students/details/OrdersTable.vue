<template>
  <q-table
    :title="props.title"
    dense
    :rows="tableData"
    :columns="columns()"
    row-key="id"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="primary"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <span v-if="col.name !== 'actions'">{{ col.value }}</span>
          <div v-else>
            <q-btn
              icon="receipt"
              size="sm"
              :label="$t('showInvoice')"
              flat
              dense
              :to="`/invoice/${props.row.id}`"
            />
            <q-btn
              icon="delete"
              size="md"
              color="red"
              label="حذف"
              flat
              dense
              @click="deleteOrder(props.row.id)"
            />
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">
            <q-table
              dense
              :rows="props.row.details"
              :columns="OrderDetailsColumns()"
              row-key="id"
              hide-bottom
            />
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TableColumn } from '../../../interfaces/TableColumn';
import { OrderDetails, Order } from '../../../interfaces/orders';
import { QSpinnerGears, useQuasar } from 'quasar';
import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { inject, onUpdated, ref } from 'vue';
const api: AxiosInstance | undefined = inject('api');
const emit = defineEmits(['update']);
const props = defineProps({
  title: String,
  orders: Array,
});
const tableData = ref(props.orders);
const i18n = useI18n();
const t = i18n.t;
const $q = useQuasar();

onUpdated(() => {
  tableData.value = props.orders;
});

function deleteOrder(id: number) {
  // confrim first then delete
  $q.dialog({
    title: t('confirm'),
    dark: true,
    message: `هل أنت متأكد من حذف فاتورة رقم ${id}`,
    options: {
      type: 'checkbox',
      model: [],
      isValid: (model) => model.includes(`delete${id}`),
      // inline: true
      items: [
        {
          label: 'نعم أنا متأكد تماما',
          value: `delete${id}`,
          color: 'secondary',
        },
      ],
    },
    cancel: true,
    persistent: true,
  }).onOk((dialogData) => {
    console.log(dialogData[0]);
    if (dialogData[0] == `delete${id}`) {
      const dialog = $q.dialog({
        title: 'Uploading...',
        dark: true,
        message: '0%',
        progress: {
          spinner: QSpinnerGears,
          color: 'amber',
        },
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      });

      dialog.update({
        title: 'جاري حذف الفاتورة ومراجعة الحسابات',
        dark: true,
        message: '0%',
        progress: {
          spinner: QSpinnerGears,
          color: 'amber',
        },
      });
      // we simulate some progress here...
      let percentage = 0;
      const interval = setInterval(() => {
        percentage = Math.min(100, percentage + Math.floor(Math.random() * 22));

        // we update the dialog
        dialog.update({
          message: `${percentage}%`,
        });
      }, 200);

      api
        ?.delete(`/orders/${id}`)
        .then((res: AxiosResponse) => {
          setTimeout(() => {
            clearInterval(interval);
            dialog.update({
              title: 'تم الحذف',
              message: res.data.message,
              progress: false,
              ok: true,
            });
            emit('update', { message: res.data.message });
          }, 2000);

          // tableData.value = tableData.value?.filter((order) => order.id !== id);
        })
        .catch((err: AxiosError) => {
          dialog.update({
            title: 'حدث خطأ',
            message: err.message,
            progress: false,
            ok: true,
          });
          console.log(err);
          // we clear the interval
          clearInterval(interval);
        });
    }
  });
}

const columns = (): Array<TableColumn> => [
  {
    name: 'expand',
    required: true,
    label: '',
    align: 'center',
    field: '',
    sortable: true,
  },
  {
    name: 'number',
    required: true,
    label: t('subscribtion_number'),
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'type',
    required: true,
    label: t('subscribtion_type'),
    align: 'left',
    field: (row: Order): string => `${t(row.type)}/${t(row.rel)}`,
    sortable: true,
  },
  {
    name: 'totals',
    align: 'center',
    label: t('totalAfterTax'),
    field: 'total_amount',
    sortable: true,
  },
  {
    name: 'order_date',
    align: 'left',
    label: t('order_date'),
    field: 'inv_date',
    sortable: true,
  },
  {
    name: 'remaining',
    align: 'left',
    label: t('remaining'),
    field: (row) => (row.total_amount - row.paid_amount).toFixed(2),
    format: (val) => (Number(val) <= 0 ? t('payDone') : val),
    sortable: true,
  },
  {
    name: 'due_date',
    align: 'left',
    label: t('invoiceDueDate'),
    field: 'due_date',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: t('actions'),
    field: '',
    sortable: true,
  },
];

const OrderDetailsColumns = (): Array<TableColumn> => [
  {
    name: 'number',
    required: true,
    label: t('index'),
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'cohort',
    required: true,
    label: t('cohort'),
    align: 'left',
    field: (row: OrderDetails): string => row?.cohort?.name,
    sortable: true,
  },
  {
    name: 'price',
    required: true,
    label: t('price'),
    align: 'center',
    field: 'price',
    sortable: true,
  },
  {
    name: 'discount',
    required: true,
    label: t('discount'),
    align: 'center',
    field: 'discount',
    sortable: true,
  },
  {
    name: 'total',
    required: true,
    label: t('total'),
    align: 'center',
    field: (row: OrderDetails): string =>
      Number(row?.price - row?.discount)
        .toFixed(2)
        .toString(),
    sortable: true,
  },
];
</script>
