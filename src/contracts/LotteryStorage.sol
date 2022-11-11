// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract LotteryStorage {
    address owner;

    // Structures where loteries are saved
    mapping(address => bool) lotteryStorage;
    address[] lotteries;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // *** Getter Methods ***
    /**
    @notice gets a lottery by its address
    @param _key address of the lottery
    @return the lottery
    */
    function lotteryExists(address _key) external view returns (bool) {
        return lotteryStorage[_key];
    }

    /**
    @notice gets all the lotteries saved
    @return the lotteries
    */
    function getLotteries() external view returns (address[] memory) {
        return lotteries;
    }

    // *** Setter Methods ***
    /**
    @notice adds a new lottery to the storage mapping and array
    @dev can only be executed by the latest version contract
    @param _key the address of the lottery
    */
    function setLottery(address _key) external onlyOwner {
        lotteryStorage[_key] = true;
        lotteries.push(_key);
    }
}
