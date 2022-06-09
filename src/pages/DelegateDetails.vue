<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-card v-if="!loading">
      <div class="row justify-end">
        <q-btn
          icon="arrow_back"
          :label="$t('goback')"
          @click="$router.go(-1)"
        />
      </div>
      <q-card-section>
        <div class="text-h6 text-grey-8">بيانات المندوب</div>
        <div class="row justify-between q-col-gutter-sm q-pt-md">
          <div class="col-4">
            {{ $t('name') + ': ' + delegate?.name }}
          </div>
          <div class="col-4">
            {{ $t('phone') + ': ' + delegate?.phone }}
          </div>
          <div class="col-4">
            {{ $t('email') + ': ' + (delegate?.email ?? '---') }}
          </div>
          <div class="col-4">
            {{ $t('address') + ': ' + (delegate?.address ?? '---') }}
          </div>
          <div class="col-4">
            {{ $t('joindate') + ': ' + delegate?.created_at }}
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h6 text-grey-8">
          {{ $t('summary') }}
        </div>
        <div class="row justify-between q-col-gutter-xs q-mt-xs">
          <div class="col-sm-3 col-12 text-center">
            <q-list bordered separator class="q-pa-none">
              <p class="q-ma-none">{{ $t('quickaccess') }}</p>

              <q-item>
                <q-item-section>
                  <q-btn
                    color="primary"
                    :label="$t('pay_comm')"
                    icon="price_check"
                    @click="openPayOrderDialog = true"
                    :disable="delegate?.orders?.length <= 0"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn
                    color="primary"
                    label="إيصالات الدفع"
                    icon="format_list_numbered"
                    :to="`/delegate/${props.id}/receipts`"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <!-- new supscription dialog -->
            <pay-commission-dialog
              v-if="openPayOrderDialog"
              :dialog="openPayOrderDialog"
              :orders="delegate?.orders"
              :delegate_id="delegate?.id"
              @close="openPayOrderDialog = false"
              @saved="saved"
            />
          </div>
          <div class="col-sm-3 col-12 text-center">
            {{ $t('accountsummary') }}
            <q-list bordered separator class="q-pa-none">
              <q-item class="bg-grey-1">
                <q-item-section>
                  {{
                    $t('dues') +
                    ': ' +
                    Number(
                      delegate?.orders?.reduce(
                        (total, order) =>
                          total + Number(order.delegate_commission),
                        0
                      )
                    ).toFixed(2)
                  }}
                </q-item-section>
              </q-item>

              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label>
                    {{
                      $t('payments') +
                      ': ' +
                      Number(
                        delegate?.orders?.reduce(
                          (total, order) =>
                            total + Number(order.paid_commission),
                          0
                        )
                      )
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="bg-grey-3">
                <q-item-section>
                  <q-item-label>
                    {{
                      $t('remaining') +
                      ': ' +
                      (
                        Number(
                          delegate?.orders?.reduce(
                            (total, order) =>
                              total + Number(order.delegate_commission),
                            0
                          )
                        ) -
                        Number(
                          delegate?.orders?.reduce(
                            (total, order) =>
                              total + Number(order.paid_commission),
                            0
                          )
                        )
                      ).toFixed(2)
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <orders-commission-table :orders="delegate?.orders" title="العمولات" />
      </q-card-section>
      <q-separator />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { AxiosInstance } from 'axios';
import { inject, onBeforeMount, ref } from 'vue';
import OrdersCommissionTable from '../components/delegates/details/OrdersCommissionTable.vue';
import PayCommissionDialog from '../components/delegates/details/PayCommissionDialog.vue';
import type { Delegate } from '../interfaces/delegate';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
// import { useAppStore } from '../stores/mainStore';
const api: AxiosInstance | undefined = inject('api');
const $q = useQuasar();
const i18n = useI18n();

// const appStore = useAppStore();
const props = defineProps({
  id: String,
});
const loading = ref(true);
const delegate = ref<Delegate>();
const newSubOpen = ref<boolean>(false);
const openPayOrderDialog = ref<boolean>(false);

function getDelegateData() {
  api
    ?.get(`delegates/${props.id}`)
    .then((res) => {
      if (res.status == 200) {
        delegate.value = res.data;
        // appStore.currentDelegate = delegate.value;
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
  // get all needed delegate data
  getDelegateData();
});

function saved(data: { message: string; error?: boolean }) {
  if (!data.message.length || data.error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: JSON.stringify(data),
      position: 'top',
    });
  } else {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: i18n.t(data.message),
      position: 'top',
    });
    getDelegateData();
    newSubOpen.value = false;
    openPayOrderDialog.value = false;
  }
}
</script>
