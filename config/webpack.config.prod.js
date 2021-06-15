const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "../", "build"),
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: "raw-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name][contenthash:6].[ext]",
              outputPath: "images",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 70,
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          // eslint options (if necessary)
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          outputPath: "../fonts",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/templates/template.html",
      title: "nowa aplikacja",
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].css",
    }),
    new ESLintPlugin(),
    new HandlebarsPlugin({
      entry: path.join(process.cwd(), "app", "src", "*.hbs"),
      output: path.join(process.cwd(), "build", "[name].html"),
      data: require("./app/data/project.json"),
      data: path.join(__dirname, "app/data/project.json"),
      partials: [
        path.join(process.cwd(), "app", "src", "components", "*", "*.hbs"),
      ],
      helpers: {
        nameOfHbsHelper: Function.prototype,
        projectHelpers: path.join(
          process.cwd(),
          "app",
          "helpers",
          "*.helper.js"
        ),
      },
    }),
  ],
};
