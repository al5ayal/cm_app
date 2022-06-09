<template>
  <template v-for="(link, index) in linksList()" :key="index">
    <ExpandNavLink v-if="link.type == 'multi'" :items="link" />
    <NavLink v-else :item="link" />
  </template>
</template>
<script setup lang="ts">
// import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ExpandNavLink from './ExpandNavLink.vue';
import NavLink from './NavLink.vue';

import { MenuLink } from '../interfaces/menuLinks';

const { t } = useI18n();
const linksList = (): Array<MenuLink> => [
  {
    title: t('home'),
    caption: 'home page',
    icon: 'home',
    link: '/',
  },
  {
    title: t('students'),
    // caption: t('users'),
    icon: 'school',
    link: '',
    type: 'multi',
    items: [
      {
        title: t('studentslist'),
        // caption: 'User control list',
        icon: 'list',
        link: '/students',
      },
    ],
  },
  {
    title: t('cohorts'),
    // caption: t('users'),
    icon: 'text_snippet',
    link: '',
    type: 'multi',
    items: [
      {
        title: t('list') + t('cohorts'),
        // caption: 'User control list',
        icon: 'list',
        link: '/cohorts',
      },
    ],
  },
  {
    title: t('courses'),
    // caption: t('users'),
    icon: 'auto_stories',
    link: '',
    type: 'multi',
    items: [
      {
        title: t('list') + t('courses'),
        // caption: 'User control list',
        icon: 'list',
        link: '/courses',
      },
    ],
  },
  {
    title: t('delegates'),
    // caption: t('users'),
    icon: 'real_estate_agent',
    link: '',
    type: 'multi',
    items: [
      {
        title: t('list') + t('delegates'),
        // caption: 'User control list',
        icon: 'list',
        link: '/delegates',
      },
    ],
  },
  {
    title: t('reports'),
    // caption: t('users'),
    icon: 'bar_chart',
    link: '',
    type: 'multi',
    items: [
      {
        title: 'كشف حساب',
        // caption: 'User control list',
        icon: 'search',
        link: '/reports',
      },
      // {
      //   title: 'إعدادات الحسابات',
      //   // caption: 'User control list',
      //   icon: 'search',
      //   link: '/reports/settings',
      // },
    ],
  },
  {
    title: t('users'),
    // caption: t('users'),
    icon: 'group',
    link: '',
    type: 'multi',
    items: [
      {
        title: t('userslist'),
        // caption: 'User control list',
        icon: 'list',
        link: '/users',
      },
      {
        title: t('usergroups'),
        // caption: 'User Groups control',
        icon: 'workspaces',
        link: '/usergroups',
      },
    ],
  },
  // {
  //   title: t('settings'),
  //   // caption: t('users'),
  //   icon: 'settings',
  //   link: '',
  //   type: 'multi',
  //   items: [
  //     {
  //       title: t('generalsettings'),
  //       // caption: 'User control list',
  //       icon: 'list',
  //       link: '/users',
  //     },
  //     {
  //       title: t('accountingsettings'),
  //       // caption: 'User control list',
  //       icon: 'list',
  //       link: '/users',
  //     },
  //   ],
  // },
];
</script>
<style lang=""></style>
