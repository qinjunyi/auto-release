const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, '../tsconfig.json')
            }
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
  }
};
