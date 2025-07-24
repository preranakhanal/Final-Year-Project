const path = require('path');

module.exports = {
  entry: {
    popup: './src/index.tsx',
    background: './src/background/background.ts',
    contentScript: './src/content/contentScript.ts',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'source-map',
  mode: 'production',
  // No externals for React or ReactDOM; ensure everything is bundled
};
