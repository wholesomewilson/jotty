const { environment } = require('@rails/webpacker')

module.exports = environment
//environment.loaders.delete('nodeModules');
const nodeModulesLoader = environment.loaders.get('nodeModules');
if (!Array.isArray(nodeModulesLoader.exclude)) {
  nodeModulesLoader.exclude = (nodeModulesLoader.exclude == null)
    ? []
    : [nodeModulesLoader.exclude];
}
nodeModulesLoader.exclude.push(/react-s-alert/);
