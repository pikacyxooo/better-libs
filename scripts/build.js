const fs = require("fs");
const path = require("path");
const rollup = require("rollup");
const typescript = require("rollup-plugin-typescript2");
const uglify = require("rollup-plugin-uglify").uglify;

const formatType = [
  {
    format: "umd",
    ext: ".js",
  },
  {
    format: "umd",
    ext: ".min.js",
  },
  {
    format: "es",
    ext: ".esm.js",
  },
];

function resolve(p) {
  return path.resolve(__dirname, "../", p);
}

function PascalCase(str) {
  const re = /-(\w)/g;
  const newStr = str.replace(re, function (match, group1) {
    return group1.toUpperCase();
  });
  return newStr.charAt(0).toUpperCase() + newStr.slice(1);
}

function getPackagesName() {
  let ret;
  let all = fs.readdirSync(resolve("packages"));
  // drop hidden file whose name is startWidth '.'
  // drop packages which would not be published(eg: examples and docs)
  ret = all
    .filter((name) => {
      const isHiddenFile = /^\./g.test(name);
      return !isHiddenFile;
    })
    .filter((name) => {
      const isPrivatePackages = require(resolve(
        `packages/${name}/package.json`
      )).private;
      return !isPrivatePackages;
    });

  return ret;
}

function generateBuildPluginsConfigs(isMin) {
  const tsConfig = {
    verbosity: -1,
    tsconfig: path.resolve(__dirname, "../tsconfig.json"),
  };
  const plugins = [];
  if (isMin) {
    plugins.push(uglify());
  }
  plugins.push(typescript(tsConfig));
  return plugins;
}

function generateBuildConfig(packagesName) {
  const result = [];
  packagesName.forEach((name) => {
    formatType.forEach((type) => {
      let config = {
        input: resolve(`packages/${name}/src/index.ts`),
        output: {
          file: resolve(`packages/${name}/dist/${name}${type.ext}`),
          name: PascalCase(name),
          format: type.format,
        },
        plugins: generateBuildPluginsConfigs(
          type.ext.indexOf("min") > -1,
          name
        ),
      };
      result.push(config);
    });
  });
  return result;
}

// build entry
function entry() {
  const packagesName = getPackagesName();
  const configs = generateBuildConfig(packagesName);

  configs.forEach((config) => {
    rollup.rollup(config).then((bundle) => {
      bundle.write(config.output);
    });
  });
}

entry();
