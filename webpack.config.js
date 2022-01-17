const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

const pkg = require('./package.json');

module.exports = (env, args) => {
  const envData = env.env || 'local';
  console.log(envData, args);
  const config = {
    entry: [
      'webpack/hot/poll?100',
      './src/main.ts',
    ],
    externalsPresets: { node: true },

    target: 'node',

    externals: [
        nodeExternals({
          allowlist: ['webpack/hot/poll?100'],
        }),
    ],

    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
    },
  };
  if (args.mode === 'development') {
    config.devtool = 'source-map';
    config.plugins.push(new RunScriptWebpackPlugin({ name: 'server.js' }));
  }

  return config;
};
