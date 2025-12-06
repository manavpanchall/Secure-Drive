const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Add fallback for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/"),
    "querystring": require.resolve("querystring-es3"),
    "path": require.resolve("path-browserify"),
    "fs": false, // fs is not needed in browser
    "zlib": require.resolve("browserify-zlib"),
    "assert": require.resolve("assert/"),
    "util": require.resolve("util/"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser")
  };

  // Add plugins for polyfills
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  ];

  // Add PostCSS loader configuration
  const postcssLoader = config.module.rules
    .find(rule => rule.oneOf)
    .oneOf.find(rule =>
      rule.test && 
      rule.test.toString().includes('.css') &&
      rule.use &&
      rule.use.some(use => use.loader && use.loader.includes('postcss-loader'))
    );

  if (postcssLoader) {
    postcssLoader.use.forEach(use => {
      if (use.loader && use.loader.includes('postcss-loader')) {
        use.options = {
          ...use.options,
          postcssOptions: {
            plugins: [
              require('tailwindcss'),
              require('autoprefixer'),
            ],
          },
        };
      }
    });
  }

  return config;
};