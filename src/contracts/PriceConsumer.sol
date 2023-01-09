// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//Contrato para obtener el precio de ethereum
contract PriceConsumerV3 {
    AggregatorV3Interface public priceFeed;

    constructor() {
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function getDecimals() public view returns (uint8) {
        return priceFeed.decimals();
    }
}

