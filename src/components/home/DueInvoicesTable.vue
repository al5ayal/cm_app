<template>
  <q-table
    :class="'bg-' + props.bg"
    dense
    :title="props.title"
    :rows="props.reports"
    :columns="(columns as  Array<any>)"
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          icon="receipt"
          size="sm"
          :label="$t('showInvoice')"
          flat
          dense
          :to="`/invoice/${props.row.id}`"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'فواتير مستحقة الدفع',
  },
  reports: Array,
  bg: {
    type: String,
    default: '',
  },
});

const columns = [
  {
    name: 'id',
    label: 'رقم الفاتورة',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'total',
    label: 'الإجمالي',
    align: 'center',
    field: 'total_amount',
    sortable: true,
  },
  {
    name: 'paid',
    label: 'المبلغ المسدد',
    align: 'center',
    field: 'paid_amount',
    sortable: true,
  },
  {
    name: 'remaining',
    label: 'المبلغ المتبقي',
    align: 'center',
    field: (row) => Number(row.total_amount - row.paid_amount).toFixed(2),
    sortable: true,
  },
  {
    name: 'due_date',
    label: 'تاريخ الاستحقاق',
    align: 'center',
    field: 'due_date',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'الخيارات',
    align: 'center',
    sortable: true,
  },
];
</script>
