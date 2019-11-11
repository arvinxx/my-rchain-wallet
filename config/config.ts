import { IConfig, IPlugin } from 'umi-types';
import { resolve } from 'path';

import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import routes from './routes';

import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings;

const { MY_RCHAIN_WALLET_ONLINE } = process.env;
const isOnline = MY_RCHAIN_WALLET_ONLINE === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'en-US',
        // default true, when it is true, will use `navigator.language` overwrite default
        // baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 1,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-ga',
    {
      code: 'UA-148135393-1',
    },
  ],
  [
    'umi-plugin-auto-externals',
    {
      packages: ['react-dom'],
      urlTemplate: 'https://unpkg.com/{{ library }}@{{ version }}/{{ path }}',
      checkOnline: false,
    },
  ],
];
export default {
  plugins,
  history: 'hash',
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isOnline ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: './src/theme/theme.js',
  //
  //   {
  //   'primary-color': primaryColor,
  // },
  alias: {
    theme: resolve(__dirname, '../src/theme'), // less 全局样式文件
    '@rnode': resolve(process.cwd(), './rnode-grpc-gen'),
    '@ant-design/icons/lib/dist$': resolve(__dirname, '../src/icons.ts'),
  },
  externals: {
    'mixpanel-browser': 'window.mixpanel',
  },
  treeShaking: true,
  define: {
    MY_RCHAIN_WALLET_ONLINE: MY_RCHAIN_WALLET_ONLINE || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const path = match[1].replace('.less', '');
        const arr = slash(path)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `mrw-${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
} as IConfig;
