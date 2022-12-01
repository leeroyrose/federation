const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.ts',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.([jt])sx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          experimentalWatchApi: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '...', '.graphql'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs',
    },
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'graphs/**/assets/*.graphql'),
          to: ({ context }) => path.join(context, 'dist/assets/[name][ext]'),
          globOptions: {
            ignore: ['**/.DS_Store', '**/Thumbs.db'],
            dot: true,
            gitignore: true,
          },
        },
      ],
    }),
  ],
};
