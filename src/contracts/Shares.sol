// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract Shares is IERC20,Context {
contract Shares is Context {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    address contractOwner;

    uint256 private _totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(address _to,uint256 _amount,address _contractOwner){
        contractOwner = _contractOwner;
        _mint(_to, _amount);
    }

    modifier onlyCreator() {
        require(msg.sender == contractOwner,"Caller is not the owner");
        _;                              
    }

    function decimals() public view virtual returns (uint8) {
        return 0;
    }


    function totalSupply() public view virtual returns (uint256) {
    // function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    // function balanceOf(address account) public view virtual override returns (uint256) {
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    function approve(
        address owner,
        address spender,
        uint256 amount
    ) public virtual onlyCreator returns(bool){
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }
/*
    function approve(address spender, uint256 amount) pure external returns (bool){
        revert("Not implemented");
    }

    function transfer(address to, uint256 amount) pure external returns (bool){
        revert("Not implemented");
    }
*/


    function allowance(address owner, address spender) public view virtual onlyCreator returns (uint256) {
    // function allowance(address owner, address spender) public view virtual override onlyCreator returns (uint256) {
        return _allowances[owner][spender];
    }


    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual onlyCreator returns (bool) {
    // ) public virtual override onlyCreator returns (bool) {
        _transfer(from, to, amount);
        return true;
    }

    function burn(address account, uint256 amount) public virtual onlyCreator {
        require(account != address(0), "ERC20: burn from the zero address");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] = accountBalance - amount;
        // Overflow not possible: amount <= accountBalance <= totalSupply.
        //_totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 currentAllowance = allowance(from, to);
        require(currentAllowance == amount, "ERC20: insufficient allowance");


        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}


