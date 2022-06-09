<template>
  <q-table
    :rows="tableData"
    :columns="OrderDetailsColumns()"
    hide-bottom
    separator="cell"
    dense
    flat
    bordered
    square
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-weight-bolder bg-grey-3"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <!-- editable -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="number" :props="props">
          {{ props.rowIndex + 1 }}
          <!-- {{ props }} -->
        </q-td>
        <q-td key="name" :props="props">{{ props.row.cohort.name }}</q-td>
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
        <q-td colspan="100%" class="text-left">
          <q-list dense class="q-pa-none float-right" style="width: 14rem">
            <q-item class="text-weight-bold">
              <q-item-section>
                <q-item-label>
                  {{
                    $t('taxableTotal') +
                    ': ' +
                    Number(props.order.total_amount - props.order.tax).toFixed(
                      2
                    )
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="text-weight-bold">
              <q-item-section>
                <q-item-label>
                  {{ $t('totaltax') + ': ' + props.order.tax }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="text-weight-bold">
              <q-item-section>
                {{ $t('totalAfterTax') + ': ' + props.order.total_amount }}
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-py-xl text-center" style="width: fit-content">
            <p class="bg-grey-2 q-pa-sm">
              {{ tafqeet(props.order?.total_amount as number) }}
            </p>
          </div>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:bottom="props">
      <q-tr :props="props">
        <q-th class="text-italic text-purple">
          {{ 'label' }}
        </q-th>
      </q-tr>
    </template>
    <!-- editable -->
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { TableColumn } from '../../interfaces/TableColumn';
import * as Tafgeet from 'tafgeetjs';
const props = defineProps({
  title: String,
  order: {},
});

const tableData = ref(props?.order?.details);
const i18n = useI18n();
const t = i18n.t;

function getRowTotals(price: number, discount: number) {
  let taxRatio = 0.15;
  const newPrice = price - discount;
  const tax = newPrice * taxRatio;
  const total = newPrice + tax;
  return { total: total.toFixed(2), tax: tax.toFixed(2) };
}

const tafqeet = (amount: number) => new Tafgeet(amount, 'SAR').parse();
const OrderDetailsColumns = (): Array<TableColumn> => [
  {
    name: 'number',
    required: true,
    label: t('index'),
    align: 'center',
    field: 'number',
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: t('productOservice'),
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
    label: t('taxAmount'),
    align: 'center',
    field: 'tax',
    sortable: true,
  },
  {
    name: 'total_amount',
    required: true,
    label: t('totalAfterTax'),
    align: 'center',
    sortable: true,
    field: 'total_amount',
    format: (row) => Number(row.price) - Number(row.discount),
  },
];
</script>
