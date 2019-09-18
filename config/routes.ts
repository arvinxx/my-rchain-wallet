import { IRoute } from 'umi-types';

const routes: IRoute[] = [
  {
    path: '/',
    // component: '../layouts/SecurityLayout',
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
          // {
          //   path: '/transaction',
          //   name: 'transaction',
          //   icon: 'profile',
          // },
          {
            component: './404',
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
