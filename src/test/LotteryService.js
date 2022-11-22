/*const LotteryService = artifacts.require("LotteryService");
const Lottery = artifacts.require("Lottery");
const expect = require("chai").expect;

contract ("LotteryService", (accounts) => {
    [owner, user1] = accounts;
    console.log("owner: ", owner);
    console.log("user1: ", user1);

    let lotteryServiceInstance;
    let lotteryInstance;
    beforeEach(async () => {
        lotteryServiceInstance = await LotteryService.new(292);
        lotteryInstance = await Lottery.new(10,100,100,lotteryServiceInstance.address,100,"Marina",{from: owner, value: 100});
    });

    it(`owner should be ${owner}`, async () => {
        const _owner = await lotteryServiceInstance.owner();
        expect(_owner).to.equal(owner);
    });   

    it(`subscriptionId`, async () => {
        const subscriptionId = await lotteryServiceInstance.getSubscriptionId();
        expect(subscriptionId.toNumber()).to.equal(292);
    }); 

    it(`addLottery`, async () => {
        const addLottery = await lotteryServiceInstance.addLottery(lotteryInstance.address);
    });


    
});*/
const expect = require("chai").expect;
const hre = require("hardhat");

describe("LotteryService", function () {
    it("Should create a new lottery", async function () {
        const LotteryService = await hre.ethers.getContractFactory("LotteryService");
        const lotteryService = await LotteryService.deploy(292);
        await lotteryService.deployed();

        const Lottery = await hre.ethers.getContractFactory("Lottery");
        const lottery = await Lottery.deploy(10,100,100,lotteryService.address,100,"Marina");
        await lottery.deployed();

        const addLottery = await lotteryService.addLottery(lottery.address);

        expect(await lotteryService.getLotteries()[0]).to.equal(lottery.address);
    });
});
