<template>
  <q-table
    :title="props.title"
    dense
    :rows="props?.orders"
    :columns="columns()"
    row-key="id"
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
          <q-btn
            v-else
            icon="receipt"
            size="sm"
            :label="$t('showInvoice')"
            flat
            dense
            :to="`/invoice/${props.row.id}`"
          />
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
const props = defineProps({
  title: String,
  orders: Array,
});
const i18n = useI18n();
const t = i18n.t;
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
    name: 'total_amount',
    align: 'center',
    label: t('total_amount'),
    field: (row: Order): string =>
      Number(
        row?.details?.reduce((t, d) => t + (d.price - Number(d?.discount)), 0)
      )?.toString(),
    sortable: true,
  },
  {
    name: 'total_tax',
    align: 'center',
    label: t('totaltax'),
    field: 'tax',
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
