<template>
  <q-table
    :class="'bg-' + props.bg"
    :dense="$q.screen.lt.md"
    :title="props.title"
    :rows="props.transactions"
    :columns="(columns as  Array<any>)"
    row-key="name"
    :pagination="initialPagination"
  >
    <template v-slot:top-right>
      <q-btn
        color="primary"
        icon-right="archive"
        label="تصدير إلى ملف إكسيل"
        no-caps
        @click="exportTable"
      />
    </template>
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
import { date, exportFile, useQuasar } from 'quasar';
const $q = useQuasar();
const props = defineProps({
  title: {
    type: String,
    default: 'كشف حساب',
  },
  transactions: {
    type: Array,
  },
  bg: {
    type: String,
    default: '',
  },
});

const columns = [
  {
    name: 'id',
    label: 'رقم العملية',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'date',
    label: 'التاريخ',
    align: 'center',
    field: (row) => date.formatDate(row.created_at, 'YYYY/MM/DD'),
    sortable: true,
  },
  {
    name: 'note',
    label: 'البيان/الشرح',
    align: 'center',
    field: 'note',
    sortable: true,
  },
  {
    name: 'D',
    label: 'مدين',
    align: 'center',
    field: 'D',
    field: (row) => (row.entry_type == 'D' ? row.amount : 0),
    sortable: true,
  },
  {
    name: 'C',
    label: 'دائن',
    align: 'center',
    field: (row) => (row.entry_type == 'C' ? row.amount : 0),
    sortable: true,
  },
  {
    name: 'balance',
    label: 'الرصيد',
    align: 'center',
    field: 'balance',
    sortable: true,
  },
];

const initialPagination = {
  rowsPerPage: 10,
  // rowsNumber: xx if getting data from a server
};

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

function exportTable() {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      props.transactions.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const status = exportFile('account-ledger.csv', content, 'text/csv');

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
}
</script>
