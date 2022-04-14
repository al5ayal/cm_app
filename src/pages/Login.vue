<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">{{ $t('login') }}</div>
              <div class="col text-h6 ellipsis">{{ user }}</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                filled
                v-model="username"
                :label="$t('username')"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="password"
                :label="$t('password')"
                lazy-rules
              />

              <div>
                <q-btn
                  label="Login"
                  @click="login"
                  type="button"
                  color="primary"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { User } from '../types/user';
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/mainStore';
const authStore = useAuthStore();

const router = useRouter();
const backApi = inject('backApi');
const user = ref('');
const username = ref('al5');
const password = ref('1234567890');
const login = async () => {
  backApi
    .userLogin(username.value, password.value)
    .then(async (res: User | null) => {
      if (res) {
        user.value = 'successfully LoggedIN'; //dev only
        if (await authStore.login(res)) {
          router.push({
            name: 'home',
          });
        }
      } else {
        user.value = 'Login failed'; //dev only
      }
    });
};
onMounted(() => {
  // console.log();
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
