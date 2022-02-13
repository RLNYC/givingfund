// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GiftToken is ERC20 {
    mapping(uint => uint) public giftTokenAmountList;

    event GiftTokenSent (
        address from,
        uint amount,
        uint redeemId
    );

    event RedeemGiftTokenHistory (
        address to,
        uint redeemId
    );

    constructor() public payable ERC20("Gift Token", "GT") {}

    function purchaseToken() public payable{
        _mint(msg.sender, msg.value);
    }

    // User burn tokens and contract create a random redeem Id
    function sendTokenToSomeone(uint256 amount) public {
        _burn(msg.sender, amount);
        uint randomNumber = getRandomValue(99999999999999999);
        giftTokenAmountList[randomNumber] = amount;

        emit GiftTokenSent(msg.sender, amount, randomNumber);
    }

    // User redeem for Gift token by redeem Id
    function redeemToken(uint redeemId) public {
        _mint(msg.sender, giftTokenAmountList[redeemId]);
         giftTokenAmountList[redeemId] = 0;

         emit RedeemGiftTokenHistory(msg.sender, redeemId);
    }

    //  Redeem for Gift token by redeem Id to someone
    function redeemTokenOnBehalf(uint redeemId, address to) public {
        _mint(to, giftTokenAmountList[redeemId]);
        giftTokenAmountList[redeemId] = 0;

         emit RedeemGiftTokenHistory(msg.sender, redeemId);
    }

    // Return a random number 0 - 100
    function getRandomValue(uint mod) internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(now, block.difficulty, msg.sender))) % mod;
    }
}