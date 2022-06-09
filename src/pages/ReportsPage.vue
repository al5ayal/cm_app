<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6">عرض كشف حساب</div>
        <q-form @submit.prevent="submit" class="q-gutter-sm">
          <div class="row q-col-gutter-sm">
            <div class="col-sm-6 col-12">
              <q-select
                clearable
                filled
                color="light-green-10"
                v-model="selectedAccountType"
                :options="accounts"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :loading="loadingData"
                label="إختر نوع الحساب"
                :rules="[(val) => !!val || 'إختر نوع الحساب']"
              />
            </div>
            <div
              class="col-sm-6 col-12"
              v-if="selectedAccountType == 'student'"
            >
              <q-select
                clearable
                filled
                color="light-green-10"
                v-model="selectedSubAccount"
                :options="subAccounts"
                option-value="account_id"
                option-label="name"
                :loading="loadingData"
                emit-value
                map-options
                label="إختر الطالب"
                :rules="[(val) => !!val || 'إختر الطالب']"
              />
            </div>
            <!-- col -->
            <div
              class="col-sm-6 col-12"
              v-if="selectedAccountType == 'delegate'"
            >
              <q-select
                clearable
                filled
                color="light-green-10"
                v-model="selectedSubAccount"
                :options="subAccounts"
                :loading="loadingData"
                option-value="account_id"
                option-label="name"
                emit-value
                map-options
                label="إختر المندوب"
                :rules="[(val) => !!val || 'إختر المندوب']"
              />
            </div>
            <!-- col -->
          </div>
          <!-- row -->
          <div class="row q-col-gutter-sm">
            <div class="col-sm-6 col-12">
              <q-input
                class="q-field"
                type="date"
                label="الفترة من"
                v-model="formData.from"
                placeholder="yyyy-mm-dd"
                min="2022-01-01"
                max="2030-12-31"
              />
            </div>
            <div class="col-sm-6 col-12">
              <q-input
                class="q-field"
                type="date"
                label="إلى تاريخ"
                v-model="formData.to"
                placeholder="dd-mm-yyyy"
                min="2022-01-01"
                max="2030-12-31"
              />
            </div>
            <!-- col -->

            <!-- col -->
          </div>
          <!-- row -->
          <div class="column justify-center items-center">
            <div class="col">
              <div>
                <q-btn label="عرض" type="submit" color="secondary" />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section v-if="!loading">
        <ledger-table :transactions="transactions" />
      </q-card-section>
      <q-card-section v-if="loading"> loading </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { Account } from 'src/interfaces/account';
import { api } from 'src/boot/axios';
import { date, useQuasar } from 'quasar';
import LedgerTable from 'src/components/reports/LedgerTable.vue';

//get accounts
const accounts = ref<Account[]>([]);
const subAccounts = ref([]);
const transactions = ref(Array<Record<string, string | number | Date>>());
const $q = useQuasar();
const loading = ref<boolean>(false);
const loadingData = ref<boolean>(true);

const selectedAccountType = ref<string>('');
const selectedSubAccount = ref<string>('');
const today = Date.now();
const formData = ref({
  account_id: '',
  from: date.formatDate(
    date.subtractFromDate(today, { months: 1 }),
    'YYYY-MM-DD'
  ),
  to: date.formatDate(date.addToDate(today, { days: 2 }), 'YYYY-MM-DD'),
});

onBeforeMount(() => {
  const baseAccounts: Account[] = [
    {
      id: 'student',
      name: 'طالب',
      type: 'student',
      type_id: null,
      parent: null,
    },
    {
      id: 'delegate',
      name: 'مندوب',
      type: 'delegate',
      type_id: null,
      parent: null,
    },
  ];

  api
    .get('reports/accounts')
    .then((response) => {
      accounts.value = [...baseAccounts, ...response.data];
      loadingData.value = false;
    })
    .catch((error) => {
      console.log(error);
      loadingData.value = false;
    });
});

watch(selectedAccountType, (value: string) => {
  if (value == 'student' || value == 'delegate') {
    loadingData.value = true;
    selectedSubAccount.value = '';
    api
      .get('reports/accounts/' + value)
      .then((response) => {
        subAccounts.value = response.data;
        loadingData.value = false;
      })
      .catch((error) => {
        console.log(error);
        loadingData.value = false;
      });
  }
});

function submit() {
  loading.value = true;
  $q.loading.show({
    message: 'جاري تحميل كشف الحساب',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary',
  });
  if (
    selectedAccountType.value == 'student' ||
    selectedAccountType.value == 'delegate'
  ) {
    formData.value.account_id = selectedSubAccount.value;
  } else {
    formData.value.account_id = selectedAccountType.value;
  }
  if (!formData.value.account_id || formData.value.account_id == null) return;
  api
    .post('reports/ledger', formData.value)
    .then((response) => {
      transactions.value = response.data;
      //get map transactions to get balance between entry_type DEBIT and CREDIT for each row
      const mapTransactions: Array<Record<string, string | number | Date>> = [];
      let balance = 0;
      for (let i = 0; i < response.data.length; i++) {
        const transaction = response.data[i];

        if (transaction.entry_type == 'D') {
          balance += Number(transaction.amount);
        } else {
          balance -= Number(transaction.amount);
        }
        transaction.balance = balance.toFixed(2);
        mapTransactions.push(transaction);
      }
      transactions.value = mapTransactions;
      loading.value = false;
      $q.loading.hide();
    })
    .catch((error) => {
      console.log(error);
      loading.value = false;
      $q.loading.hide();
    });
}
</script>
