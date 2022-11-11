const LotteryService = artifacts.require("LotteryService");

module.exports = function(deployer) {
  deployer.deploy(LotteryService,235);
};
