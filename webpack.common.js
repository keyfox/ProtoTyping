const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/js/index.ts",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js",
  },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: `${__dirname}/node_modules`,
        use: "ts-loader",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              importLoaders: 2,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /.*/,
        loader: "file-loader",
        include: path.resolve(__dirname, "src/assets"),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
    }),
    new CopyPlugin([{ from: "./**/*", to: "./assets", context: "./src/assets" }]),
  ],
};
