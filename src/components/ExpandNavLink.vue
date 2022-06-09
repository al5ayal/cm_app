<template>
  <q-expansion-item :icon="props.items?.icon" :label="props.items?.title">
    <q-list class="q-pl-lg">
      <q-item
        v-for="(item, index) in props.items?.items"
        :to="item.link"
        :key="index"
        active-class="q-item-no-link-highlighting"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label v-if="item.caption" caption>{{
            item.caption
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
// import { MenuLink } from '../types/menuLinks';
// title: 'Home',
// caption: 'home page',
// icon: 'home',
// link: '/',
const props = defineProps({
  items: Object,
});
</script>
