const path = require("path");
const webpack = require('webpack')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
require('dotenv').config()

const config = {
  mode: "production",
  entry: {
    vendor: ["@babel/polyfill", "react"],
    app: ["./lib/components/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist/public"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".wasm", ".mjs", "*"]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.SHOPIFY_API_KEY":JSON.stringify(process.env.SHOPIFY_API_KEY)
    })
  ],
};

module.exports = config;