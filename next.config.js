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

const nextConfig = {
  webpack: (config, options) => {
    const { isServer } = options;

    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'ignore-loader',
      });
    }

    return config;
  },
};


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
], nextConfig)
