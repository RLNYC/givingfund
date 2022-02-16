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
  const DonationFundToken = await hre.ethers.getContractFactory("DonationFundToken");
  const donationFundToken = await DonationFundToken.deploy();

  await donationFundToken.deployed();

  console.log("Donation fund token deployed to:", donationFundToken.address);

  const TicketToken = await hre.ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.deploy();

  await ticketToken.deployed();

  console.log("Ticket token deployed to:", ticketToken.address);

  const GivingFund = await hre.ethers.getContractFactory("GivingFund");
  const givingFund = await GivingFund.deploy(donationFundToken.address, ticketToken.address);

  await givingFund.deployed();

  console.log("Giving Fund deployed to:", givingFund.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
