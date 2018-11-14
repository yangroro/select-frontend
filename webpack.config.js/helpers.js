/* eslint-disable */

class NameEveryModulePlugin {
  apply (compiler) {
    compiler.plugin("compilation", (compilation) => {
      compilation.plugin("before-module-ids", (modules) => {
        modules.forEach((module) => {
          if (module.id !== null) return;
          module.id = module.name;
        });
      });
    });
  }
}

module.exports = {
  NameEveryModulePlugin,
};
