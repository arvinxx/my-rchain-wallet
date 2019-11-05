import { IRoute } from 'umi-types';

const routes: IRoute[] = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user/',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        name: 'login',
        component: '../pages/user/login',
      },
      {
        path: '/user/restore',
        name: 'restore',
        component: '../pages/user/restore',
      },
      {
        path: '/user/signup',
        name: 'signup',
        component: '../pages/user/signup',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/dashboard',
          },
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: 'dashboard',
            component: '../pages/dashboard',
          },
          {
            path: '/transfer',
            name: 'transfer',
            icon: 'transaction',
          },
          {
            path: '/transaction',
            name: 'transaction',
            icon: 'profile',
          },
          {
            path: '/account',
            name: 'account',
            icon: 'user',
            component: '../pages/account',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
];

export default routes;
