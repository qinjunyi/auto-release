const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NpmDtsPlugin = require('npm-dts-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.ts',
  // devtool: 'inline-source-map',
  // watch: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', 'json']
  },
  target: 'node',
  output: {
    library: { name: 'release', type: 'umd', export: 'default' },
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new NpmDtsPlugin({ entry: './index.ts', output: './dist/index.d.ts' })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
};
