/* eslint-disable */
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
);

const withTM = require('@weco/next-plugin-transpile-modules');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
  [withTM, {
    transpileModules: [
      '@ant-design/pro-layout',
      'antd',
    ],
  }],
  [withLess, {
    cssLoaderOptions: {
      modules: true,
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables, // make your antd custom effective
    },
  }]
])
