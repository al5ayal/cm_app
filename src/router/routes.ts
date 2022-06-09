import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      //TODO:: change home page according to current user
      {
        path: '',
        name: 'homePage',
        component: () => import('pages/HomePage.vue'),
      },
      {
        path: '/students',
        component: () => import('src/pages/StudentsPage.vue'),
      },
      {
        path: '/student/:id',
        component: () => import('layouts/StudentLayout.vue'),
        props: true,
        children: [
          {
            path: '',
            component: () => import('pages/StudentDetails.vue'),
            props: true,
          },
          {
            path: 'receipts',
            component: () => import('pages/StudentReceipts.vue'),
            props: true,
          },
        ],
      },
      {
        path: '/invoice/:id',
        component: () => import('pages/InvoicePage.vue'),
        props: true,
      },
      {
        path: '/cohorts',
        component: () => import('src/pages/CohortsPage.vue'),
      },
      {
        path: '/courses',
        component: () => import('src/pages/CoursesPage.vue'),
      },
      {
        path: '/delegates',
        component: () => import('src/pages/DelegatesPage.vue'),
      },
      {
        path: '/delegate/:id',
        component: () => import('layouts/DelegateLayout.vue'),
        props: true,
        children: [
          {
            path: '',
            component: () => import('pages/DelegateDetails.vue'),
            props: true,
          },
          {
            path: 'receipts',
            name: 'delegateReceipts',
            component: () => import('pages/DelegateReceipts.vue'),
            props: true,
          },
        ],
      },
      { path: '/reports', component: () => import('pages/ReportsPage.vue') },
      { path: '/users', component: () => import('src/pages/UsersPage.vue') },
      {
        path: '/usergroups',
        component: () => import('pages/UserGroups.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/LoginPage.vue'),
    meta: { isGuest: true },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
