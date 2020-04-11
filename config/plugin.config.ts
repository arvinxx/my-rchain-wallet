import path from 'path';

function getModulePackageName(module: { context: string }) {
  if (!module.context) return null;

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName: string | null = moduleDirName;
  // handle tree shaking
  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)![1];
  }
  return packageName;
}
export default (config: any) => {
  // share the same chunks across different modules
  config.optimization.runtimeChunk(false).splitChunks({
    chunks: 'all',
    automaticNameDelimiter: '.',
    name: true,
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendors: {
        name: 'vendors',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|redux-saga|re-select|dva|moment|bip39|google-protobuf)[\\/]/,
        priority: -10,
      },
      antdesigns: {
        name: 'antdesigns',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
        priority: -11,
      },
      default: {
        minChunks: 1,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  });

  //css的修改
  config.plugin('extract-css').use(require('mini-css-extract-plugin'), [
    {
      filename: `[name].css`,
      chunkFilename: `[name].[contenthash:8].chunk.css`,
    },
  ]);
  //js的修改
  config.output.filename('[name].[contenthash:8].js');
};
