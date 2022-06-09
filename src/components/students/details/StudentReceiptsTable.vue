<template>
  <q-table
    title="الإيصالات"
    dense
    :rows="props?.receipts"
    :columns="columns()"
    row-key="id"
  >
    <template v-slot:body-cell-print="props">
      <q-td :props="props">
        <q-btn
          icon="print"
          size="sm"
          flat
          dense
          @click="selectReceipt(props.row)"
        />
      </q-td>
    </template>
  </q-table>
  <receipt-view
    v-if="openView"
    :dialog="openView"
    :student="student"
    :receipt="SelectedReceipt"
    @close="openView = false"
  />
</template>

<script setup lang="ts">
// import { useI18n } from 'vue-i18n';
import ReceiptView from './ReceiptView.vue';
import { TableColumn } from '../../../interfaces/TableColumn';
import { PropType, ref } from 'vue';
import { Receipt } from 'src/interfaces/receipt';
import { Student } from 'src/interfaces/students';
const props = defineProps({
  receipts: [] as PropType<Receipt[]>,
  student: Object as PropType<Student>,
});
const openView = ref<boolean>(false);
const SelectedReceipt = ref<Receipt>();

function selectReceipt(receipt: Receipt) {
  SelectedReceipt.value = receipt;
  openView.value = true;
}

const columns = (): Array<TableColumn> => [
  {
    name: 'index',
    required: true,
    label: 'رقم الإيصال',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'amount',
    required: true,
    label: 'قيمة الإيصال',
    align: 'left',
    field: 'amount',
    sortable: true,
  },
  {
    name: 'order_date',
    align: 'left',
    label: 'تاريخ الإيصال',
    field: 'created_at',
    sortable: true,
  },
  {
    name: 'note',
    align: 'center',
    label: 'البيان/الشرح',
    field: 'note',
    sortable: true,
  },
  {
    name: 'print',
    label: 'طباعة',
    field: 'Action',
    sortable: false,
    align: 'center',
  },
];
</script>
