const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const fs = require("fs");

module.exports = merge(common, {
    mode: 'production',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        host: '0.0.0.0',
        port: 30000,
        allowedHosts: 'all',
        open: false,
        hot: true,
        compress: true,
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
});