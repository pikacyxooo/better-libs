const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-chain");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

function resolve(dir) {
  return path.join(__dirname, "../", dir);
}

const webpackConfig = new Config();

webpackConfig
  .mode(isProd ? "production" : "development")
  .devtool(isProd ? "false" : "eval-source-map")
  .entry("app")
  .add("./src/main.js")
  .end()
  .output.filename(isProd ? "static/js/[name].[chunkhash].js" : "[name].js")
  .end()
  .resolve.extensions.add(".js")
  .add(".json")
  .add(".ts")
  .end()
  .end()
  .module.rule("transformJs")
  .test(/\.js$/)
  .use("babel")
  .loader("babel-loader")
  .options({
    presets: ["@babel/preset-env"],
  })
  .end()
  .end()
  .rule("ts")
  .test(/\.ts$/)
  .use("ts")
  .loader("ts-loader")
  .options({
    transpileOnly: true,
  })
  .end()
  .end()
  .rule("url")
  .test(/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/)
  .use("url")
  .loader("url-loader")
  .options({
    limit: 10000,
    // name: 'static/img/[name].[hash:7].[ext]'
  })
  .end()
  .end()
  .rule("css")
  .test(/\.css$/)
  .use("style-loader")
  .loader("style-loader")
  .end()
  .use("css-loader")
  .loader("css-loader")
  .end()
  .end()
  .rule("less")
  .test(/\.less$/)
  .use("style-loader")
  .loader("style-loader")
  .end()
  .use("css-loader")
  .loader("css-loader")
  .end()
  .use("less-loader")
  .loader("less-loader")
  .end()
  .end()
  .when(!isProd, () => {
    webpackConfig.devServer
      .open(true)
      .hot(true)
      .compress(true)
      .end()
      .plugin("HotModuleReplacementPlugin")
      .use(webpack.HotModuleReplacementPlugin)
      .end()
      .plugin("HtmlWebpackPlugin")
      .use(HtmlWebpackPlugin, [
        {
          filename: "index.html",
          template: "./src/index.html",
          inject: true,
        },
      ])
      .end();
  });

function getPackagesName() {
  let ret;
  let all = fs.readdirSync(resolve("../../packages"));
  // drop hidden file whose name is startWidth '.'
  // drop packages which would not be published(eg: examples and vuepress-docs)
  ret = all
    .filter((name) => {
      const isHiddenFile = /^\./g.test(name);
      return !isHiddenFile;
    })
    .filter((name) => {
      const isPrivatePackages = require(resolve(
        `../../packages/${name}/package.json`
      )).private;
      return !isPrivatePackages;
    })
    .map((name) => {
      return require(resolve(`../../packages/${name}/package.json`)).name;
    });

  return ret;
}

// add alias
getPackagesName().forEach((name) => {
  webpackConfig.resolve.alias.set(`${name}$`, `${name}/src/index.ts`);
});

let config = webpackConfig.toConfig();

module.exports = config;
