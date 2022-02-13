// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const StakeToken = await hre.ethers.getContractFactory("StakeToken");
  const stakeToken = await StakeToken.deploy();

  await stakeToken.deployed();

  console.log("Stake token deployed to:", stakeToken.address);


  const TicketToken = await hre.ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.deploy();

  await ticketToken.deployed();

  console.log("Ticket token deployed to:", ticketToken.address);

  const StakeWheel = await hre.ethers.getContractFactory("StakeWheel");
  const stakeWheel = await StakeWheel.deploy(stakeToken.address, ticketToken.address);

  await stakeWheel.deployed();

  console.log("Stake Wheel deployed to:", stakeWheel.address);

  const GiftToken = await hre.ethers.getContractFactory("GiftToken");
  const giftToken = await GiftToken.deploy();

  await giftToken.deployed();

  console.log("Gift Token deployed to:", giftToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
