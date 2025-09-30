const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SitemapWebpackPlugin = require('./webpack/sitemap-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/index.tsx",
    devtool: isProduction ? false : 'source-map',
    
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },      
        {
          test: /\.tsx?$/,
          use: [ 'ts-loader' ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          exclude: /node_modules/
        },  
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ],
    },
    
    target: 'web',
    
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      fallback: {
        "buffer": require.resolve("buffer/"),
      }
    },
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      chunkFilename: isProduction ? 'chunks/[name].[contenthash].js' : 'chunks/[name].js',
      publicPath: '/',
      clean: true,
    },
    
    optimization: {
      splitChunks: isProduction ? {
        chunks: 'all',
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors', 
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      } : {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
      minimize: isProduction,
    },
    
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/assets', to: 'assets', noErrorOnMissing: true },
          { from: 'content', to: 'content', noErrorOnMissing: true },
          { from: 'static', to: '', noErrorOnMissing: true },
          { from: 'node_modules/react-pdf/dist/Page/AnnotationLayer.css', to: 'css/react-pdf-annotation.css' },
          { from: 'node_modules/react-pdf/dist/Page/TextLayer.css', to: 'css/react-pdf-text.css' },
          { from: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', to: 'js/pdf.worker.min.js' },
        ],
      }),
      new SitemapWebpackPlugin({
        baseUrl: 'https://www.anionline.me',
        articlesDataPath: 'src/data/articles.json'
      }),
    ],
  };
};