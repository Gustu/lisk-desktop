/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const fs = require('fs');
const path = require('path');
const reactToolboxVariables = require('./reactToolbox.config');
const I18nScannerPlugin = require('../src/i18n-scanner');
const bundleVersion = require('../package.json').version;

const getLocales = (url) => {
  const file = fs.readFileSync(path.join(__dirname, url));
  const str = [];
  const langs = file.toString().match(/.*:\s{\r?\n/g);
  langs.forEach((item) => {
    str.push(item.match(/[a-z]{2}/g)[0]);
  });
  return str.join('|');
};
/* eslint-enable import/no-extraneous-dependencies */

const langRegex = getLocales('../i18n/languages.js');
const entries = {
  app: `${resolve(__dirname, '../src')}/main.js`,
  head: `${resolve(__dirname, '../src/assets/css')}/styles.head.css`,
};
// const extractHeadCSS = new MiniCssExtractPlugin({
//   filename: 'head.css',
//   allChunks: false,
// });
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    // minimize: true,
    // importLoaders: 1,
    modules: {
      mode: 'local',
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  },
};
const headCssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    modules: false,
  },
};
// const headCssLoadersConfig = { ...headCssLoader };

const cssLoadersConfig = [
  cssLoader,
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: true,
      sourceComments: true,
      plugins: [
        /* eslint-disable import/no-extraneous-dependencies */
        require('postcss-partial-import')({}),
        require('postcss-mixins')({}),
        require('postcss-nesting')({}),
        require('postcss-preset-env')({
          stage: 0,
          features: {
            'custom-properties': {
              variables: reactToolboxVariables,
            },
          },
        }),
        require('postcss-functions')({
          functions: {
            rem: px => `${(px / 10)}rem`,
          },
        }),
        require('postcss-for')({}),
        /* eslint-enable import/no-extraneous-dependencies */
      ],
    },
  },
];

module.exports = {
  entry: entries,
  devtool: 'source-map',
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new DefinePlugin({
      VERSION: `"${bundleVersion}"`,
    }),
    new StyleLintPlugin({
      context: `${resolve(__dirname, '../src')}/`,
      files: '**/*.css',
      config: {
        extends: 'stylelint-config-standard',
        rules: {
          'selector-pseudo-class-no-unknown': null,
          'unit-whitelist': ['px', 'deg', '%', 'ms', 's'],
          'length-zero-no-unit': null,
          'at-rule-no-unknown': null,
          'selector-no-vendor-prefix': true,
          'no-descending-specificity': null,
        },
      },
    }),
    // new MiniCssExtractPlugin({
    //   filename: 'head.css',
    //   allChunks: false,
    //   id: 1,
    //   chunkFilename: 'head.css',
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      allChunks: true,
      id: 2,
      chunkFilename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      VERSION: bundleVersion,
      inject: false,
      inlineSource: '.(css)$',
      excludeChunks: ['head'],
      parameters: {
        style: 'styles.[hash].css',
        bundle: 'bundle.vendor.[hash].js',
        app: 'bundle.app.[hash].js',
      },
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new I18nScannerPlugin({
      translationFunctionNames: ['i18next.t', 'props.t', 'this.props.t', 't'],
      outputFilePath: './i18n/locales/en/common.json',
      files: [
        './i18n/**/*.js',
        './src/**/*.js',
        './app/src/**/*.js',
      ],
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(langRegex)),
  ],
  module: {
    rules: [
      {
        test: /styles\.head\.css$/,
        use: [MiniCssExtractPlugin.loader, headCssLoader],
      },
      {
        test: /^((?!styles\.head).)*\.css$/,
        use: [MiniCssExtractPlugin.loader, ...cssLoadersConfig],
      },
    ],
  },
};
