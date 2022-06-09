<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-card v-if="!loading">
      <q-card-section class="q-pb-none">
        <div class="row justify-end">
          <q-btn
            icon="arrow_back"
            :label="$t('goback')"
            @click="$router.go(-1)"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-grey-8">كشف إيصالات المندوب</div>
        <div class="row justify-between q-col-gutter-sm q-pt-md">
          <div class="col-4">
            {{ $t('name') + ': ' + delegate?.name }}
          </div>
          <div class="col-4">
            {{ $t('phone') + ': ' + delegate?.phone }}
          </div>
          <div class="col-4">
            {{ $t('email') + ': ' + delegate?.email }}
          </div>
          <div class="col-4">
            {{ $t('address') + ': ' + delegate?.address ?? '------' }}
          </div>
          <div class="col-4">
            {{ $t('joindate') + ': ' + delegate?.created_at }}
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <delegate-receipts-table
          v-if="receipts?.length"
          :receipts="receipts"
          :delegate="delegate"
          :key="props.id"
        />
      </q-card-section>
      <q-separator />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { AxiosInstance } from 'axios';
import { Receipt } from 'src/interfaces/receipt';
import { inject, onBeforeMount, ref } from 'vue';
import DelegateReceiptsTable from '../components/delegates/details/DelegateReceiptsTable.vue';
import type { Delegate } from '../interfaces/delegate';
const api: AxiosInstance | undefined = inject('api');
const props = defineProps({
  id: String,
});
const loading = ref(true);
const delegate = ref<Delegate>();
const receipts = ref<Receipt[]>();
// const viewDialog = ref<boolean>(false);

function getReceiptsData() {
  api
    ?.get(`delegates/receipts/${props.id}`)
    .then((res) => {
      if (res.status == 200) {
        receipts.value = res.data.receipts;
        delegate.value = res.data.delegate;
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
  getReceiptsData();
});
</script>
