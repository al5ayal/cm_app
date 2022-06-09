<template>
  <q-page class="q-pa-md" v-if="loading">
    <q-inner-loading
      :showing="loading"
      label="جاري التحميل, يرجى الإنتظار..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-page>
  <q-page class="q-pa-md" v-if="!loading">
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section class="bg-blue-8 text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">إجمالي المبيعات</div>
                <div class="text-h5">{{ reports?.sales }}</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="trending_up" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section class="bg-green-8 text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">إجمالي المصروفات</div>
                <div class="text-h5">{{ reports?.expenses }}</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="paid" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section
            :class="$q.dark.isActive ? 'orange_dark' : 'bg-orange-9'"
            class="text-white"
          >
            <div class="row">
              <div class="col-10">
                <div class="text-h6">إجمالي الضريبة</div>
                <div class="text-h5">{{ reports?.tax }}</div>
                <!-- <div class="text-h5">
                  <q-icon name="arrow_downward" />
                  2%
                </div> -->
              </div>
              <div class="col-2">
                <q-icon size="62px" name="currency_exchange" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- row -->
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm q-mt-xl">
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">
              إجمالي الطلاب
              <q-btn
                flat
                dense
                icon="visibility"
                class="float-right"
                color="grey-8"
                to="students"
              >
                <q-tooltip>عرض قائمة الطلاب</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section class="text-center">
            {{ reports?.students }}
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">
              إجمالي المندوبين
              <q-btn
                flat
                dense
                icon="visibility"
                class="float-right"
                color="grey-8"
                to="delegates"
              >
                <q-tooltip>عرض قائمة المندوبين</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section class="text-center">
            {{ reports?.delegates }}
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">
              إجمالي المستخدمين
              <q-btn
                flat
                dense
                icon="visibility"
                class="float-right"
                color="grey-8"
                to="users"
              >
                <q-tooltip>عرض قائمة المستخدمين</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section class="text-center">
            {{ reports?.users }}
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">
              إجمالي المقررات
              <q-btn
                flat
                dense
                icon="visibility"
                class="float-right"
                color="grey-8"
                to="courses"
              >
                <q-tooltip>عرض قائمة المقررات</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section class="text-center">
            {{ reports?.courses }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-12">
        <DueInvoicesTableVue
          title="فواتير مستحقة/متأخرة الدفع"
          bg="red-2"
          :reports="(reports?.lateDue as Array<any>)"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-12">
        <DueInvoicesTableVue
          title="فواتير يستحق سدادها خلال قبل 7 أيام"
          bg="yellow-2"
          :reports="(reports?.dueWithinWeek as Array<any>)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm q-ma-xs">
      <div class="col-12"></div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { api } from 'src/boot/axios';
import { onBeforeMount, ref } from 'vue';
import DueInvoicesTableVue from 'src/components/home/DueInvoicesTable.vue';
const loading = ref<boolean>(true);
const reports = ref<Record<string, unknown>>();

onBeforeMount(() => {
  // get reports
  api
    .get('reports')
    .then(({ data }) => {
      reports.value = data;
      loading.value = false;
    })
    .catch(() => {
      console.error('Error loading reports');
      loading.value = false;
    });
});
</script>

<style scoped>
.blue_dark {
  background-color: #082f56;
}

.green_dark {
  background-color: #084a0b;
}

.orange_dark {
  background-color: #64350e;
}
</style>
