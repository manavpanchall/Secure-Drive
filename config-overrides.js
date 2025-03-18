const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false, // Mock the fs module
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    path: require.resolve("path-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    querystring: require.resolve("querystring-es3"),
    url: require.resolve("url/"),
    process: require.resolve("process/browser"), // Polyfill for process
  };

  // Add the Buffer and process polyfill plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser", // Polyfill for process
    })
  );

  return config;
};