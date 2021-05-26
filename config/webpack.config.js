const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "js/[name][hash:6]-bundle.js",
    path: path.resolve(__dirname, "../", "build"),
  },
  devServer: {
    open: true,

  //   inline: false,
    contentBase: path.resolve(__dirname, "../", "public"),
  //   port: 5001,
  // },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: "raw-loader",
      },
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"],
      // },
      // {
      //   test: /\.(sass|scss)$/,
      //   use: ["style-loader", "css-loader", "sass-loader"],
      // },
      // {
      //   test: /\.(jpg|png|svg|jpeg|gif)$/,
      //   use: "file-loader",
      // },
      // {
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader",
      //   options: {
      //     presets: [
      //       ["@babel/preset-env", { useBuiltIns: "usage", corejs: "2.0.0" }],
      //     ],
      //     plugins: ["@babel/plugin-proposal-class-properties"],
      //   },
      // },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/template.html",
      title: "Spotify app",
    }),
  ],
};
