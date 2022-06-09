<template>
  <q-table
    :title="props.title"
    dense
    :rows="props?.orders"
    :columns="columns()"
    row-key="id"
  >
  </q-table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TableColumn } from '../../../interfaces/TableColumn';
const props = defineProps({
  title: String,
  orders: Array,
});
const { t } = useI18n();

const columns = (): Array<TableColumn> => [
  {
    name: 'index',
    required: true,
    label: t('index'),
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'order_number',
    required: true,
    label: t('InvoiceTransaction'),
    align: 'left',
    field: 'id',
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
    name: 'delegate_commission',
    align: 'center',
    label: t('commission_amount'),
    field: 'delegate_commission',
    sortable: true,
  },
  {
    name: 'paid',
    align: 'center',
    label: 'المدفوع',
    field: 'paid_commission',
    sortable: true,
  },

  {
    name: 'remaining',
    align: 'left',
    label: t('remaining'),
    field: (row) => (row.delegate_commission - row.paid_commission).toFixed(2),
    format: (val) => (Number(val) <= 0 ? t('payDone') : val),
    sortable: true,
  },
];
</script>
