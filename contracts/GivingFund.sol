// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./DonationFundToken.sol";
import "./TicketToken.sol";

contract GivingFund is ERC721 {
    DonationFundToken private donationFundToken;
    TicketToken private ticketToken;

    uint public totalDonation = 0;
    uint public prizePool = 0;
    uint public prizePoolWon = 0;
    uint public charityAmount = 0;
    address payable _owner;
    mapping(uint => GiftInfo) public giftList;
    mapping(uint => uint) public giftRedeemList;

    constructor(DonationFundToken _donationFundToken, TicketToken _ticketToken) ERC721("Giving Fund NFT", "GFNFT") public {
        _owner = msg.sender;
        donationFundToken = _donationFundToken;
        ticketToken = _ticketToken;
    }

    struct GiftInfo {
        uint nftid;
        uint startDate;
        uint amount;
        address payable from;
    }

    event Gifted (
        uint nftid,
        uint startDate,
        uint stakeAmount,
        address payable from
    );

    event Unstaked (
        uint nftid,
        uint startDate,
        uint stakeAmount,
        address payable from
    );

    event WonWheel (
        address buyer,
        string result,
        uint amount,
        uint randomNumber,
        uint wheelNumber
    );

    event GiftTokenSent (
        address indexed from,
        uint nftId,
        uint redeemId
    );

    event RedeemGiftTokenHistory (
        address indexed from,
        uint nftId,
        uint redeemId
    );

    event BuyDonation (
        uint buyAmount,
        address payable from
    );
    
    // Buy Donation Fund Token and get Ticket Token
    function purchaseDonationFundToken(uint _nftId) payable public  {
        // Bonus Donation Fund Token when using Matching Fund NFT
        if(_nftId > 0) {
            require(ownerOf(_nftId) == msg.sender, "You do not own this NFT");
            GiftInfo storage _data = giftList[_nftId];
            require(msg.value >= _data.amount, "You must donate equal or more than the matching amount");
            donationFundToken.mint(msg.sender, _data.amount * 20);
            prizePool += _data.amount * 30 / 100;
            charityAmount += _data.amount * 70 / 100;
            transferFrom(msg.sender, address(this), _nftId);
        }
        prizePool +=  msg.value * 30 / 100;
        charityAmount += msg.value * 70 / 100;
        totalDonation += msg.value;
        donationFundToken.mint(msg.sender, msg.value * 20);
        ticketToken.mint(msg.sender, msg.value * 10);

        emit BuyDonation(msg.value, msg.sender);
    }

    // Create Matching Fund NFT
    function mintMatchingGiftNFT() payable public  {
        // Create NFT
        uint _nftId = totalSupply().add(1);
        _safeMint(msg.sender, _nftId);

        giftList[_nftId] = GiftInfo(_nftId, block.timestamp, msg.value, msg.sender);

        emit Gifted(_nftId, block.timestamp, msg.value, msg.sender);
    }

    // Transfer the Match NFT to contract
    function giveGiftNFT(uint _nftId) public {
        transferFrom(msg.sender, address(this), _nftId);

        uint randomNumber = getRandomValue(99999999999999999);
        giftRedeemList[randomNumber] = _nftId;

        emit GiftTokenSent(msg.sender, _nftId, randomNumber);
    }

    // User redeem for Gift NFT by redeem Id
    function redeemToken(uint _redeemId) public {
        uint _nftId = giftRedeemList[_redeemId];
        _transfer(address(this), msg.sender, _nftId);

        emit RedeemGiftTokenHistory(msg.sender, _nftId, _redeemId);
    }

    // Pay 1 Ticket token to spin the wheel and a chance to earn reward
    function useTicketToken() public {
        ticketToken.burn(msg.sender, 10 ** 18);
        uint randomNumber = getRandomValue(100);
        string memory result;
        uint amount;
        uint wheelNumber;

        if(randomNumber > 90){
            result = "50% Prize Pool";
            amount = (prizePool * 50) / 100;
            msg.sender.transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 8;
        }
        else if(randomNumber > 80){
            result = "25% Prize Pool";
            amount = (prizePool * 25) / 100;
            msg.sender.transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 7;
        }
        else if(randomNumber > 70){
            result = "10 Tickets";
            amount = 0;
            ticketToken.mint(msg.sender, 10 * 10 ** 18);
            wheelNumber = 6;
        }
        else if(randomNumber > 60){
            result = "5 Tickets";
            amount = 0;
            ticketToken.mint(msg.sender, 5 * 10 ** 18);
            wheelNumber = 5;
        }
        else if(randomNumber > 50){
            result = "15% Prize Pool";
            amount = (prizePool * 15) / 100;
            msg.sender.transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 4;
        }
        else if(randomNumber > 50){
            result = "10% Prize Pool";
            amount = (prizePool * 10) / 100;
            msg.sender.transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 3;
        }
        else if(randomNumber > 30){
            result = "5% Prize Pool";
            amount = (prizePool * 5) / 100;
            msg.sender.transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 2;
        }
        else{
            result = "Nothing";
            amount = 0;
            wheelNumber = 1;
        }

        emit WonWheel(msg.sender, result, amount, randomNumber, wheelNumber);
    }

    // Get the prize pool
    function getPrizePool() public view returns (uint) {
        return address(this).balance;
    }

    // Return a random number 0 - 100
    function getRandomValue(uint mod) internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(now, block.difficulty, msg.sender))) % mod;
    }

    // WARMING: Remove this on production
    // Withdraw all the funds from the contract
    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }

    // WARMING: Remove this on production
    // Get 10 Ticket Tokens
    function ticketTokenFaucet() public {
        ticketToken.mint(msg.sender, 1e19);
    }
}