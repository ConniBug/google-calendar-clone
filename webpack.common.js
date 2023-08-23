const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const WebpackPwaManifest = require('webpack-pwa-manifest')

// const BundelAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// "analyze": "webpack --profile --json > stats.json"
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: ["source-map-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(ico|png|svg|webp|)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    // new BundelAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: "output management",
      template: "./src/index.html",
      favicon: "./src/favicon.ico",
      filename: "index.html",
      inject: "head",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new MiniCssExtractPlugin(),
    new WebpackManifestPlugin(
      {
        fileName: 'manifest.json',
        basePath: 'dist/',
      }
    ),
    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),
    new WebpackPwaManifest(
        {
          id: "https://cal.transgirl.space/",

          "dir": "ltr",
          "lang": "en",
          "display_override": [
            "window-controls-overlay"
          ],
          "categories": [
            "productivity"
          ],

          name: "Calendar",
          short_name: "GCal",
          description: "Lil gcal clone",
          background_color: '#e5bdff',
          theme_color: '#2d2d2d',
          orientation: "portrait-primary",
          display: "fullscreen",
          start_url: ".",
          inject: true,
          fingerprints: true,
          ios: true,
          publicPath: "/",
          includeDirectory: true,

          icons: [
            {
              src: path.resolve('src/assets/logo-512x.png'),
              sizes: [512],
              type: "image/png",
            },
            {
              src: path.resolve('src/assets/logo.svg'),
              sizes: [96, 128, 192, 256, 384],
              type: "image/svg",
            },
            {
              src: path.resolve('src/assets/logo-512x.png'),
              sizes: [512],
              type: "image/png",
              purpose: 'maskable',
            },
            {
              src: path.resolve('src/assets/logo.svg'),
              sizes: [96, 128, 192, 256, 384],
              type: "image/svg",
              purpose: 'maskable',
            }
          ],
        }
    ),
    new InjectManifest({
        swSrc: './src/sw.js',
        // swDest: 'service-worker.js',
    })
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
// babel
// {
//   test: /\.js$/,
//   exclude: /node_modules/,
//   use: {
//     loader: "babel-loader",
//     options: {
//       presets: ["@babel/preset-env"],
//     },
//   },
// },