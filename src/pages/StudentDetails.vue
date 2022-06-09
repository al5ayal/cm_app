<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-card v-if="!loading">
      <q-card-section class="q-pa-none q-ma-none text-right">
        <q-btn
          icon="arrow_back"
          :label="$t('goback')"
          @click="$router.go(-1)"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          {{ $t('student_details') }}
        </div>
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-4">
            {{ $t('name') + ': ' + student?.name }}
          </div>
          <div class="col-4">
            {{ $t('phone') + ': ' + student?.phone }}
          </div>
          <div class="col-4">
            {{ $t('email') + ': ' + student?.email }}
          </div>
          <div class="col-4">
            {{ $t('age') + ': ' + student?.age }}
          </div>
          <div class="col-4">
            {{ $t('address') + ': ' + student?.address }}
          </div>
          <div class="col-4">
            {{ $t('joindate') + ': ' + student?.created_at }}
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
                    :label="$t('newsubscription')"
                    icon="add"
                    @click="newSubOpen = true"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-btn
                    color="primary"
                    :label="$t('receive_fees')"
                    icon="price_check"
                    @click="openPayOrderDialog = true"
                    :disable="student?.orders?.length <= 0"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-btn
                    color="primary"
                    label="إيصالات الإستلام"
                    icon="format_list_numbered"
                    :to="`/student/${props.id}/receipts`"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <!-- new supscription dialog -->
            <new-sub-dialog
              v-if="newSubOpen"
              :dialog="newSubOpen"
              :student_id="student?.id"
              @close="newSubOpen = false"
              @saved="saved"
            />
            <pay-order-dialog
              v-if="openPayOrderDialog"
              :dialog="openPayOrderDialog"
              :orders="student?.orders"
              :student_id="student?.id"
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
                      student?.orders?.reduce(
                        (total, order) => total + Number(order.total_amount),
                        0
                      )
                    )
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
                        student?.orders?.reduce(
                          (total, order) => total + Number(order.paid_amount),
                          0
                        )
                      ).toFixed(2)
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
                          student?.orders?.reduce(
                            (total, order) =>
                              total + Number(order.total_amount),
                            0
                          )
                        ) -
                        Number(
                          student?.orders?.reduce(
                            (total, order) => total + Number(order.paid_amount),
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
        <orders-table :orders="student?.orders" :title="$t('supscriptions')" />
      </q-card-section>
      <q-separator />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { AxiosInstance } from 'axios';
import { inject, onBeforeMount, ref } from 'vue';
import OrdersTable from '../components/students/details/OrdersTable.vue';
import NewSubDialog from '../components/students/details/NewSubDialog.vue';
import PayOrderDialog from '../components/students/details/PayOrderDialog.vue';
import type { Student } from '../interfaces/students';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const api: AxiosInstance | undefined = inject('api');
const $q = useQuasar();
const i18n = useI18n();
const props = defineProps({
  id: String,
});
const loading = ref(true);
const student = ref<Student>();
const newSubOpen = ref<boolean>(false);
const openPayOrderDialog = ref<boolean>(false);

function getStudentData() {
  api
    ?.get(`students/${props.id}`)
    .then((res) => {
      if (res.status == 200) {
        student.value = res.data;
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
  getStudentData();
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
    getStudentData();
    newSubOpen.value = false;
    openPayOrderDialog.value = false;
  }
}
</script>
