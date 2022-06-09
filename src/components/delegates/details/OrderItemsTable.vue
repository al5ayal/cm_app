<template>
  <q-table
    :title="props.title"
    dense
    :rows="tableData"
    :columns="OrderDetailsColumns()"
    row-key="index"
    hide-bottom
  >
    <!-- editable -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="number" :props="props">
          <q-btn
            icon="delete_forever"
            outline
            rounded
            color="red"
            size="sm"
            padding="xs"
            @click="$emit('removeItem', props.row.index)"
          />
          {{ props.row.index }}
          <!-- {{ props }} -->
        </q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="price" :props="props">{{ props.row.price }}</q-td>
        <q-td key="discount" :props="props">
          {{ props.row.discount }}
          <q-popup-edit
            v-model="props.row.discount"
            title="Update discount"
            buttons
            v-slot="scope"
          >
            <q-input type="number" v-model="scope.value" dense autofocus />
          </q-popup-edit>
        </q-td>
        <q-td key="tax" :props="props">
          {{
            (props.row.tax = getRowTotals(
              props.row.price,
              props.row.discount
            ).tax)
          }}
        </q-td>
        <q-td key="total_amount" :props="props">{{
          (props.row.total_amount = getRowTotals(
            props.row.price,
            props.row.discount
          ).total)
        }}</q-td>
      </q-tr>
    </template>
    <template v-slot:bottom-row>
      <q-tr>
        <q-td key="number"></q-td>
        <q-td key="name"></q-td>
        <q-td class="text-center">
          {{ $t('total') }}:
          <q-badge outline color="primary">
            {{ getTotals.preTotal }}
          </q-badge>
        </q-td>
        <q-td class="text-center">
          {{ $t('totalDiscount') }}:
          <q-badge outline color="primary">
            {{ getTotals.discount }}
          </q-badge>
        </q-td>
        <q-td class="text-center">
          {{ $t('totaltax') }}:
          <q-badge outline color="primary">
            {{ getTotals.tax }}
          </q-badge>
        </q-td>
        <q-td class="text-center" colspan="100%">
          {{ $t('totalAfterDiscountTax') }}:
          <q-badge outline color="primary">
            {{ getTotals.total }}
          </q-badge>
        </q-td>
      </q-tr>
    </template>
    <!-- editable -->
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { TableColumn } from '../../../interfaces/TableColumn';
// import { OrderDetails } from '../../../interfaces/orders';
const props = defineProps({
  title: String,
  items: Array,
});

const tableData = ref(props.items);
const i18n = useI18n();
const t = i18n.t;

function getRowTotals(price: number, discount: number) {
  let taxRatio = 0.15;
  const newPrice = price - discount;
  const tax = newPrice * taxRatio;
  const total = newPrice + tax;
  return { total: total.toFixed(2), tax: tax.toFixed(2) };
}

const getTotals = computed(() => {
  const totalPrice = tableData.value?.reduce(
    (total, row) => total + Number(row.price),
    0
  );
  const totalDiscount = tableData.value?.reduce(
    (total, row) => total + Number(row.discount),
    0
  );
  const totalTax = tableData.value?.reduce(
    (total, row) => total + Number(row.tax),
    0
  );
  const total = totalPrice - totalDiscount + totalTax;

  return {
    preTotal: totalPrice.toFixed(2),
    total: total.toFixed(2),
    tax: totalTax.toFixed(2),
    discount: totalDiscount.toFixed(2),
  };
});

const OrderDetailsColumns = (): Array<TableColumn> => [
  {
    name: 'number',
    required: true,
    label: t('index'),
    align: 'left',
    field: 'index',
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: t('cohort'),
    align: 'left',
    field: 'name',
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
    name: 'tax',
    required: true,
    label: t('tax'),
    align: 'center',
    field: 'tax',
    sortable: true,
  },
  {
    name: 'total_amount',
    required: true,
    label: t('total'),
    align: 'center',
    sortable: true,
    field: 'total_amount',
    format: (row: Record<string, unknown>) =>
      Number(row.price) - Number(row.discount),
  },
];
</script>
