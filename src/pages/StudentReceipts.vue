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
            {{ $t('name') + ': ' + student?.name }}
          </div>
          <div class="col-4">
            {{ $t('phone') + ': ' + student?.phone }}
          </div>
          <div class="col-4">
            {{ $t('email') + ': ' + student?.email }}
          </div>
          <div class="col-4">
            {{ $t('address') + ': ' + student?.address ?? '------' }}
          </div>
          <div class="col-4">
            {{ $t('joindate') + ': ' + student?.created_at }}
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <student-receipts-table
          v-if="receipts?.length"
          :receipts="receipts"
          :student="student"
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
import StudentReceiptsTable from '../components/students/details/StudentReceiptsTable.vue';
import { Student } from '../interfaces/students';
const api: AxiosInstance | undefined = inject('api');
const props = defineProps({
  id: String,
});
const loading = ref(true);
const student = ref<Student>();
const receipts = ref<Receipt[]>();
// const viewDialog = ref<boolean>(false);

function getReceiptsData() {
  api
    ?.get(`students/receipts/${props.id}`)
    .then((res) => {
      if (res.status == 200) {
        receipts.value = res.data.receipts;
        student.value = res.data.student;
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
