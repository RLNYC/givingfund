// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./StakeToken.sol";
import "./TicketToken.sol";

contract GivingFund is ERC721 {
    TicketToken private stakeToken;
    TicketToken private ticketToken;

    uint public totalDonation = 0;
    uint public prizePool = 0;
    uint public prizePoolWon = 0;
    uint public charityAmount = 0;
    address payable _owner;
    mapping(uint => StakeInfo) public stakelist;

    constructor(TicketToken _stakeToken, TicketToken _ticketToken) ERC721("Giving Fund NFT", "GFNFT") public {
        _owner = msg.sender;
        stakeToken = _stakeToken;
        ticketToken = _ticketToken;
    }

    struct StakeInfo {
        uint nftid;
        uint startDate;
        uint stakeAmount;
        address payable from;
    }

    event Staked (
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

    // Stake AVAX for Stake Token and get NFT
    function stakeforTokens() payable public  {
        prizePool +=  msg.value * 7 / 100;
        charityAmount += msg.value * 3 / 100;
        totalDonation += msg.value;
        stakeToken.mint(msg.sender, msg.value);
        
        // Create NFT
        uint _tokenId = totalSupply().add(1);
        _safeMint(msg.sender, _tokenId);

        // Record user stake infor
        stakelist[_tokenId] = StakeInfo(_tokenId, block.timestamp, msg.value, msg.sender);

        emit Staked(_tokenId, block.timestamp, msg.value, msg.sender);
    }

    // Unstake Stake Token and get back AVAX
    // Transfer the NFT owned by sender to contract address
    function unstakeToken(uint _nftid) payable public  {
        StakeInfo storage userData = stakelist[_nftid];

        require(ownerOf(_nftid) == msg.sender, "You do not own this NFT");

        // Send the NFT owned by sender to contract address
        transferFrom(msg.sender, address(this), _nftid);

        // Remove Stake Tokens from the sender and send back AVAX
        stakeToken.burn(msg.sender, userData.stakeAmount);
        msg.sender.transfer(userData.stakeAmount);
        totalDonation -= userData.stakeAmount;

        emit Unstaked(_nftid, block.timestamp, msg.value, msg.sender);
    }

    // Claim Ticket Tokens if the user hold Stake Token for a week
    function claimTicketTokens(uint _nftid) public {
        StakeInfo storage userData = stakelist[_nftid];

        // 605543 = 1 week
        require(block.timestamp - userData.startDate > 605543, "You need to wait at least a week to claim Ticket Tokens");
        require(ownerOf(_nftid) == msg.sender, "You do not own this NFT");
        ticketToken.mint(msg.sender, userData.stakeAmount * 2);

        // New start date
        userData.startDate = block.timestamp;
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
    // Get 10 Stake Tokens
    function stakeTokenFaucet() public {
        stakeToken.mint(msg.sender, 1e19);
    }

    // WARMING: Remove this on production
    // Get 10 Ticket Tokens
    function ticketTokenFaucet() public {
        ticketToken.mint(msg.sender, 1e19);
    }

    // WARMING: Remove this on production
    // Change start date when staking
    function changeStakeDate(uint _nftid, uint _newDate) public {
        StakeInfo storage userData = stakelist[_nftid];
        userData.startDate = _newDate;
    }
}