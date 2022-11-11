// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./miERC20.sol";

contract Shares is miERC20 {
    constructor(
        address _to,
        uint256 _amount,
        address _owner
    ) miERC20(_owner) {
        _mint(_to, _amount);
    }
}