// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeToken is ERC20 {
    address public minter;

    event MinterChanged(address indexed from, address to);

    constructor() public payable ERC20("Stake Token", "SKT") {
        minter = msg.sender;
    }

    function passMinterRole(address ticketEvent) public returns (bool) {
        require(msg.sender == minter, "You cannot change minter role");
        minter = ticketEvent;
        
        emit MinterChanged(msg.sender, ticketEvent);
        return true;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, "You cannot mint tokens");

        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        require(msg.sender == minter, "You cannot burn tokens");

        _burn(account, amount);
    }
}