<template>
  <q-item clickable :to="props.item.link">
    <q-item-section v-if="props.item.icon" avatar>
      <q-icon :name="props.item.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.item.title }}</q-item-label>
      <q-item-label caption v-if="props.item.caption">{{
        props.item.caption
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
// import type { MenuLink } from '.../types/menuLinks';
const props = defineProps({
  item: {},
});
</script>
