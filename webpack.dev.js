const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const path = require("path");
const fs = require("fs");

module.exports = merge(common, {
    mode: 'development',
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
        https: {
            key: fs.readFileSync("/Users/connibilham/Downloads/site_wild/privkey1.pem"),
            cert: fs.readFileSync("/Users/connibilham/Downloads/site_wild/cert1.pem"),
        },
    },
    devtool: 'inline-source-map',
});