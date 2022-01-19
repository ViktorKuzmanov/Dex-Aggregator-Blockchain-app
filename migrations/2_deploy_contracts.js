const DexAggregator = artifacts.require("DexAggregator");

module.exports = function (deployer) {
  deployer.deploy(DexAggregator);
  
};
