// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Lottery.sol";

contract LotteryStorage {
    address owner;

    mapping(address => bool) lotteryStorage;
    address payable[] lotteries;
    address payable[] unfinishedLotteries;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function lotteryExists(address _lotteryId) external view returns (bool) {
        return lotteryStorage[_lotteryId];
    }

    function getLotteries() external view returns (address payable[] memory) {
        return lotteries;
    }

    function getUnfinishedLotteries() external view returns (address payable[] memory) {
        return unfinishedLotteries;
    }

    function setLottery(address payable _lotteryId) external onlyOwner {
        lotteryStorage[_lotteryId] = true;
        lotteries.push(_lotteryId);
        insertToUnFinishedLotteries(_lotteryId);
    }

    function removeFirstLotteryFinished() public onlyOwner {
        unfinishedLotteries[0] = unfinishedLotteries[unfinishedLotteries.length - 1];
        unfinishedLotteries.pop();
    }

    function insertToUnFinishedLotteries(address payable _lotteryId) internal {
        (,uint256 date,,,,,,,,) = Lottery(_lotteryId).infoLottery();
        uint256 i = 0;
        uint256 date2;
        for (; i < unfinishedLotteries.length; i++) {
            (,date2,,,,,,,,) = Lottery(unfinishedLotteries[i]).infoLottery();
            if (date < date2) {
                break;                
            }
        }
        unfinishedLotteries.push(payable(0x0000000000000000000000000000000000000000));
        for(uint256 j = unfinishedLotteries.length-1; j > i; j--) {
            unfinishedLotteries[j] = unfinishedLotteries[j - 1];
        }
        unfinishedLotteries[i] = _lotteryId;
    }

}
