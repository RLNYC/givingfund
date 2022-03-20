// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./DonationFundToken.sol";
import "./TicketToken.sol";

contract GivingFund is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    DonationFundToken private donationFundToken;
    TicketToken private ticketToken;

    uint public totalDonation = 0;
    uint public prizePool = 0;
    uint public prizePoolWon = 0;
    uint public charityAmount = 0;
    mapping(uint => GiftInfo) public giftList;
    mapping(uint => uint) public giftRedeemList;
    mapping(uint => uint) public tokenRedeemList;

    constructor(DonationFundToken _donationFundToken, TicketToken _ticketToken) ERC721("Giving Fund NFT", "GFNFT") {
        donationFundToken = _donationFundToken;
        ticketToken = _ticketToken;
    }

    struct GiftInfo {
        uint nftid;
        uint startDate;
        uint amount;
        address from;
    }

    event Gifted (
        uint nftid,
        uint startDate,
        uint stakeAmount,
        address from
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

    event DonationTokenSent (
        address indexed from,
        uint amount,
        uint redeemId
    );

    event RedeemGiftTokenHistory (
        address indexed from,
        uint nftId,
        uint redeemId
    );

    event RedeemDonationTokenHistory (
        address indexed from,
        uint amount,
        uint redeemId
    );

    event BuyDonation (
        uint buyAmount,
        address from
    );
    
    // Buy Donation Fund Token and get Ticket Token
    function purchaseDonationFundToken(uint _nftId) payable public  {
        // Bonus Donation Fund Token when using Matching Fund NFT
        if(_nftId > 0) {
            require(ownerOf(_nftId) == msg.sender, "You do not own this NFT");
            GiftInfo storage _data = giftList[_nftId];
            require(msg.value >= _data.amount, "You must donate equal or more than the matching amount");
            donationFundToken.mint(msg.sender, _data.amount / 100);     // 1 REEF =  0.01 DFT
        }
        prizePool +=  msg.value * 7 / 100;
        charityAmount += msg.value * 3 / 100;
        totalDonation += msg.value;
        donationFundToken.mint(msg.sender, msg.value / 100);            // 1 REEF =  0.01 DFT
        ticketToken.mint(msg.sender, msg.value / 100);                  // 1 REEF =  0.01 TKT

        emit BuyDonation(msg.value, msg.sender);
    }

    // Create Matching Fund NFT
    function mintMatchingGiftNFT() payable public  {
        _tokenIds.increment();

        // Create NFT
        uint _nftId = _tokenIds.current();
        _safeMint(msg.sender, _nftId);

        giftList[_nftId] = GiftInfo(_nftId, block.timestamp, msg.value, msg.sender);

        emit Gifted(_nftId, block.timestamp, msg.value, msg.sender);
    }

    // Transfer the Match NFT to contract and create Redeem code
    function giveGiftNFT(uint _nftId) public {
        transferFrom(msg.sender, address(this), _nftId);

        uint randomNumber = randomSeed(99999999999999999);
        giftRedeemList[randomNumber] = _nftId;

        emit GiftTokenSent(msg.sender, _nftId, randomNumber);
    }

    // Burn donation token and create Redeem code
    function giveDonationToken(uint _amount) public {
        donationFundToken.burn(msg.sender, _amount);

        uint randomNumber = randomSeed(99999999999999999);
        tokenRedeemList[randomNumber] = _amount;

        emit DonationTokenSent(msg.sender, _amount, randomNumber);
    }

    // User redeem for Gift NFT or donation tokens by redeem Id
    function redeemToken(uint _redeemId) public {
        if(giftRedeemList[_redeemId] > 0 ){
            uint _nftId = giftRedeemList[_redeemId];
            _transfer(address(this), msg.sender, _nftId);
            giftRedeemList[_redeemId] = 0;

            emit RedeemGiftTokenHistory(msg.sender, _nftId, _redeemId);
        }
        else if(tokenRedeemList[_redeemId] > 0 ) {
            uint _amount = tokenRedeemList[_redeemId];
            donationFundToken.mint(msg.sender, _amount);
            tokenRedeemList[_redeemId] = 0;

            emit RedeemDonationTokenHistory(msg.sender, _amount, _amount);
        }
        
    }

    // Pay 1 Ticket token to spin the wheel and a chance to earn reward
    function useTicketToken() public {
        ticketToken.burn(msg.sender, 10 ** 18);
        uint randomNumber = randomSeed(100);
        string memory result;
        uint amount;
        uint wheelNumber;

        if(randomNumber > 90){
            result = "50% Prize Pool";
            amount = (prizePool * 50) / 100;
            payable(msg.sender).transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 8;
        }
        else if(randomNumber > 80){
            result = "25% Prize Pool";
            amount = (prizePool * 25) / 100;
            payable(msg.sender).transfer(amount);
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
            payable(msg.sender).transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 4;
        }
        else if(randomNumber > 50){
            result = "10% Prize Pool";
            amount = (prizePool * 10) / 100;
            payable(msg.sender).transfer(amount);
            prizePool -= amount;
            prizePoolWon += amount;
            wheelNumber = 3;
        }
        else if(randomNumber > 30){
            result = "5% Prize Pool";
            amount = (prizePool * 5) / 100;
            payable(msg.sender).transfer(amount);
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
    function randomSeed(uint mod) internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % mod;
    }

    // WARMING: Remove this on production
    // Withdraw all the funds from the contract
    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    // WARMING: Remove this on production
    // Get 10 Ticket Tokens
    function ticketTokenFaucet() public {
        ticketToken.mint(msg.sender, 1e19);
    }
}