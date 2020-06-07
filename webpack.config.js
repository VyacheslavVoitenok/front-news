const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  // Точка входа (откуда брать файл)
  entry: {
    main: './src/index.js',
    secondary: './src/secondary/index.js',
  },
  // Точка выхода (куда будут записываться фалы)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].[chunkhash].js',
  },
  // Правила обработки файлов при сборке
  module: {
    rules: [
      {
        test: /\.js$/, // регулярное выражение, которое ищет все js файлы
        use: { loader: 'babel-loader' }, // весь JS обрабатывается пакетом babel-loader
        exclude: /node_modules/, // исключает папку node_modules
      },
      {
        test: /\.css$/i, // применять это правило только к CSS-файлам
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: { publicPath: '../' },
        },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './images/[name].[ext]', // указали папку, куда складывать изображения
              esModule: false,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=./vendor/[name].[ext]&publicPath=../',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/[name].[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: ['default'],
      },
      canPrint: true,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      filename: './index.html',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/secondary/index.html',
      filename: './secondary/index.html',
    }),
    new WebpackMd5Hash(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
